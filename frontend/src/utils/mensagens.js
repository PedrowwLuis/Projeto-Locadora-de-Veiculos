export function mensagemDeErro(erro) {
  return {
    tipo: 'erro',
    texto: erro?.message || 'Ocorreu um erro inesperado',
    detalhes: erro?.detalhes,
  };
}

export function mensagemDeSucesso(texto) {
  return { tipo: 'sucesso', texto };
}
