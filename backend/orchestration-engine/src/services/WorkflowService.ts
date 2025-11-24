// src/services/WorkflowService.ts (Atualizado)

import { IWorkflow } from '../models/IWorkflow';
import { OrchestrationEngine, IExecutionState } from '../core/OrchestrationEngine'; // NOVA IMPORTAÇÃO

/**
 * Gerencia a lógica de negócios para a criação, validação e execução de Workflows.
 */
export class WorkflowService {
    
    private engine: OrchestrationEngine; // Instância do motor
    // private database: any; 
    
    constructor() {
        this.engine = new OrchestrationEngine(); // Inicializa o motor no construtor
        // this.database = {}; 
    }
    
    // ... (validateWorkflowStructure, saveWorkflow, getWorkflowById - mantidos) ...
    
    /**
     * Inicia a execução de um workflow persistido.
     * @param id O ID único do workflow.
     * @param initialData Os dados de entrada para o fluxo.
     */
    public startWorkflowExecution(id: string, initialData: Record<string, any>): IExecutionState {
        // 1. Carregar o Workflow (definição)
        const workflowDefinition = this.getWorkflowById(id);
        
        if (!workflowDefinition) {
            throw new Error(`Workflow ID ${id} não encontrado para execução.`);
        }
        
        // 2. Iniciar a execução através do Motor
        const executionState = this.engine.startExecution(workflowDefinition, initialData);

        return executionState;
    }
}
