import { requisitar } from './http.js';

export function cadastrarVeiculo(dados) {
  return requisitar('/veiculos', { metodo: 'POST', corpo: dados });
}

export function listarVeiculos(disponivel) {
  const consulta = disponivel === undefined ? '' : `?disponivel=${disponivel}`;
  return requisitar(`/veiculos${consulta}`);
}

export function listarVeiculosDisponiveis() {
  return requisitar('/veiculos/disponiveis');
}
