// src/api/controllers/WorkflowController.ts (Atualizado)

import { Request, Response } from 'express';
import { WorkflowService } from '../../services/WorkflowService'; // Importação do Serviço

export class WorkflowController {
    private workflowService: WorkflowService;

    constructor() {
        // Inicialização do serviço de negócios (Injeção de dependência simples)
        this.workflowService = new WorkflowService();
        this.createWorkflow = this.createWorkflow.bind(this); 
        this.getWorkflow = this.getWorkflow.bind(this);
    }

    /**
     * Cria um novo Workflow, delegando a validação e persistência para o Service.
     */
    public createWorkflow(req: Request, res: Response): Response {
        try {
            const workflowData = req.body;
            
            // Chama o Service para processar os dados
            const result = this.workflowService.saveWorkflow(workflowData); 

            return res.status(201).send({ 
                id: result?.id, 
                message: 'Workflow criado e persistido com sucesso.',
                version: result?.version
            });

        } catch (error: any) {
            // Captura erros do Service (ex: falha de validação)
            console.error('Erro no Controller de criação de Workflow:', error.message);
            return res.status(400).send({ message: error.message || 'Erro interno ao processar a requisição.' });
        }
    }
    
    /**
     * Busca um workflow pelo ID.
     */
    public getWorkflow(req: Request, res: Response): Response {
        const id = req.params.id;
        const workflow = this.workflowService.getWorkflowById(id);

        if (!workflow) {
            return res.status(404).send({ message: `Workflow ID ${id} não encontrado.` });
        }
        
        return res.status(200).send({ data: workflow });
    }
}
