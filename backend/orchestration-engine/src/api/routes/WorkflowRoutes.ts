// src/api/routes/WorkflowRoutes.ts (Atualizado)

import { Router } from 'express';
import { WorkflowController } from '../controllers/WorkflowController';

const router = Router();
const workflowController = new WorkflowController();

// POST /api/v1/workflows -> Rota para Salvar/Criar um novo Workflow (fluxo Low-Code)
router.post('/workflows', workflowController.createWorkflow);

// GET /api/v1/workflows/:id -> Rota para buscar um Workflow específico
router.get('/workflows/:id', workflowController.getWorkflow);

// NOVO: POST /api/v1/workflows/:id/execute -> Rota para Iniciar a Execução de um Workflow
router.post('/workflows/:id/execute', workflowController.executeWorkflow); // NOVA ROTA

export const WorkflowRoutes = router;
