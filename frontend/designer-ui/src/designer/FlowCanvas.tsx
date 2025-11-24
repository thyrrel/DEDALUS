// src/designer/FlowCanvas.tsx (FINAL)

import React, { useState, useRef, useCallback, DragEvent, FC } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    MiniMap,
    Background,
    Connection,
    Edge,
    Node,
    useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css'; // Estilos padrão do React Flow
import { apiService } from '../api/apiService'; // Para salvar o workflow no backend

// --- Definições de Nós Padrão ---
// Isso garante que o React Flow saiba como renderizar nossos nós customizados
import { CustomNode } from './NodeDefaults'; // Em um arquivo separado para organização

const NODE_TYPES = { customNode: CustomNode }; // Mapeamento para nós customizados

// Estilo básico para o container do FlowCanvas
const flowContainerStyle: React.CSSProperties = {
    flexGrow: 1, // Faz com que o canvas ocupe o espaço restante
    height: '100vh', // Altura total da viewport
    background: '#e0e0e0' // Cor de fundo suave
};

let id = 0; // Contador simples para gerar IDs únicos de nós
const getId = () => `dndnode_${id++}`; // Função para gerar IDs

/**
 * Componente principal do Canvas de Design, onde os workflows são montados.
 */
export const FlowCanvas: FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();

    // Lida com a criação de uma nova conexão entre nós
    const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    /**
     * Lida com o evento de 'soltar' (drop) um módulo do catálogo no canvas.
     * @param event O evento de arrastar.
     */
    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            // Verifica se o elemento solto é um nó do nosso catálogo
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            // Calcula a posição do nó no canvas
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // Cria um novo nó com base no tipo arrastado
            const newNode: Node = {
                id: getId(),
                type: 'customNode', // Usamos um tipo de nó customizado para todos
                position,
                data: { label: `${type} Node`, type: type, config: {} }, // Dados passados para o componente CustomNode
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes, screenToFlowPosition]
    );

    /**
     * Previne o comportamento padrão para permitir o 'drop'.
     * @param event O evento de arrastar.
     */
    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    /**
     * Converte o estado atual do React Flow para o formato IWorkflow do Backend.
     * @returns O objeto IWorkflow.
     */
    const convertFlowToWorkflow = (): any => { // Retorno 'any' por simplicidade no mock
        const workflowNodes = nodes.map(node => {
            // Mapeia cada nó do React Flow para o formato IWorkflowNode do backend
            return {
                id: node.id,
                type: node.data.type, // Tipo do módulo (Ex: 'ExternalAPICall', 'startNode')
                name: node.data.label,
                config: node.data.config || {}, // Configurações específicas do módulo
                // Lógica para 'next': encontra a aresta de saída deste nó.
                next: edges.filter(edge => edge.source === node.id).map(edge => edge.target)
            };
        });

        const startNode = workflowNodes.find(n => n.type === 'startNode');

        if (!startNode) {
            alert('Por favor, adicione um nó de "Início" ao seu workflow.');
            throw new Error('Workflow inválido: Nó inicial ausente.');
        }

        return {
            name: `Workflow-${new Date().toLocaleTimeString()}`, // Nome provisório
            version: 1,
            authorId: 'designer',
            nodes: workflowNodes,
            startNodeId: startNode.id,
        };
    };
    
    /**
     * Salva o workflow atual no Backend DEDALUS.
     */
    const onSaveWorkflow = async () => {
        try {
            const workflow = convertFlowToWorkflow();
            console.log('Salvando Workflow:', workflow);
            const response = await apiService.createWorkflow(workflow);
            alert(`Workflow salvo! ID: ${response.id}`);
        } catch (error: any) {
            console.error('Erro ao salvar workflow:', error);
            alert(`Erro ao salvar workflow: ${error.message || 'Verifique o console.'}`);
        }
    };

    return (
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={flowContainerStyle}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={NODE_TYPES} // Registra os tipos de nó customizados
                fitView // Ajusta a visualização para caber todos os nós
            >
                <MiniMap />
                <Controls />
                <Background variant="dots" gap={12} size={1} />
                
                {/* Botão de Salvar Workflow */}
                <button 
                    onClick={onSaveWorkflow} 
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}
                >
                    💾 Salvar Workflow
                </button>
            </ReactFlow>
        </div>
    );
};
