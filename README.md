# C/C++ Web Code Editor

A browser-based code editor for C and C++ with live compilation, file management, and mobile-responsive design.

## Features

- 🎨 **Syntax Highlighting** - Color-coded C/C++ syntax
- 📁 **File Manager** - VSCode-like file tree view
- 💾 **Live Saving** - Auto-save as you type
- 🔧 **Auto-Indentation** - Smart code formatting
- 📱 **Mobile Responsive** - Works on Android/Samsung devices
- 🚀 **Live Compilation** - Compile C/C++ code in real-time
- 📋 **Code Snippets** - Pre-built C/C++ templates
- ⚡ **Autocomplete** - Intelligent code suggestions

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Editor**: CodeMirror with C/C++ mode
- **Syntax Highlighting**: Highlight.js
- **Compilation**: GCC/G++ backend

## Installation

```bash
# Clone the repository
git clone https://github.com/abebaw977/c-cpp-code-editor.git
cd c-cpp-code-editor

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

Visit `http://localhost:5000` in your browser.

## File Structure

```
c-cpp-code-editor/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── editor.js
│   │   ├── filemanager.js
│   │   ├── autocomplete.js
│   │   └── live-save.js
│   └── lib/               # External libraries
├── templates/
│   └── index.html
├── backend/
│   ├── __init__.py
│   └── snippets.py
└── workspace/             # User project files
```

## Usage

1. **Create/Open Files** - Use the file tree on the left
2. **Write Code** - Code auto-saves every 2 seconds
3. **Compile** - Click "Compile" or press `Ctrl+Shift+B`
4. **View Output** - See results in the output panel

## Mobile Support

Fully responsive design for:
- Samsung A04
- Other Android devices
- Tablets

## Requirements

- Python 3.7+
- GCC/G++ compiler
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Keyboard Shortcuts

- `Ctrl+S` - Save current file
- `Ctrl+Shift+B` - Compile code
- `Ctrl+Enter` - Run compiled program
- `Tab` - Auto-indent

## Contributing

Pull requests welcome!

## License

MIT License