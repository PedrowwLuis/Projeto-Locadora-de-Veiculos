export default function Mensagem({ mensagem, aoFechar }) {
  if (!mensagem) {
    return null;
  }

  const classe = mensagem.tipo === 'sucesso' ? 'mensagem mensagem-sucesso' : 'mensagem mensagem-erro';

  return (
    <div className={classe} role={mensagem.tipo === 'sucesso' ? 'status' : 'alert'}>
      <div className="mensagem-conteudo">
        <p>{mensagem.texto}</p>
        {Array.isArray(mensagem.detalhes) && mensagem.detalhes.length > 0 && (
          <ul>
            {mensagem.detalhes.map((detalhe) => (
              <li key={`${detalhe.campo}-${detalhe.mensagem}`}>{detalhe.mensagem}</li>
            ))}
          </ul>
        )}
      </div>
      {aoFechar && (
        <button type="button" className="mensagem-fechar" onClick={aoFechar} aria-label="Fechar mensagem">
          ×
        </button>
      )}
    </div>
  );
}
