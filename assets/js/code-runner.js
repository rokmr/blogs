/**
 * Runnable Code Blocks Module (Pyodide)
 * Adds interactive Python code execution in the browser
 */

let pyodideInstance = null;
let pyodideLoading = false;
let pyodideLoadPromise = null;

async function loadPyodide() {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoadPromise) return pyodideLoadPromise;

    pyodideLoading = true;

    // Load Pyodide script
    pyodideLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = async () => {
            try {
                pyodideInstance = await window.loadPyodide();
                pyodideLoading = false;
                resolve(pyodideInstance);
            } catch (e) {
                reject(e);
            }
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });

    return pyodideLoadPromise;
}

async function runPythonCode(code, outputEl) {
    outputEl.classList.remove('error', 'empty');
    outputEl.textContent = 'Loading Python runtime...';

    try {
        const pyodide = await loadPyodide();

        // Auto-detect and load common packages
        const packages = [];
        if (code.includes('import numpy') || code.includes('from numpy')) packages.push('numpy');
        if (code.includes('import pandas') || code.includes('from pandas')) packages.push('pandas');
        if (code.includes('import matplotlib') || code.includes('from matplotlib')) packages.push('matplotlib');

        if (packages.length > 0) {
            outputEl.textContent = `Loading packages: ${packages.join(', ')}...`;
            await pyodide.loadPackagesFromImports(code);
        }

        // Capture stdout
        await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);

        // Run user code
        try {
            await pyodide.runPythonAsync(code);
        } catch (e) {
            // Get stderr if any
            const stderr = await pyodide.runPythonAsync('sys.stderr.getvalue()');
            outputEl.classList.add('error');
            outputEl.textContent = stderr || e.message;
            return;
        }

        // Get stdout
        const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()');

        if (stdout.trim()) {
            outputEl.textContent = stdout;
        } else {
            outputEl.classList.add('empty');
            outputEl.textContent = '(No output)';
        }
    } catch (e) {
        outputEl.classList.add('error');
        outputEl.textContent = `Error: ${e.message}`;
    }
}

function initRunnableCodeBlocks() {
    document.querySelectorAll('.runnable').forEach(container => {
        const codeEl = container.querySelector('pre code');
        if (!codeEl) return;

        const originalCode = codeEl.textContent;
        const lang = container.dataset.lang || 'python';

        // Build wrapper structure with CodeMirror container
        const wrapper = document.createElement('div');
        wrapper.className = 'runnable-code';
        wrapper.innerHTML = `
      <div class="runnable-header">
        <span class="runnable-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Interactive ${lang}
        </span>
        <div class="runnable-actions">
          <button class="reset-btn" type="button" title="Reset to original code">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            Reset
          </button>
          <button class="run-btn" type="button">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Run
          </button>
        </div>
      </div>
      <div class="runnable-body">
        <div class="code-editor-container"></div>
      </div>
      <div class="runnable-output" style="display: none;">
        <div class="output-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          Output
        </div>
        <div class="output-content"></div>
      </div>
    `;

        container.replaceWith(wrapper);

        // Initialize CodeMirror editor
        const editorContainer = wrapper.querySelector('.code-editor-container');
        const cmEditor = CodeMirror(editorContainer, {
            value: originalCode,
            mode: 'python',
            theme: 'material-darker',
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            lineWrapping: true,
            viewportMargin: Infinity,
            extraKeys: {
                'Tab': (cm) => cm.execCommand('indentMore'),
                'Shift-Tab': (cm) => cm.execCommand('indentLess')
            }
        });

        // Wire up buttons
        const runBtn = wrapper.querySelector('.run-btn');
        const resetBtn = wrapper.querySelector('.reset-btn');
        const outputSection = wrapper.querySelector('.runnable-output');
        const outputContent = wrapper.querySelector('.output-content');

        // Run button - uses current editor content
        runBtn.addEventListener('click', async () => {
            runBtn.disabled = true;
            runBtn.classList.add('loading');
            runBtn.innerHTML = '<span class="spinner"></span> Running...';
            outputSection.style.display = 'block';

            const currentCode = cmEditor.getValue();
            await runPythonCode(currentCode, outputContent);

            runBtn.disabled = false;
            runBtn.classList.remove('loading');
            runBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run`;
        });

        // Reset button - restores original code
        resetBtn.addEventListener('click', () => {
            cmEditor.setValue(originalCode);
            resetBtn.classList.add('reset-flash');
            setTimeout(() => resetBtn.classList.remove('reset-flash'), 300);
        });
    });
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initRunnableCodeBlocks = initRunnableCodeBlocks;
    window.loadPyodide = loadPyodide;
    window.runPythonCode = runPythonCode;
}
