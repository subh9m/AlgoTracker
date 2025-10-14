import React from 'react';

const GlobalStyles = () => (
  <style>{`
    :root {
      --primary-color: #ff0000;
      --background-color: #000000;
      --surface-color: #0a0a0a;
      --text-color: #e0e0e0;
      --border-color: #333333;
    }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background-color: var(--background-color);
      background-image: radial-gradient(circle at 10% 20%, rgba(255, 0, 0, 0.1), transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(255, 0, 0, 0.08), transparent 50%);
      color: var(--text-color);
      line-height: 1.7;
      overflow-x: hidden;
      min-height: 100vh;
    }
    html {
      scroll-behavior: smooth;
    }
    .algo-code {
      background-color: #0d0d0d;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: "IBM Plex Mono", monospace;
      font-size: 14px;
      max-width: 100%;
      box-sizing: border-box;
      border: 1px solid #222;
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
      border: 2px solid var(--background-color);
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
      color: #fff;
      text-align: center;
      padding: 2rem;
    }
    .nothing-focus-timer.fullscreen-active {
      background: var(--background-color);
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
      color: var(--text-color);
      letter-spacing: 2px;
      font-weight: 500;
    }
    .nothing-focus-timer .timer-dots { display: flex; gap: 6px; }
    .nothing-focus-timer .dot {
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--border-color);
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
      color: var(--background-color);
      box-shadow: 0 0 20px rgba(255,0,0,0.4);
    }
    .nothing-focus-timer .timer-status {
      font-size: 0.9rem; color: #aaa; letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    /* --- Save Button --- */
    .save-btn {
      background: var(--primary-color); 
      color: var(--background-color);
      padding: 0.6rem 1.5rem;
      cursor: pointer; 
      font-size: 0.9rem; 
      letter-spacing: 1px;
      font-weight: 600;
      border-radius: 0.5rem;
      border: none;
      transition: all 0.3s ease-in-out;
    }
    .save-btn:hover {
      box-shadow: 0 0 20px rgba(255,0,0,0.5);
      transform: translateY(-2px);
    }

    /* --- Modal Styles --- */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }
    .modal-content {
      background-color: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      width: 90%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .modal-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      background-color: var(--surface-color);
      z-index: 1;
    }
    .modal-title {
      color: var(--text-color);
      font-size: 1.25rem;
      font-weight: 600;
    }
    .modal-close-btn {
      background: none;
      border: none;
      color: var(--text-color);
      font-size: 2rem;
      line-height: 1;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .modal-close-btn:hover {
      opacity: 1;
    }
    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* --- Form Styles within Modal --- */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: #a0a0a0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .form-input,
    .form-textarea {
      background-color: #050505;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: var(--text-color);
      font-size: 1rem;
      width: 100%;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.2);
    }
    .form-textarea {
      min-height: 120px;
      font-family: inherit;
      resize: vertical;
    }
    .solution-textarea {
      min-height: 200px;
      font-family: "IBM Plex Mono", monospace;
      font-size: 0.9rem;
    }
  `}</style>
);

export default GlobalStyles;
