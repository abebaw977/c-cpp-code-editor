let saveTimer = null;
const SAVE_INTERVAL = 2000;

document.addEventListener('DOMContentLoaded', () => {
    setupAutoSave();
});

function setupAutoSave() {
    if (!editor) return;
    
    editor.on('change', () => {
        clearTimeout(saveTimer);
        
        saveTimer = setTimeout(() => {
            if (currentFile && !editor.isClean()) {
                saveCurrentFile();
            }
        }, SAVE_INTERVAL);
    });
}