import { formatarDataHora, formatarMoeda, formatarPlaca } from '../utils/formatadores.js';

export default function LocacaoLista({ locacoes, finalizandoId, aoFinalizar }) {
  if (locacoes.length === 0) {
    return <p className="vazio">Nenhuma locação encontrada.</p>;
  }

  return (
    <div className="tabela-rolavel">
      <table className="tabela">
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Início</th>
            <th>Devolução prevista</th>
            <th>Devolvido em</th>
            <th>Valor total</th>
            <th>Status</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {locacoes.map((locacao) => {
            const ativa = locacao.status === 'ATIVA';

            return (
              <tr key={locacao.id}>
                <td>
                  <strong>
                    {locacao.veiculo.marca} {locacao.veiculo.modelo}
                  </strong>
                  <br />
                  <small>{formatarPlaca(locacao.veiculo.placa)}</small>
                </td>
                <td>{formatarDataHora(locacao.dataInicio)}</td>
                <td>{formatarDataHora(locacao.dataPrevistaDevolucao)}</td>
                <td>{formatarDataHora(locacao.dataDevolucaoEfetiva)}</td>
                <td>{formatarMoeda(locacao.valorTotal)}</td>
                <td>
                  <span className={ativa ? 'selo selo-azul' : 'selo selo-cinza'}>
                    {ativa ? 'Ativa' : 'Finalizada'}
                  </span>
                </td>
                <td className="coluna-acao">
                  {ativa && (
                    <button
                      type="button"
                      className="botao botao-primario botao-pequeno"
                      disabled={finalizandoId === locacao.id}
                      onClick={() => aoFinalizar(locacao.id)}
                    >
                      {finalizandoId === locacao.id ? 'Finalizando…' : 'Finalizar'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
