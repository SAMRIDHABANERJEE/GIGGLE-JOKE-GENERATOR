import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("GiggleGlitch: Initializing Neural Root...");

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("GiggleGlitch Fatal: Root element missing.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("GiggleGlitch: System Online.");
  } catch (err) {
    console.error("GiggleGlitch: Mount Failed.", err);
  }
};

// Small delay to ensure all assets and shims are ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}