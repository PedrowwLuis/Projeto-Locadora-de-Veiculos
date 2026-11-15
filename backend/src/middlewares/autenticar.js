import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../lib/AppError.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as usuarioService from '../services/usuarioService.js';

export const autenticar = asyncHandler(async (req, res, next) => {
  const cabecalho = req.headers.authorization ?? '';
  const [esquema, token] = cabecalho.split(' ');

  if (esquema !== 'Bearer' || !token) {
    throw new AppError(401, 'Token de autenticação não informado');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError(401, 'Token inválido ou expirado');
  }

  const usuario = await usuarioService.buscarPorId(Number(payload.sub));
  if (!usuario) {
    throw new AppError(401, 'O usuário deste token não existe mais');
  }

  req.usuario = usuario;
  next();
});
