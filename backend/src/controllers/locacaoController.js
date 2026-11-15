import * as locacaoService from '../services/locacaoService.js';

export async function registrar(req, res) {
  const locacao = await locacaoService.registrar(req.usuario.id, req.body ?? {});
  res.status(201).json(locacao);
}

export async function listar(req, res) {
  const locacoes = await locacaoService.listarDoUsuario(req.usuario.id, {
    status: req.query.status,
  });
  res.status(200).json(locacoes);
}

export async function buscar(req, res) {
  const locacao = await locacaoService.buscarDoUsuario(req.usuario.id, req.params.id);
  res.status(200).json(locacao);
}

export async function finalizar(req, res) {
  const locacao = await locacaoService.finalizar(req.usuario.id, req.params.id);
  res.status(200).json(locacao);
}
