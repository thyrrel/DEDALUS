// src/core/OrchestrationEngine.ts

import { IWorkflow, IWorkflowNode } from '../models/IWorkflow';

/**
 * Define a estrutura de dados de uma instância de execução de um Workflow.
 * Usado para rastrear o progresso e o estado dos dados.
 */
export interface IExecutionState {
    instanceId: string;                 // ID único desta execução
    workflowId: string;
    currentNodeId: string;              // O nó atual em execução
    status: 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
    dataContext: Record<string, any>;   // Dados transitórios que fluem entre os nós
    startTime: Date;
    endTime?: Date;
    history: string[];                  // Registro dos nós já executados
}

/**
 * O motor central responsável por processar a lógica do Workflow DEDALUS.
 */
export class OrchestrationEngine {
    
    constructor() {
        console.log('[CORE]: DEDALUS Orchestration Engine inicializado.');
    }

    /**
     * Inicia a execução de um Workflow a partir de sua definição estrutural.
     * @param workflow A definição IWorkflow carregada do banco de dados.
     * @param initialData Os dados de entrada iniciais (payload).
     */
    public startExecution(workflow: IWorkflow, initialData: Record<string, any>): IExecutionState {
        if (!workflow.startNodeId) {
            throw new Error('Não é possível iniciar: Nó inicial (startNodeId) não definido.');
        }

        const initialState: IExecutionState = {
            instanceId: `exec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            workflowId: workflow.id,
            currentNodeId: workflow.startNodeId,
            status: 'RUNNING',
            dataContext: initialData,
            startTime: new Date(),
            history: [workflow.startNodeId]
        };

        // Inicia o loop principal de processamento em background (síncrono/assíncrono)
        // No MVP, faremos uma simulação síncrona:
        // this.processNode(workflow, initialState);
        
        console.log(`[EXEC]: Iniciada execução para Workflow ID: ${workflow.id}`);
        return initialState;
    }

    /**
     * Função principal para processar um único nó e determinar o próximo.
     * (Esta função evoluirá para ser assíncrona e resiliente).
     */
    private processNode(workflow: IWorkflow, state: IExecutionState): IExecutionState {
        const currentNode = workflow.nodes.find(n => n.id === state.currentNodeId);

        if (!currentNode) {
            state.status = 'FAILED';
            console.error(`[EXEC ERROR]: Nó ID ${state.currentNodeId} não encontrado.`);
            return state;
        }

        console.log(`[EXEC]: Executando nó ${currentNode.name} (${currentNode.type}).`);

        // Simulação da execução do módulo (aqui ocorreria a chamada real ao código do módulo)
        state.dataContext = this.executeModule(currentNode, state.dataContext);

        // Determina o próximo estado/nó (lógica de transição FSM)
        if (currentNode.next) {
            state.currentNodeId = Array.isArray(currentNode.next) ? currentNode.next[0] : currentNode.next;
            state.history.push(state.currentNodeId);
        } else {
            state.status = 'COMPLETED';
            state.endTime = new Date();
        }

        return state;
    }
    
    /**
     * MOCK: Simula a execução do código de um módulo/conector.
     */
    private executeModule(node: IWorkflowNode, data: Record<string, any>): Record<string, any> {
        console.log(`  -> Executando lógica para tipo: ${node.type}`);
        // Exemplo: Se for um nó de dados, injeta dados no contexto
        if (node.type === 'data-source' && node.config.outputKey) {
            data[node.config.outputKey] = { message: 'Dados mockados de um conector externo' };
        }
        return data;
    }
}
