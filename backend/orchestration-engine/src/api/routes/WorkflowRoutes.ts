// src/api/routes/WorkflowRoutes.ts (FINAL)

import { Router } from 'express';
import { WorkflowController } from '../controllers/WorkflowController';
import { ModuleCatalogController } from '../controllers/ModuleCatalogController'; // NOVA IMPORTAÇÃO

const router = Router();
const workflowController = new WorkflowController();
const moduleCatalogController = new ModuleCatalogController(); // NOVA INSTANCIAÇÃO

// --- ROTAS DE WORKFLOW (Composição/Execução) ---

// POST /api/v1/workflows -> Salvar/Criar um novo Workflow (fluxo Low-Code)
router.post('/workflows', workflowController.createWorkflow);

// GET /api/v1/workflows/:id -> Buscar um Workflow específico
router.get('/workflows/:id', workflowController.getWorkflow);

// POST /api/v1/workflows/:id/execute -> Iniciar a Execução de um Workflow
router.post('/workflows/:id/execute', workflowController.executeWorkflow);

// --- ROTAS DO CATÁLOGO DE MÓDULOS ---

// GET /api/v1/modules -> Buscar a lista de módulos disponíveis no Catálogo (para o Designer)
router.get('/modules', moduleCatalogController.getAvailableModules); // NOVA ROTA

export const WorkflowRoutes = router;
