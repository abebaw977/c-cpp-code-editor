const C_CPP_SNIPPETS = {
    '#include <stdio.h>': '#include <stdio.h>\n',
    '#include <stdlib.h>': '#include <stdlib.h>\n',
    '#include <iostream>': '#include <iostream>\n',
    'main': 'int main() {\n    \n    return 0;\n}',
    'printf': 'printf("\\n");',
    'scanf': 'scanf("%d", &);',
    'for': 'for (int i = 0; i < ; i++) {\n    \n}',
    'while': 'while () {\n    \n}',
    'if': 'if () {\n    \n}',
};

document.addEventListener('DOMContentLoaded', () => {
    setupAutocomplete();
});

function setupAutocomplete() {
    if (!editor) return;
    
    editor.on('inputRead', (instance, changeObj) => {
        if (changeObj.text[0] === '#' || changeObj.text[0].match(/[a-z]/i)) {
            CodeMirror.commands.autocomplete(editor);
        }
    });
}

CodeMirror.registerHelper('hint', 'c-cpp', (editor) => {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const start = token.start;
    const end = cur.ch;
    const word = token.string;
    
    const completions = Object.keys(C_CPP_SNIPPETS)
        .filter(s => s.startsWith(word))
        .map(c => ({
            text: C_CPP_SNIPPETS[c],
            displayText: c
        }));
    
    return {
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end),
        list: completions
    };
});