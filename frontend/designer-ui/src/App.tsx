// src/App.tsx (FINAL)

import React, { FC } from 'react';
import { ReactFlowProvider } from 'reactflow';

import { ModuleCatalog } from './designer/ModuleCatalog'; // Importa a Sidebar
import { FlowCanvas } from './designer/FlowCanvas';     // Importa o Canvas

/**
 * Componente principal da aplicação DEDALUS Designer UI.
 * Gerencia o layout e a integração dos componentes principais.
 */
const App: FC = () => {
    return (
        // O ReactFlowProvider é NECESSÁRIO para que o FlowCanvas use os hooks (como useReactFlow)
        <ReactFlowProvider>
            <div className="designer-layout">
                {/* 1. Sidebar do Catálogo de Módulos (componente de arrastar) */}
                <ModuleCatalog />
                
                {/* 2. Área principal do Canvas (componente de soltar/design) */}
                <main className="canvas-area">
                    <FlowCanvas />
                </main>
            </div>
        </ReactFlowProvider>
    );
};

export default App;
