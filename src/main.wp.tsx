import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './AuthContext.wp';
import App from './App.wp';
import './index.css';

console.log('AcademicAssist: Script loaded');

// Wait for DOM to be ready
function initApp() {
  console.log('AcademicAssist: initApp called');
  
  // Find the WordPress container
  const container = document.getElementById('academic-assist-root');
  
  console.log('AcademicAssist: Looking for container', container);
  
  if (container) {
    console.log('AcademicAssist: Container found, mounting React app');
    // Clear loading state
    container.innerHTML = '';
    
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.StrictMode>
    );
  } else {
    console.error('AcademicAssist: Container #academic-assist-root not found');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
