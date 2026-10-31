
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SiteProvider>
        <App />
      </SiteProvider>
    </AuthProvider>
  </React.StrictMode>
);
