// src/database/PrismaClient.ts

import { PrismaClient } from '@prisma/client';

/**
 * Cliente Prisma centralizado.
 * Exportamos uma única instância para evitar múltiplas conexões
 * com o banco de dados (especialmente importante em ambientes Serverless).
 */

const prisma = new PrismaClient({
  // Opções de log para debug no ambiente de desenvolvimento
  log: ['query', 'info', 'warn', 'error'],
});

// Garante que o cliente se desconecte corretamente ao encerrar o processo
// (Crucial para testes e encerramento limpo)
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
