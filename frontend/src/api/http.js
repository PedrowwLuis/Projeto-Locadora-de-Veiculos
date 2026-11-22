const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';
const CHAVE_TOKEN = 'Projeto-Locadora-de-Veiculos:token';

let aoNaoAutorizado = null;

export class ErroApi extends Error {
  constructor(status, mensagem, detalhes) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.detalhes = detalhes;
  }
}

export function lerToken() {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export function salvarToken(token) {
  try {
    localStorage.setItem(CHAVE_TOKEN, token);
  } catch {
    return;
  }
}

export function removerToken() {
  try {
    localStorage.removeItem(CHAVE_TOKEN);
  } catch {
    return;
  }
}

export function definirAoNaoAutorizado(funcao) {
  aoNaoAutorizado = funcao;
}

export async function requisitar(caminho, { metodo = 'GET', corpo, autenticado = true } = {}) {
  const cabecalhos = {};
  const token = lerToken();

  if (corpo !== undefined) {
    cabecalhos['Content-Type'] = 'application/json';
  }
  if (autenticado && token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }

  let resposta;
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar à API. Verifique se o backend está em execução.');
  }

  let dados = null;
  const texto = await resposta.text();
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = null;
    }
  }

  if (!resposta.ok) {
    if (resposta.status === 401 && autenticado && aoNaoAutorizado) {
      aoNaoAutorizado();
    }
    throw new ErroApi(resposta.status, dados?.erro || 'Erro inesperado na requisição', dados?.detalhes);
  }

  return dados;
}
