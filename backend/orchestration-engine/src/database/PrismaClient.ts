// src/database/PrismaClient.ts (FINAL E CORRIGIDO PARA PRISMA 7+)

import { PrismaClient } from '@prisma/client';
// Carrega o arquivo .env (necessário, pois o Prisma CLI não fará isso automaticamente na nova versão)
import 'dotenv/config'; 

/**
 * Cliente Prisma centralizado.
 */

// A URL de conexão é explicitamente passada aqui, garantindo que o Prisma a receba.
// Em um ambiente de produção (como o GitHub Actions), a variável DATABASE_URL
// deve estar configurada nas variáveis de ambiente do servidor ou nos Secrets do GitHub.

const prisma = new PrismaClient({
  // Garante que o Prisma saiba qual banco usar, mesmo sem a URL no schema.
  adapter: 'mysql', 
  // Usa o DATABASE_URL lido do ambiente (ou do .env carregado acima)
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Garante que o cliente se desconecte corretamente
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
