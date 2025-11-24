// src/index.ts (Atualizado)
import express from 'express';
import { WorkflowRoutes } from './api/routes/WorkflowRoutes'; // Importa as rotas

// --- Variáveis de Configuração ---
const PORT = process.env.PORT || 3000;
const app = express();

// --- Middleware ---
app.use(express.json()); 

// --- Carregamento das Rotas da Aplicação ---
// Todas as rotas de workflow serão prefixadas com /api/v1
app.use('/api/v1', WorkflowRoutes); 

/**
 * Rota de Health Check e Raiz (mantidas para simplicidade).
 */
app.get('/health', (req, res) => res.status(200).send({ status: 'OK', service: 'DEDALUS Engine' }));
app.get('/', (req, res) => res.status(200).send({ message: 'Bem-vindo ao DEDALUS.' }));

// --- Inicialização do Servidor (Bloco Try/Catch mantido) ---
try {
    app.listen(PORT, () => {
        console.log(`[DEDALUS]: Motor de Orquestração rodando em http://localhost:${PORT}`);
    });
} catch (error) {
    console.error(`[FATAL ERROR]: Falha ao iniciar o servidor.`);
    process.exit(1);
}
