import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const servidor = app.listen(env.port, () => {
  console.log(`API de locação de veículos em http://localhost:${env.port}`);
});

async function encerrar() {
  servidor.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
