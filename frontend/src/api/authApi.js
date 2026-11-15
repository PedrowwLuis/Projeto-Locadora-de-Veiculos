import { requisitar } from './http.js';

export function cadastrarUsuario(dados) {
  return requisitar('/auth/cadastro', { metodo: 'POST', corpo: dados, autenticado: false });
}

export function entrarNoSistema(dados) {
  return requisitar('/auth/login', { metodo: 'POST', corpo: dados, autenticado: false });
}

export function buscarPerfil() {
  return requisitar('/auth/perfil');
}
