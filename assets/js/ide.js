/**
 * ide.js — Python IDE logic
 * Handles: CodeMirror init, Pyodide runtime, run/copy/clear,
 *          vertical resizer, keyboard shortcuts, status indicator.
 *
 * Place at: assets/js/ide.js
 * Loaded after: codemirror, pyodide, and page HTML are ready.
 */

(function () {
  'use strict';

  if (!document.getElementById('ide-root')) return;

  // ── Default starter code ──────────────────────────────────────────────────
  const DEFAULT_CODE = `# Welcome to the Python IDE
# Shortcut: Ctrl+Enter to run

import math

def fibonacci(n):
    a, b = 0, 1
    seq = []
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return seq

nums = fibonacci(10)
print("Fibonacci sequence:")
print(nums)
print(f"Sum: {sum(nums)}")
print(f"Largest: {max(nums)}")
print(f"Golden ratio approx: {nums[-1]/nums[-2]:.6f}")
print(f"Actual phi: {(1 + math.sqrt(5)) / 2:.6f}")
`;

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const statusDot  = document.getElementById('status-dot');
  const statusTxt  = document.getElementById('status-txt');
  const runBtn     = document.getElementById('run-btn');
  const copyBtn    = document.getElementById('copy-btn');
  const clearBtn   = document.getElementById('clear-btn');
  const outputEl   = document.getElementById('output-content');
  const editorPane = document.getElementById('editor-pane');
  const outputPane = document.getElementById('output-pane');
  const resizerEl  = document.getElementById('ide-resizer');

  // ── CodeMirror setup ──────────────────────────────────────────────────────
  const cm = CodeMirror.fromTextArea(document.getElementById('cm-editor'), {
    mode: 'python',
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    lineWrapping: false,
    extraKeys: {
      'Ctrl-Enter': () => runCode(),
      'Cmd-Enter':  () => runCode(),
      'Ctrl-/':     (editor) => editor.execCommand('toggleComment'),
      'Cmd-/':      (editor) => editor.execCommand('toggleComment'),
      'Tab': (editor) => {
        if (editor.somethingSelected()) {
          editor.indentSelection('add');
        } else {
          editor.replaceSelection('    ', 'end');
        }
      },
      'Shift-Tab': (editor) => editor.indentSelection('subtract'),
    },
  });

  cm.setValue(DEFAULT_CODE);

  requestAnimationFrame(() => {
    cm.setSize('100%', editorPane.clientHeight || 360);
    cm.refresh();
  });

  // ── Output helpers ────────────────────────────────────────────────────────
  function setOutput(text, isError = false, isEmpty = false) {
    outputEl.className = isEmpty ? 'empty' : (isError ? 'out-error' : '');
    outputEl.textContent = text;
  }

  function appendInfoLine(text) {
    const node = document.createElement('div');
    node.className = 'out-info';
    node.textContent = text;
    outputEl.appendChild(node);
  }

  // ── Run button icon helpers ───────────────────────────────────────────────
  function setRunIcon(state) {
    const i = runBtn.querySelector('i');
    if (!i) return;
    if (state === 'loading') {
      i.className = 'ti ti-loader-2';
    } else {
      i.className = 'ti ti-player-play';
    }
  }

  // ── Pyodide init ──────────────────────────────────────────────────────────
  let pyodide = null;

  async function initPyodide() {
    try {
      pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
      });
      statusDot.className = 'ready';
      runBtn.disabled = false;
      runBtn.title = 'Run (Ctrl+Enter)';
    } catch (err) {
      statusDot.className = 'error';
      statusTxt.textContent = 'Load error';
      setOutput('Failed to load Pyodide runtime:\n' + err.message, true);
      console.error('[IDE] Pyodide load failed', err);
    }
  }

  // ── Run code ──────────────────────────────────────────────────────────────
  async function runCode() {
    if (!pyodide || runBtn.disabled) return;

    runBtn.disabled = true;
    setRunIcon('loading');
    setOutput('');

    let captured = '';
    pyodide.setStdout({ batched: (s) => { captured += s + '\n'; } });
    pyodide.setStderr({ batched: (s) => { captured += s + '\n'; } });

    const t0 = performance.now();
    try {
      await pyodide.runPythonAsync(cm.getValue());
      const ms = Math.round(performance.now() - t0);
      outputEl.className = '';
      outputEl.textContent = captured.trimEnd() || '(no output)';
      appendInfoLine(`\n✓ Finished in ${ms}ms`);
    } catch (err) {
      const ms = Math.round(performance.now() - t0);
      outputEl.className = 'out-error';
      outputEl.textContent = (captured ? captured + '\n' : '') + err.message;
      appendInfoLine(`\n✗ Failed in ${ms}ms`);
    }

    runBtn.disabled = false;
    setRunIcon('play');
  }

  // ── Button actions ────────────────────────────────────────────────────────
  runBtn.addEventListener('click', runCode);

  clearBtn.addEventListener('click', () => {
    outputEl.className = 'empty';
    outputEl.textContent = 'Output cleared.';
  });

  copyBtn.addEventListener('click', () => {
    const code = cm.getValue();
    const doFallback = () => {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    };

    const showCopied = () => {
      const i = copyBtn.querySelector('i');
      copyBtn.classList.add('copied');
      if (i) i.className = 'ti ti-check';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (i) i.className = 'ti ti-copy';
      }, 1500);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(showCopied).catch(() => {
        doFallback();
        showCopied();
      });
    } else {
      doFallback();
      showCopied();
    }
  });

  // ── Vertical resizer ──────────────────────────────────────────────────────
  let isResizing = false;
  let resizeStartY = 0;
  let resizeStartH = 0;

  resizerEl.addEventListener('mousedown', (e) => {
    isResizing   = true;
    resizeStartY = e.clientY;
    resizeStartH = outputPane.offsetHeight;
    resizerEl.classList.add('dragging');
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const ideRoot   = document.getElementById('ide-root');
    const toolbarH  = document.getElementById('ide-toolbar').offsetHeight;
    const totalH    = ideRoot.clientHeight;
    const delta     = resizeStartY - e.clientY;
    const maxOut    = totalH - toolbarH - resizerEl.offsetHeight - 80;
    const newH      = Math.max(40, Math.min(resizeStartH + delta, maxOut));
    outputPane.style.height = newH + 'px';
    cm.setSize('100%', editorPane.clientHeight);
    cm.refresh();
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    resizerEl.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    cm.refresh();
  });

  // ── Touch resizer ─────────────────────────────────────────────────────────
  resizerEl.addEventListener('touchstart', (e) => {
    const touch  = e.touches[0];
    isResizing   = true;
    resizeStartY = touch.clientY;
    resizeStartH = outputPane.offsetHeight;
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isResizing) return;
    const touch   = e.touches[0];
    const ideRoot = document.getElementById('ide-root');
    const maxOut  = ideRoot.clientHeight - document.getElementById('ide-toolbar').offsetHeight - resizerEl.offsetHeight - 80;
    const newH    = Math.max(40, Math.min(resizeStartH + (resizeStartY - touch.clientY), maxOut));
    outputPane.style.height = newH + 'px';
    cm.setSize('100%', editorPane.clientHeight);
    cm.refresh();
  }, { passive: true });

  document.addEventListener('touchend', () => {
    isResizing = false;
    cm.refresh();
  });

  // ── Window resize ─────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    cm.setSize('100%', editorPane.clientHeight);
    cm.refresh();
  });

  // ── Boot ──────────────────────────────────────────────────────────────────
  initPyodide();

})();