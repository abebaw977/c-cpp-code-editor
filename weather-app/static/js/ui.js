/**
 * UI Utilities
*/

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    const suggestions = document.getElementById('searchSuggestions');
    const input = document.getElementById('cityInput');
    
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('searchSuggestions').classList.remove('active');
    }
});
