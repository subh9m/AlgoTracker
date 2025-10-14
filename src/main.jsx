import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 Add the basename prop here */}
    <BrowserRouter basename="/AlgoTracker">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
