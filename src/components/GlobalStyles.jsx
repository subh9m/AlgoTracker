import React from 'react';

const GlobalStyles = () => (
  <style>{`
    :root {
      /* --- LIGHT MODE VARS --- */
      --primary-color: #ff0000;
      --background-color: #ffffff;
      --surface-color: #f9f9f9;
      --text-color: #1f2937;
      --text-color-secondary: #6b7280;
      --border-color: #e5e7eb;
    }

    html.dark {
      /* --- DARK MODE VARS --- */
      --primary-color: #ff0000;
      --background-color: #000000;
      --surface-color: #0a0a0a;
      --text-color: #e0e0e0;
      --text-color-secondary: #a0a0a0;
      --border-color: #333333;
    }

    /* * REMOVED the 'body' rule from here. 
     * Your 'index.css' @layer base rule now controls the body.
     */

    html {
      scroll-behavior: smooth;
    }
    
    .algo-code {
      background-color: var(--surface-color); /* CHANGED */
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: "IBM Plex Mono", monospace;
      font-size: 14px;
      max-width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--border-color); /* CHANGED */
      margin-top: 10px;
    }
    
    .quote-fade-out { opacity: 0; transform: translateY(8px); }
    .quote-fade-in { opacity: 1; transform: translateY(0); }
    
    .progress-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      background: transparent;
      outline: none;
      cursor: pointer;
    }
    .progress-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(255,0,0,0.2);
      border: 2px solid var(--background-color); /* CHANGED */
      margin-top: -6px;
    }
    .progress-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: var(--primary-color);
      border: none;
      box-shadow: 0 0 0 4px rgba(255,0,0,0.2);
    }
    
    .nothing-focus-timer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
      font-family: "IBM Plex Mono", monospace;
      background: transparent;
      color: var(--text-color); /* CHANGED */
      text-align: center;
      padding: 2rem;
    }
    .nothing-focus-timer.fullscreen-active {
      background: var(--background-color); /* CHANGED */
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      justify-content: center;
    }
    .nothing-focus-timer .timer-display {
      font-size: 3.5rem;
      color: var(--text-color); /* CHANGED */
      letter-spacing: 2px;
      font-weight: 500;
    }
    .nothing-focus-timer .timer-dots { display: flex; gap: 6px; }
    .nothing-focus-timer .dot {
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--border-color); /* CHANGED */
      transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
    .nothing-focus-timer .dot.active {
      background: var(--primary-color);
      box-shadow: 0 0 8px var(--primary-color);
    }
    .nothing-focus-timer .timer-controls { display: flex; gap: 1rem; }
    .nothing-focus-timer .timer-btn {
      background: transparent; border: 1px solid var(--primary-color);
      color: var(--primary-color); padding: 0.5rem 1.2rem;
      cursor: pointer; font-size: 0.9rem; letter-spacing: 1px;
      border-radius: 0.75rem;
      transition: all 0.3s ease-in-out;
    }
    .nothing-focus-timer .timer-btn:hover { 
      background: var(--primary-color); 
      color: var(--background-color); /* CHANGED */
      box-shadow: 0 0 20px rgba(255,0,0,0.4);
    }
    .nothing-focus-timer .timer-status {
      font-size: 0.9rem; color: var(--text-color-secondary); /* CHANGED */
      letter-spacing: 1px;
      text-transform: uppercase;
    }


    /* Makes the read-only code editor look disabled */
.prism-editor-readonly {
  background-color: #f3f4f6; /* light gray */
  cursor: not-allowed;
  opacity: 0.8;
}

/* Dark mode style for read-only editor */
.dark .prism-editor-readonly {
  background-color: #1f2937; /* dark gray */
}


/* --- TOGGLE SWITCH STYLES --- */
.toggle-switch-control {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
}

.toggle-switch-label {
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  color: #374151; /* gray-700 */
}
.dark .toggle-switch-label {
  color: #d1d5db; /* gray-300 */
}

.toggle-switch-checkbox {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch-slider {
  position: relative;
  display: block;
  width: 40px;
  height: 22px;
  background-color: #ccc;
  border-radius: 34px;
  transition: 0.4s;
}
.dark .toggle-switch-slider {
  background-color: #374151; /* gray-700 */
}

.toggle-switch-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

.toggle-switch-checkbox:checked + .toggle-switch-slider {
  background-color: #ef4444; /* red-500 */
}

.toggle-switch-checkbox:checked + .toggle-switch-slider:before {
  transform: translateX(18px);
}
/* --- END TOGGLE SWITCH --- */

/* --- READ-ONLY EDITOR STYLE --- */
/* Makes the read-only code editor look disabled */
.prism-editor-readonly {
  background-color: #f3f4f6; /* gray-100 */
  cursor: not-allowed;
  opacity: 0.8;
}

/* Dark mode style for read-only editor */
.dark .prism-editor-readonly {
  background-color: #1f2937; /* gray-800 */
}

    
    /* * REMOVED '.save-btn' rule.
     * It's already defined in 'index.css'
     */

    /*
     * REMOVED all '.modal-*' rules.
     * They are already defined in 'index.css'
     */

    /* --- Form Styles within Modal --- */
    /* * REMOVED all '.form-*' rules.
     * They are already defined in 'index.css'
     */
  `}</style>
);

export default GlobalStyles;