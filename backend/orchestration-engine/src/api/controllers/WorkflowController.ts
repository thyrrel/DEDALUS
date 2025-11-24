// src/api/controllers/WorkflowController.ts (Método executeWorkflow adicionado)

import { Request, Response } from 'express';
import { WorkflowService } from '../../services/WorkflowService';

export class WorkflowController {
    private workflowService: WorkflowService;

    constructor() {
        this.workflowService = new WorkflowService();
        this.createWorkflow = this.createWorkflow.bind(this);
        this.getWorkflow = this.getWorkflow.bind(this);
        this.executeWorkflow = this.executeWorkflow.bind(this); // NOVO: Binding necessário
    }

    // ... (Métodos createWorkflow e getWorkflow mantidos) ...

    /**
     * Inicia a execução de um workflow pelo ID, usando dados de entrada (payload).
     */
    public executeWorkflow(req: Request, res: Response): Response {
        try {
            const workflowId = req.params.id;
            const initialData = req.body || {}; // O payload de dados inicial
            
            console.log(`Recebida requisição de execução para o Workflow ID: ${workflowId}`);
            
            // 1. Delega a inicialização para a camada de Serviço
            const executionState = this.workflowService.startWorkflowExecution(workflowId, initialData);

            // 2. Retorna o estado inicial da execução
            return res.status(202).send({ // Status 202 Accepted indica que o processamento foi iniciado
                message: 'Execução do Workflow iniciada com sucesso.',
                executionId: executionState.instanceId,
                status: executionState.status
            });

        } catch (error: any) {
            console.error('Erro no Controller de execução de Workflow:', error.message);
            // Retorna 404 se não for encontrado ou 400 para erros de dados/validação
            const statusCode = error.message.includes('não encontrado') ? 404 : 400;
            return res.status(statusCode).send({ message: error.message || 'Erro interno na execução do fluxo.' });
        }
    }
}
