
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component, removed .tsx

// --- Boot ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);

// Component to handle hiding the boot screen after mounting
const BootWrapper: React.FC = () => {
  useEffect(() => {
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) {
      // Use opacity and transition for a smoother fade-out, then remove
      bootScreen.style.transition = 'opacity 0.5s ease-out';
      bootScreen.style.opacity = '0';
      bootScreen.addEventListener('transitionend', () => {
        bootScreen.remove(); // Remove from DOM after fade-out
      }, { once: true });
    }
  }, []);

  return <App />;
};

root.render(<BootWrapper />);
