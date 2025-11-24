// src/api/apiService.ts

import axios, { AxiosInstance } from 'axios';

// Variável de ambiente para o endpoint do backend.
// Em um ambiente React real, isso seria lido do process.env.REACT_APP_API_URL
const API_BASE_URL = 'http://localhost:3000/api/v1'; 

/**
 * Cliente Axios configurado para o Backend DEDALUS.
 */
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout de 10 segundos
});

/**
 * Define a interface de dados para um módulo retornado pelo backend.
 * (Apenas o nome é necessário por enquanto).
 */
interface IModuleCatalogResponse {
    message: string;
    count: number;
    data: string[]; // Lista de nomes dos módulos (Ex: 'ExternalAPICall')
}

/**
 * Serviços de comunicação com a API do Backend DEDALUS.
 */
export const apiService = {
    
    /**
     * Busca a lista de módulos disponíveis no Catálogo (GET /modules).
     */
    async getModuleCatalog(): Promise<string[]> {
        try {
            const response = await api.get<IModuleCatalogResponse>('/modules');
            
            // Retorna apenas o array de dados (os nomes dos módulos)
            return response.data.data; 

        } catch (error) {
            console.error('[API ERROR]: Falha ao buscar o catálogo de módulos.', error);
            // Em caso de falha, retorna um array vazio para evitar quebrar a aplicação
            return [];
        }
    },

    /**
     * Cria/Salva um novo Workflow (POST /workflows).
     * @param workflowData O payload JSON do workflow Low-Code.
     */
    async createWorkflow(workflowData: any): Promise<any> {
        try {
            const response = await api.post('/workflows', workflowData);
            return response.data;
        } catch (error) {
            console.error('[API ERROR]: Falha ao criar o workflow.', error);
            throw error;
        }
    },
    
    // Futuros métodos: getWorkflow, executeWorkflow, etc.
};
