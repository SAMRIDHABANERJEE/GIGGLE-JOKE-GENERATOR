
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Boot the application
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
