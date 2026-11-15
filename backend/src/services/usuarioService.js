import { prisma } from '../lib/prisma.js';

export const camposPublicos = {
  id: true,
  nome: true,
  email: true,
  criadoEm: true,
};

export async function buscarPorId(id) {
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return prisma.usuario.findUnique({ where: { id }, select: camposPublicos });
}
