import { requisitar } from './http.js';

export function registrarLocacao(dados) {
  return requisitar('/locacoes', { metodo: 'POST', corpo: dados });
}

export function listarLocacoes(status) {
  const consulta = status ? `?status=${status}` : '';
  return requisitar(`/locacoes${consulta}`);
}

export function finalizarLocacao(id) {
  return requisitar(`/locacoes/${id}/finalizar`, { metodo: 'PATCH' });
}
