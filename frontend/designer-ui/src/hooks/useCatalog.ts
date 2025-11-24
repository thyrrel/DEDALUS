// src/hooks/useCatalog.ts

import { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';

/**
 * Hook customizado para gerenciar o estado e o carregamento do Catálogo de Módulos DEDALUS.
 */
export const useCatalog = () => {
    // Estado para armazenar a lista de módulos (Ex: ['ExternalAPICall', 'AISummary'])
    const [modules, setModules] = useState<string[]>([]); 
    // Estado para indicar se a requisição está em andamento
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Estado para armazenar possíveis mensagens de erro
    const [error, setError] = useState<string | null>(null);

    // Efeito que é executado apenas uma vez, após a montagem do componente
    useEffect(() => {
        const fetchCatalog = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const catalog = await apiService.getModuleCatalog();
                setModules(catalog);
                
                if (catalog.length === 0) {
                    setError('Nenhum módulo foi carregado do Backend DEDALUS.');
                }
                
            } catch (err) {
                // Captura erros de rede ou de API
                setError('Erro fatal ao conectar-se ao servidor de catálogo.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCatalog();
    }, []); // Array de dependências vazio

    return { modules, isLoading, error };
};
