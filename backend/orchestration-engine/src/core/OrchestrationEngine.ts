// src/core/OrchestrationEngine.ts (FINAL)

import { IWorkflow, IWorkflowNode } from '../models/IWorkflow';
import { ModuleExecutor, IExecutionState } from './ModuleExecutor'; // IMPORTAÇÃO CHAVE

// Estrutura de IExecutionState (mantida)
export interface IExecutionState {
    instanceId: string;
    workflowId: string;
    currentNodeId: string;
    status: 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
    dataContext: Record<string, any>;
    startTime: Date;
    endTime?: Date;
    history: string[];
}

/**
 * O motor central responsável por processar a lógica do Workflow DEDALUS.
 */
export class OrchestrationEngine {
    
    private moduleExecutor: ModuleExecutor; // NOVA PROPRIEDADE

    constructor() {
        this.moduleExecutor = new ModuleExecutor(); // Inicializa o Executor no construtor
        console.log('[CORE]: DEDALUS Orchestration Engine inicializado.');
    }

    /**
     * Inicia a execução de um Workflow.
     * @param workflow A definição IWorkflow carregada.
     * @param initialData Os dados de entrada iniciais (payload).
     */
    public async startExecution(workflow: IWorkflow, initialData: Record<string, any>): Promise<IExecutionState> {
        if (!workflow.startNodeId) {
            throw new Error('Não é possível iniciar: Nó inicial (startNodeId) não definido.');
        }

        let state: IExecutionState = { // Usamos 'let' pois o estado será atualizado
            instanceId: `exec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            workflowId: workflow.id,
            currentNodeId: workflow.startNodeId,
            status: 'RUNNING',
            dataContext: initialData,
            startTime: new Date(),
            history: [workflow.startNodeId]
        };

        console.log(`[EXEC]: Iniciada execução para Workflow ID: ${workflow.id}`);
        
        // Loop de processamento de nó
        // Em um sistema real, isso seria um processo assíncrono e resiliente (fila/mensageria).
        while (state.status === 'RUNNING' && state.currentNodeId) {
            state = await this.processNode(workflow, state);
            // Prevenção de loop infinito no Mock
            if (state.history.length > 50) { 
                state.status = 'FAILED';
                console.error("[EXEC ERROR]: Limite de 50 nós excedido (loop detectado).");
            }
        }
        
        return state;
    }

    /**
     * Processa um único nó, invoca o executor e determina o próximo nó.
     */
    private async processNode(workflow: IWorkflow, state: IExecutionState): Promise<IExecutionState> {
        const currentNode = workflow.nodes.find(n => n.id === state.currentNodeId);

        if (!currentNode) {
            state.status = 'FAILED';
            console.error(`[EXEC ERROR]: Nó ID ${state.currentNodeId} não encontrado.`);
            return state;
        }

        console.log(`[EXEC]: Executando nó ${currentNode.name} (${currentNode.type}).`);

        try {
            // Executa o módulo real via ModuleExecutor, atualizando o dataContext
            state.dataContext = await this.moduleExecutor.execute(currentNode, state.dataContext);

        } catch (error) {
            state.status = 'FAILED';
            console.error(`[EXEC ERROR]: Falha na execução do módulo ${currentNode.type}:`, error);
            return state;
        }

        // Determina o próximo estado/nó
        if (currentNode.next) {
            state.currentNodeId = Array.isArray(currentNode.next) ? currentNode.next[0] : currentNode.next;
            state.history.push(state.currentNodeId);
        } else {
            state.status = 'COMPLETED';
            state.endTime = new Date();
            state.currentNodeId = ''; // Finaliza o loop
        }

        return state;
    }
}
