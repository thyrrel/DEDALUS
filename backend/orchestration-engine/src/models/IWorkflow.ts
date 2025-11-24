// src/models/IWorkflow.ts

/**
 * Define o formato de dados para um nó (Node) individual no workflow.
 * Um nó pode ser uma função, um conector, ou uma regra lógica.
 */
export interface IWorkflowNode {
    id: string;                     // ID único do nó (UUID)
    type: string;                   // Tipo de componente (ex: 'connector', 'rule', 'function', 'start', 'end')
    name: string;                   // Nome legível
    config: Record<string, any>;    // Configurações específicas do módulo (ex: URL do conector, parâmetros)
    next?: string | string[];       // Próximo nó ou lista de nós para lógica condicional
}

/**
 * Define a interface principal de um Workflow DEDALUS.
 * Este é o objeto que será salvo no banco de dados e interpretado pelo Engine.
 */
export interface IWorkflow {
    id: string;                     // ID único do Workflow
    name: string;                   // Nome descritivo (ex: 'Processamento de Pedido')
    version: number;                // Versão atual do Workflow
    description?: string;           // Descrição detalhada
    authorId: string;               // ID do criador
    createdAt: Date;                // Data de criação
    
    // O array principal que contém todos os nós do fluxo
    nodes: IWorkflowNode[];
    
    // Indica o ponto de início da execução
    startNodeId: string;
}
