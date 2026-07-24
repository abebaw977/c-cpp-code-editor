#!/usr/bin/env python3
"""
C/C++ Web Code Editor - Flask Backend
Main application server with file management and compilation support
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import json
import subprocess
import time
from datetime import datetime
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Configuration
BASE_DIR = Path(__file__).parent
WORKSPACE_DIR = BASE_DIR / 'workspace'
UPLOAD_FOLDER = WORKSPACE_DIR / 'projects'
COMPILE_FOLDER = WORKSPACE_DIR / 'compiled'

# Create necessary directories
WORKSPACE_DIR.mkdir(exist_ok=True)
UPLOAD_FOLDER.mkdir(exist_ok=True)
COMPILE_FOLDER.mkdir(exist_ok=True)

# File size limit (10 MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

# Supported extensions
SUPPORTED_EXTENSIONS = {'.c', '.cpp', '.h', '.hpp', '.txt', '.md'}


@app.route('/')
def index():
    """Serve the main editor page"""
    return render_template('index.html')


@app.route('/api/files', methods=['GET'])
def get_files():
    """Get all files in workspace with tree structure"""
    try:
        file_tree = build_file_tree(UPLOAD_FOLDER)
        return jsonify({'success': True, 'files': file_tree})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/file/<path:filepath>', methods=['GET'])
def get_file(filepath):
    """Get file contents"""
    try:
        file_path = UPLOAD_FOLDER / filepath
        
        # Security check
        if not str(file_path).startswith(str(UPLOAD_FOLDER)):
            return jsonify({'success': False, 'error': 'Invalid file path'}), 403
        
        if not file_path.exists():
            return jsonify({'success': False, 'error': 'File not found'}), 404
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return jsonify({
            'success': True,
            'content': content,
            'path': filepath,
            'modified': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/file/<path:filepath>', methods=['POST'])
def save_file(filepath):
    """Save file contents (auto-save)"""
    try:
        file_path = UPLOAD_FOLDER / filepath
        
        # Security check
        if not str(file_path).startswith(str(UPLOAD_FOLDER)):
            return jsonify({'success': False, 'error': 'Invalid file path'}), 403
        
        # Create parent directories if needed
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        data = request.get_json()
        content = data.get('content', '')
        
        # Check file size
        if len(content.encode('utf-8')) > MAX_FILE_SIZE:
            return jsonify({'success': False, 'error': 'File too large'}), 413
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return jsonify({
            'success': True,
            'message': 'File saved',
            'modified': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/file/<path:filepath>', methods=['DELETE'])
def delete_file(filepath):
    """Delete a file"""
    try:
        file_path = UPLOAD_FOLDER / filepath
        
        # Security check
        if not str(file_path).startswith(str(UPLOAD_FOLDER)):
            return jsonify({'success': False, 'error': 'Invalid file path'}), 403
        
        if not file_path.exists():
            return jsonify({'success': False, 'error': 'File not found'}), 404
        
        file_path.unlink()
        
        return jsonify({'success': True, 'message': 'File deleted'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/folder/<path:folderpath>', methods=['POST'])
def create_folder(folderpath):
    """Create a new folder"""
    try:
        folder_path = UPLOAD_FOLDER / folderpath
        
        # Security check
        if not str(folder_path).startswith(str(UPLOAD_FOLDER)):
            return jsonify({'success': False, 'error': 'Invalid folder path'}), 403
        
        folder_path.mkdir(parents=True, exist_ok=True)
        
        return jsonify({'success': True, 'message': 'Folder created'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/rename/<path:oldpath>', methods=['POST'])
def rename_file(oldpath):
    """Rename file or folder"""
    try:
        data = request.get_json()
        newname = data.get('newname')
        
        if not newname:
            return jsonify({'success': False, 'error': 'New name required'}), 400
        
        old_path = UPLOAD_FOLDER / oldpath
        new_path = old_path.parent / newname
        
        # Security check
        if not str(old_path).startswith(str(UPLOAD_FOLDER)) or \
           not str(new_path).startswith(str(UPLOAD_FOLDER)):
            return jsonify({'success': False, 'error': 'Invalid path'}), 403
        
        if not old_path.exists():
            return jsonify({'success': False, 'error': 'File/folder not found'}), 404
        
        old_path.rename(new_path)
        
        return jsonify({'success': True, 'message': 'Renamed successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/compile', methods=['POST'])
def compile_code():
    """Compile C/C++ code"""
    try:
        data = request.get_json()
        filepath = data.get('filepath')
        language = data.get('language', 'c')
        
        if not filepath:
            return jsonify({'success': False, 'error': 'File path required'}), 400
        
        file_path = UPLOAD_FOLDER / filepath
        
        # Security check
        if not str(file_path).startswith(str(UPLOAD_FOLDER)):
            return jsonify({'success': False, 'error': 'Invalid file path'}), 403
        
        if not file_path.exists():
            return jsonify({'success': False, 'error': 'File not found'}), 404
        
        # Check file extension
        if file_path.suffix not in {'.c', '.cpp'}:
            return jsonify({'success': False, 'error': 'Invalid file type'}), 400
        
        # Determine compiler and output file
        compiler = 'g++' if language == 'cpp' or file_path.suffix == '.cpp' else 'gcc'
        output_file = COMPILE_FOLDER / f"{file_path.stem}_compiled"
        
        # Compile
        try:
            result = subprocess.run(
                [compiler, str(file_path), '-o', str(output_file)],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                return jsonify({
                    'success': True,
                    'message': 'Compilation successful',
                    'output': result.stderr,
                    'executable': str(output_file)
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Compilation failed',
                    'error': result.stderr
                }), 400
        except subprocess.TimeoutExpired:
            return jsonify({'success': False, 'error': 'Compilation timeout'}), 408
        except FileNotFoundError:
            return jsonify({
                'success': False,
                'error': f'{compiler} not found. Please install GCC/G++'
            }), 500
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/run', methods=['POST'])
def run_code():
    """Run compiled C/C++ program"""
    try:
        data = request.get_json()
        executable = data.get('executable')
        input_data = data.get('input', '')
        
        if not executable:
            return jsonify({'success': False, 'error': 'Executable required'}), 400
        
        exec_path = Path(executable)
        
        # Security check
        if not str(exec_path).startswith(str(COMPILE_FOLDER)):
            return jsonify({'success': False, 'error': 'Invalid executable path'}), 403
        
        if not exec_path.exists():
            return jsonify({'success': False, 'error': 'Executable not found'}), 404
        
        # Run program
        try:
            result = subprocess.run(
                [str(exec_path)],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=5
            )
            
            return jsonify({
                'success': True,
                'output': result.stdout,
                'error': result.stderr,
                'return_code': result.returncode
            })
        except subprocess.TimeoutExpired:
            return jsonify({'success': False, 'error': 'Program execution timeout'}), 408
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/snippets', methods=['GET'])
def get_snippets():
    """Get C/C++ code snippets"""
    from backend.snippets import SNIPPETS
    return jsonify({'success': True, 'snippets': SNIPPETS})


def build_file_tree(directory, prefix=''):
    """Build file tree structure recursively"""
    items = []
    
    try:
        entries = sorted(directory.iterdir(), key=lambda x: (not x.is_dir(), x.name))
        
        for entry in entries:
            if entry.name.startswith('.'):
                continue
            
            rel_path = str(entry.relative_to(UPLOAD_FOLDER))
            
            if entry.is_dir():
                items.append({
                    'name': entry.name,
                    'path': rel_path,
                    'type': 'folder',
                    'children': build_file_tree(entry)
                })
            elif entry.suffix in SUPPORTED_EXTENSIONS:
                items.append({
                    'name': entry.name,
                    'path': rel_path,
                    'type': 'file',
                    'extension': entry.suffix[1:]
                })
    except PermissionError:
        pass
    
    return items


if __name__ == '__main__':
    # Create sample project structure
    sample_project = UPLOAD_FOLDER / 'Sample'
    sample_project.mkdir(exist_ok=True)
    
    # Create sample C file if it doesn't exist
    sample_c = sample_project / 'hello.c'
    if not sample_c.exists():
        sample_c.write_text('''#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
''')
    
    app.run(debug=True, host='0.0.0.0', port=5000)
