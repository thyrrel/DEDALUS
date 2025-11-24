// src/services/ModuleCatalogService.ts

import { ModuleExecutor } from '../core/ModuleExecutor';

/**
 * Serviço responsável por interagir com o ModuleExecutor para fornecer
 * a lista de módulos disponíveis para o frontend e validação.
 */
export class ModuleCatalogService {
    private executor: ModuleExecutor;

    constructor() {
        // O Executor é instanciado aqui, garantindo que os módulos sejam carregados.
        this.executor = new ModuleExecutor();
    }

    /**
     * Retorna a lista de nomes/tipos de todos os módulos que o Engine pode executar.
     * Esta lista alimenta o 'Catálogo de Componentes' na interface Low-Code.
     */
    public getAvailableModuleTypes(): string[] {
        return this.executor.getAvailableModules();
    }
    
    // Futuramente, aqui podem ser adicionados métodos para buscar metadados detalhados de cada módulo
    // (ex: parâmetros de entrada, descrição, exemplos de uso).
}
