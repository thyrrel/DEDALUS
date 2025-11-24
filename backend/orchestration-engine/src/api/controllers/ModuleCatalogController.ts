// src/api/controllers/ModuleCatalogController.ts (FINAL)

import { Request, Response } from 'express';
import { ModuleCatalogService } from '../../services/ModuleCatalogService'; // Importa o Serviço de Catálogo

/**
 * Controller responsável por lidar com requisições relacionadas ao Catálogo de Módulos
 * (Conectores, Funções de IA, Regras) disponíveis para o Designer Low-Code.
 */
export class ModuleCatalogController {
    private catalogService: ModuleCatalogService;

    constructor() {
        this.catalogService = new ModuleCatalogService();
        this.getAvailableModules = this.getAvailableModules.bind(this);
    }

    /**
     * Retorna uma lista dos tipos de módulos disponíveis para o frontend.
     */
    public getAvailableModules(req: Request, res: Response): Response {
        try {
            // Delega a lógica de busca para a camada de Serviço
            const modules = this.catalogService.getAvailableModuleTypes();

            console.log(`Catálogo consultado: ${modules.length} módulos disponíveis.`);

            return res.status(200).send({
                message: 'Catálogo de módulos do DEDALUS recuperado com sucesso.',
                count: modules.length,
                data: modules
            });

        } catch (error: any) {
            console.error('Erro ao consultar o Catálogo de Módulos:', error.message);
            return res.status(500).send({ message: 'Erro interno ao carregar o Catálogo de Módulos.' });
        }
    }
}
