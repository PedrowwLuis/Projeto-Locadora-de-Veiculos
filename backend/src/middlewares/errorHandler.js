import { Prisma } from '@prisma/client';
import { AppError } from '../lib/AppError.js';

export function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' });
}

export function tratarErros(err, req, res, next) {
  if (err instanceof AppError) {
    const corpo = { erro: err.message };
    if (err.detalhes) {
      corpo.detalhes = err.detalhes;
    }
    return res.status(err.status).json(corpo);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'Corpo da requisição não é um JSON válido' });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(409).json({ erro: 'Já existe um registro com estes dados' });
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}
