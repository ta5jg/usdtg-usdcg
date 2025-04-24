import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center px-4">
    <div className="max-w-4xl w-full">
        <App />
      </div>
    </div>
  </React.StrictMode>
);