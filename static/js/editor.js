// CodeMirror Editor Instance
let editor;
let currentFile = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeEditor();
    setupEventListeners();
    loadFileTree();
});

function initializeEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        lineNumbers: true,
        mode: 'text/x-csrc',
        theme: 'material-darker',
        indentUnit: 4,
        indentWithTabs: false,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        styleActiveLine: true,
        extraKeys: {
            'Ctrl-S': saveCurrentFile,
            'Ctrl-Shift-B': compileCode,
            'Ctrl-Enter': runCode,
            'Tab': handleTab
        }
    });
}

function setupEventListeners() {
    document.getElementById('compileBtn').addEventListener('click', compileCode);
    document.getElementById('runBtn').addEventListener('click', runCode);
    document.getElementById('newFileBtn').addEventListener('click', openNewFileModal);
    document.getElementById('clearOutputBtn').addEventListener('click', clearOutput);
    document.getElementById('refreshBtn').addEventListener('click', loadFileTree);
    
    document.getElementById('createFileBtn').addEventListener('click', createNewFile);
    document.getElementById('cancelFileBtn').addEventListener('click', closeNewFileModal);
}

function handleTab(cm) {
    if (cm.somethingSelected()) {
        cm.indentSelection('add');
    } else {
        cm.replaceSelection('    ');
    }
}

async function loadFile(filepath) {
    try {
        const response = await fetch(`/api/file/${filepath}`);
        const data = await response.json();
        
        if (data.success) {
            const ext = filepath.split('.').pop();
            const mode = (ext === 'cpp' || ext === 'hpp') ? 'text/x-c++src' : 'text/x-csrc';
            editor.setOption('mode', mode);
            
            editor.setValue(data.content);
            currentFile = filepath;
            
            createTab(filepath);
            editor.markClean();
            
            showSuccess('File loaded');
        }
    } catch (error) {
        showError('Failed to load file: ' + error.message);
    }
}

function createTab(filepath) {
    const tabsContainer = document.getElementById('tabsContainer');
    
    const existingTab = tabsContainer.querySelector(`[data-file="${filepath}"]`);
    if (existingTab) {
        existingTab.remove();
    }
    
    const tab = document.createElement('div');
    tab.className = 'tab active';
    tab.setAttribute('data-file', filepath);
    tab.innerHTML = `
        <span>${filepath.split('/').pop()}</span>
        <span class="tab-close">✕</span>
    `;
    
    tab.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-close')) {
            saveCurrentFile();
            loadFile(filepath);
            updateActiveTabs(filepath);
        }
    });
    
    tab.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        tab.remove();
        if (currentFile === filepath) {
            currentFile = null;
            editor.setValue('');
        }
    });
    
    tabsContainer.appendChild(tab);
    updateActiveTabs(filepath);
}

function updateActiveTabs(filepath) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-file') === filepath);
    });
}

async function saveCurrentFile() {
    if (!currentFile) return;
    
    const content = editor.getValue();
    
    try {
        const response = await fetch(`/api/file/${currentFile}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        
        const data = await response.json();
        if (data.success) {
            editor.markClean();
        }
    } catch (error) {
        console.error('Save error:', error);
    }
}

async function compileCode() {
    if (!currentFile) {
        showError('No file open');
        return;
    }
    
    const fileExt = currentFile.split('.').pop();
    if (!['c', 'cpp'].includes(fileExt)) {
        showError('Only .c or .cpp files can be compiled');
        return;
    }
    
    await saveCurrentFile();
    
    const language = fileExt === 'cpp' ? 'cpp' : 'c';
    
    try {
        showOutput('⚙️ Compiling...');
        const response = await fetch('/api/compile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filepath: currentFile, language })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showOutput(`<span class="success">✓ Compilation successful!</span>\n${data.output || ''}`);
            window.lastExecutable = data.executable;
        } else {
            showOutput(`<span class="error">✗ Compilation failed:\n${data.error}</span>`);
        }
    } catch (error) {
        showError('Compilation error: ' + error.message);
    }
}

async function runCode() {
    if (!window.lastExecutable) {
        showError('Compile code first');
        return;
    }
    
    const input = document.getElementById('programInput').value;
    
    try {
        showOutput('▶️ Running...');
        const response = await fetch('/api/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ executable: window.lastExecutable, input })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showOutput(`${data.output}${data.error ? `\n<span class="error">${data.error}</span>` : ''}`);
        } else {
            showOutput(`<span class="error">Error: ${data.error}</span>`);
        }
    } catch (error) {
        showError('Run error: ' + error.message);
    }
}

function openNewFileModal() {
    document.getElementById('newFileModal').classList.add('open');
    document.getElementById('newFileName').focus();
}

function closeNewFileModal() {
    document.getElementById('newFileModal').classList.remove('open');
    document.getElementById('newFileName').value = '';
}

async function createNewFile() {
    const filename = document.getElementById('newFileName').value.trim();
    
    if (!filename) {
        showError('Filename required');
        return;
    }
    
    if (!filename.endsWith('.c') && !filename.endsWith('.cpp')) {
        showError('File must be .c or .cpp');
        return;
    }
    
    try {
        const response = await fetch(`/api/file/${filename}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: '' })
        });
        
        const data = await response.json();
        if (data.success) {
            closeNewFileModal();
            loadFileTree();
            loadFile(filename);
            showSuccess('File created');
        }
    } catch (error) {
        showError('Failed to create file: ' + error.message);
    }
}

function clearOutput() {
    document.getElementById('outputArea').innerHTML = '<p class="placeholder">Output cleared</p>';
}

function showOutput(message) {
    document.getElementById('outputArea').innerHTML = message;
}

function showError(message) {
    const output = document.getElementById('outputArea');
    output.innerHTML = `<span class="error">✗ Error: ${message}</span>`;
}

function showSuccess(message) {
    console.log('✓ ' + message);
}