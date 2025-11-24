// src/services/WorkflowService.ts (FINAL COM PRISMA)

import { IWorkflow, IWorkflowNode } from '../models/IWorkflow';
import { OrchestrationEngine, IExecutionState } from '../core/OrchestrationEngine';
import { prisma } from '../database/PrismaClient'; // IMPORTAÇÃO DO CLIENTE PRISMA
import { Workflow } from '@prisma/client'; // Importa o tipo gerado pelo Prisma

/**
 * Mapeia o modelo IWorkflow (lógica TS) para o modelo Workflow (Prisma/DB).
 */
function toPrismaWorkflow(workflow: IWorkflow): Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'executions'> {
    return {
        name: workflow.name,
        version: workflow.version,
        description: workflow.description || null,
        authorId: workflow.authorId,
        nodesJson: workflow.nodes as any, // O Prisma mapeia 'Json'
    };
}

/**
 * Mapeia o modelo Workflow (Prisma/DB) para o modelo IWorkflow (lógica TS).
 */
function toIWorkflow(workflow: Workflow): IWorkflow {
    return {
        id: workflow.id,
        name: workflow.name,
        version: workflow.version,
        description: workflow.description || undefined,
        authorId: workflow.authorId,
        createdAt: workflow.createdAt,
        nodes: workflow.nodesJson as IWorkflowNode[],
        startNodeId: (workflow.nodesJson as IWorkflowNode[]).find(n => n.type === 'start')?.id || ''
    };
}


/**
 * Gerencia a lógica de negócios para a criação, validação e execução de Workflows.
 */
export class WorkflowService {
    
    private engine: OrchestrationEngine;
    
    constructor() {
        this.engine = new OrchestrationEngine();
    }
    
    private validateWorkflowStructure(workflowData: IWorkflow): boolean {
        // ... (Lógica de validação mantida) ...
        return !!workflowData.name && workflowData.nodes.some(n => n.type === 'start');
    }

    /**
     * Salva um workflow no banco de dados.
     * @param workflowData Os dados do workflow.
     */
    public async saveWorkflow(workflowData: IWorkflow): Promise<IWorkflow> {
        if (!this.validateWorkflowStructure(workflowData)) {
            throw new Error("O fluxo de trabalho não passou na validação estrutural (nó 'start' obrigatório).");
        }
        
        // Mapeia para o formato Prisma e persiste.
        const prismaData = toPrismaWorkflow(workflowData);
        
        const savedWorkflow = await prisma.workflow.create({
            data: prismaData as any
        });

        console.log(`Workflow salvo com sucesso. ID: ${savedWorkflow.id}, Versão: ${savedWorkflow.version}`);
        return toIWorkflow(savedWorkflow);
    }

    /**
     * Recupera um workflow pelo ID.
     * @param id O ID único do workflow.
     */
    public async getWorkflowById(id: string): Promise<IWorkflow | null> {
        const workflow = await prisma.workflow.findUnique({
            where: { id: id }
        });
        
        if (!workflow) {
            return null;
        }

        return toIWorkflow(workflow);
    }

    /**
     * Inicia a execução de um workflow persistido.
     * (Método tornado async)
     * @param id O ID único do workflow.
     * @param initialData Os dados de entrada para o fluxo.
     */
    public async startWorkflowExecution(id: string, initialData: Record<string, any>): Promise<IExecutionState> {
        // 1. Carregar o Workflow (definição)
        const workflowDefinition = await this.getWorkflowById(id); // Uso do método async
        
        if (!workflowDefinition) {
            throw new Error(`Workflow ID ${id} não encontrado para execução.`);
        }
        
        // 2. Iniciar a execução através do Motor (Método tornado async)
        const executionState = await this.engine.startExecution(workflowDefinition, initialData);

        // TODO: Aqui deveríamos salvar o registro da execução no modelo WorkflowExecution no banco.
        
        return executionState;
    }
}
