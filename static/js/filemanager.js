async function loadFileTree() {
    try {
        const response = await fetch('/api/files');
        const data = await response.json();
        
        if (data.success) {
            renderFileTree(data.files);
        }
    } catch (error) {
        console.error('Failed to load file tree:', error);
    }
}

function renderFileTree(files, parentElement = null) {
    if (!parentElement) {
        parentElement = document.getElementById('fileTree');
        parentElement.innerHTML = '';
    }
    
    files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-tree-item';
        
        if (file.type === 'folder') {
            item.innerHTML = `
                <span class="file-tree-item-icon">📁</span>
                <span class="file-tree-item-name">${file.name}</span>
            `;
            
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'file-tree-folder-children';
            
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'file-tree-folder-item';
            renderFileTree(file.children || [], childrenDiv);
            childrenContainer.appendChild(childrenDiv);
            
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                childrenContainer.classList.toggle('open');
            });
            
            parentElement.appendChild(item);
            parentElement.appendChild(childrenContainer);
        } else {
            const icon = file.extension === 'cpp' || file.extension === 'hpp' ? '⚙️' : 'ℂ';
            item.innerHTML = `
                <span class="file-tree-item-icon">${icon}</span>
                <span class="file-tree-item-name">${file.name}</span>
            `;
            
            item.addEventListener('click', () => {
                loadFile(file.path);
            });
            
            parentElement.appendChild(item);
        }
    });
}