import * as authService from '../services/authService.js';

export async function cadastrar(req, res) {
  const usuario = await authService.cadastrar(req.body ?? {});
  res.status(201).json(usuario);
}

export async function entrar(req, res) {
  const resultado = await authService.entrar(req.body ?? {});
  res.status(200).json(resultado);
}

export async function perfil(req, res) {
  res.status(200).json(req.usuario);
}
