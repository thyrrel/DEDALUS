// src/index.tsx (FINAL)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Importa os estilos globais

// Busca o elemento raiz onde a aplicação React será injetada (geralmente <div id="root">)
const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
