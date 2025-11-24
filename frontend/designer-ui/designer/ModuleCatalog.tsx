// src/designer/ModuleCatalog.tsx (FINAL)

import React, { FC, DragEvent } from 'react';
import { useCatalog } from '../hooks/useCatalog';

// O tipo de dado transferido durante o evento de arrastar.
// É essencial para que o 'FlowCanvas' saiba qual nó criar ao soltar.
const DRAG_TYPE = 'application/reactflow';

/**
 * Componente da Sidebar que exibe o Catálogo de Módulos disponíveis.
 * Permite arrastar os tipos de nó para o canvas de design.
 */
export const ModuleCatalog: FC = () => {
    // Consome o hook para obter o estado do catálogo
    const { modules, isLoading, error } = useCatalog();

    /**
     * Lida com o evento de início de arrastar.
     * Define o tipo de dado e o nome do nó que está sendo arrastado.
     * @param event O evento de arrastar.
     * @param nodeType O nome do módulo/tipo de nó (Ex: 'ExternalAPICall').
     */
    const onDragStart = (event: DragEvent, nodeType: string) => {
        // Define o tipo de dado e o nome do nó.
        event.dataTransfer.setData(DRAG_TYPE, nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    if (isLoading) {
        return (
            <div className="module-catalog-sidebar loading">
                <p>⚙️ Carregando Catálogo do DEDALUS...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="module-catalog-sidebar error">
                <p>❌ Erro: {error}</p>
                <p>Verifique se o Backend está rodando em http://localhost:3000.</p>
            </div>
        );
    }

    return (
        <aside className="module-catalog-sidebar">
            <h3>🧩 Catálogo de Módulos DEDALUS</h3>
            
            {/* Bloco de Nós Fixos (Start e End) */}
            <div 
                className="dnd-node start-node" 
                onDragStart={(event) => onDragStart(event, 'startNode')} 
                draggable
            >
                ▶️ Início (startNode)
            </div>
            <div 
                className="dnd-node end-node" 
                onDragStart={(event) => onDragStart(event, 'endNode')} 
                draggable
            >
                ⏹️ Fim (endNode)
            </div>
            
            <hr />
            
            {/* Módulos Carregados Dinamicamente do Backend */}
            <p>Módulos de Conector ({modules.length}):</p>
            
            {modules.map(moduleName => (
                <div
                    key={moduleName}
                    className="dnd-node connector-node"
                    // Inicia o evento de arrastar com o nome do módulo
                    onDragStart={(event) => onDragStart(event, moduleName)}
                    draggable
                >
                    🔗 {moduleName}
                </div>
            ))}
            
            <style jsx="true">{`
                .module-catalog-sidebar {
                    width: 200px;
                    padding: 10px;
                    border-right: 1px solid #ddd;
                    background: #f9f9f9;
                    font-family: Arial, sans-serif;
                }
                .dnd-node {
                    height: 35px;
                    padding: 8px;
                    margin: 8px 0;
                    border-radius: 5px;
                    cursor: grab;
                    text-align: center;
                    font-size: 14px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .dnd-node:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .start-node { background: #b3e5fc; border: 1px solid #03a9f4; }
                .end-node { background: #ffcdd2; border: 1px solid #f44336; }
                .connector-node { background: #c8e6c9; border: 1px solid #4caf50; }
            `}</style>
        </aside>
    );
};
