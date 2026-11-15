import { formatarMoeda, formatarPlaca } from '../utils/formatadores.js';

export default function VeiculoLista({ veiculos, aoLocar }) {
  if (veiculos.length === 0) {
    return <p className="vazio">Nenhum veículo encontrado para este filtro.</p>;
  }

  return (
    <div className="tabela-rolavel">
      <table className="tabela">
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Placa</th>
            <th>Ano</th>
            <th>Diária</th>
            <th>Situação</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {veiculos.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>
                <strong>{veiculo.marca}</strong> {veiculo.modelo}
              </td>
              <td>{formatarPlaca(veiculo.placa)}</td>
              <td>{veiculo.ano}</td>
              <td>{formatarMoeda(veiculo.valorDiaria)}</td>
              <td>
                <span className={veiculo.disponivel ? 'selo selo-verde' : 'selo selo-cinza'}>
                  {veiculo.disponivel ? 'Disponível' : 'Locado'}
                </span>
              </td>
              <td className="coluna-acao">
                {veiculo.disponivel && (
                  <button
                    type="button"
                    className="botao botao-secundario botao-pequeno"
                    onClick={() => aoLocar(veiculo.id)}
                  >
                    Locar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
