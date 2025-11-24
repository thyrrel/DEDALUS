// src/api/routes/WorkflowRoutes.ts
import { Router } from 'express';
import { WorkflowController } from '../controllers/WorkflowController';

const router = Router();
const workflowController = new WorkflowController();

// POST /api/v1/workflows -> Rota para Salvar/Criar um novo Workflow (fluxo Low-Code)
router.post('/workflows', workflowController.createWorkflow);

// GET /api/v1/workflows/:id -> Rota para buscar um Workflow específico
router.get('/workflows/:id', workflowController.getWorkflow);

// Exporte o roteador para ser usado no index.ts
export const WorkflowRoutes = router;
