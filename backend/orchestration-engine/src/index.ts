import express, { Request, Response } from 'express';

// --- Variáveis de Configuração ---
// Define a porta do servidor. Lendo de uma variável de ambiente (process.env) 
// é a prática padrão para implantação (Deployment).
const PORT = process.env.PORT || 3000;
const app = express();

// --- Middleware ---
// Configura o servidor para aceitar corpos de requisição no formato JSON.
app.use(express.json()); 

// --- Rotas Base ---
/**
 * Rota de Health Check (Verificação de Saúde).
 * Essencial para monitoramento e orquestradores como Kubernetes.
 */
app.get('/health', (req: Request, res: Response) => {
    // Retorna o status 200 OK e uma mensagem indicando que o motor está ativo.
    res.status(200).send({ status: 'OK', service: 'DEDALUS Orchestration Engine' });
});

/**
 * Rota Raiz. Pode ser usada para fornecer informações da API.
 */
app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Bem-vindo ao DEDALUS: Dynamic Engine for Deployment.' });
});

// --- Inicialização do Servidor ---
try {
    app.listen(PORT, () => {
        console.log(`[DEDALUS]: Motor de Orquestração rodando em http://localhost:${PORT}`);
        console.log(`[STATUS]: Pressione CTRL+C para encerrar.`);
    });
} catch (error) {
    // Tratamento de erro na inicialização do servidor.
    console.error(`[FATAL ERROR]: Falha ao iniciar o servidor:`, error);
    process.exit(1);
}

