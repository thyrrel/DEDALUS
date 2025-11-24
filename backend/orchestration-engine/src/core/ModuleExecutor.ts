// src/core/ModuleExecutor.ts

import { IWorkflowNode } from '../models/IWorkflow';

/**
 * Define a interface básica que todo módulo/conector (Ex: GoogleMapsConnector) deve implementar.
 * Esta interface garante que o executor saiba como interagir com o módulo.
 */
export interface IModuleConnector {
    name: string;
    version: string;
    description: string;
    execute(config: Record<string, any>, dataContext: Record<string, any>): Promise<Record<string, any>>;
}

/**
 * O Executor responsável por carregar dinamicamente e invocar os módulos/conectores.
 * Utiliza o conceito de "registry" (registro) para gerenciar módulos disponíveis.
 */
export class ModuleExecutor {
    // Registro de todos os módulos disponíveis, indexado pelo tipo/nome.
    private static moduleRegistry: Map<string, IModuleConnector> = new Map();

    constructor() {
        if (ModuleExecutor.moduleRegistry.size === 0) {
            this.loadModulesFromDisk();
        }
    }

    /**
     * Carrega módulos dinamicamente do diretório 'modules/connectors/'.
     * Em um ambiente Node.js, isso pode ser feito usando 'require()' dinâmico ou 'import()'.
     */
    private loadModulesFromDisk(): void {
        console.log('[CATALOG]: Iniciando o carregamento dinâmico de módulos...');
        // MOCK: Em um projeto real, você leria o diretório e carregaria cada módulo.

        // Exemplo MOCK de um módulo:
        const mockModule: IModuleConnector = {
            name: 'ExternalAPICall',
            version: '1.0.0',
            description: 'Módulo de exemplo para chamar uma API externa.',
            async execute(config, dataContext) {
                console.log(`[EXEC MODULE]: Chamando API com config:`, config);
                // Simula um delay e retorna dados para o contexto
                await new Promise(resolve => setTimeout(resolve, 50)); 
                dataContext[config.outputKey || 'apiResult'] = { status: 'SUCCESS', timestamp: new Date().toISOString() };
                return dataContext;
            }
        };

        // Registra o módulo usando seu nome (type) como chave.
        ModuleExecutor.moduleRegistry.set(mockModule.name, mockModule);
        console.log(`[CATALOG]: Módulo '${mockModule.name}' registrado. Total de ${ModuleExecutor.moduleRegistry.size} módulos.`);
    }

    /**
     * Executa o código do módulo referenciado pelo nó do workflow.
     * @param node O nó do workflow que contém as configurações de entrada.
     * @param dataContext O estado de dados atual.
     */
    public async execute(node: IWorkflowNode, dataContext: Record<string, any>): Promise<Record<string, any>> {
        const moduleName = node.type;

        if (!ModuleExecutor.moduleRegistry.has(moduleName)) {
            throw new Error(`Módulo/Tipo ${moduleName} não encontrado no catálogo.`);
        }

        const moduleConnector = ModuleExecutor.moduleRegistry.get(moduleName)!;

        // Passa as configurações do nó e o contexto de dados para o módulo.
        return moduleConnector.execute(node.config, dataContext);
    }
    
    /**
     * Retorna a lista de todos os módulos registrados (para o CatalogService).
     */
    public getAvailableModules(): string[] {
        return Array.from(ModuleExecutor.moduleRegistry.keys());
    }
}
