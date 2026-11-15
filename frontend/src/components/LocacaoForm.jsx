import { useState } from 'react';
import { registrarLocacao } from '../api/locacoesApi.js';
import { campoParaIso, dataParaCampo, formatarMoeda, formatarPlaca } from '../utils/formatadores.js';

const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

function criarEstadoInicial(veiculoInicial) {
  const agora = new Date();
  const amanha = new Date(agora.getTime() + MILISSEGUNDOS_POR_DIA);

  return {
    veiculoId: veiculoInicial ? String(veiculoInicial) : '',
    dataInicio: dataParaCampo(agora),
    dataPrevistaDevolucao: dataParaCampo(amanha),
  };
}

export default function LocacaoForm({ veiculos, veiculoInicial, aoRegistrar, aoErro }) {
  const [campos, setCampos] = useState(() => criarEstadoInicial(veiculoInicial));
  const [enviando, setEnviando] = useState(false);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);

    try {
      const locacao = await registrarLocacao({
        veiculoId: Number(campos.veiculoId),
        dataInicio: campoParaIso(campos.dataInicio),
        dataPrevistaDevolucao: campoParaIso(campos.dataPrevistaDevolucao),
      });
      setCampos(criarEstadoInicial(null));
      await aoRegistrar(locacao);
    } catch (erro) {
      aoErro(erro);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario" onSubmit={enviar}>
      <h2>Registrar locação</h2>
      <div className="grade-campos">
        <label className="campo campo-largo">
          <span>Veículo disponível</span>
          <select name="veiculoId" value={campos.veiculoId} onChange={alterarCampo} required>
            <option value="">Selecione um veículo</option>
            {veiculos.map((veiculo) => (
              <option key={veiculo.id} value={veiculo.id}>
                {veiculo.marca} {veiculo.modelo} — {formatarPlaca(veiculo.placa)} —{' '}
                {formatarMoeda(veiculo.valorDiaria)}/dia
              </option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Início</span>
          <input
            name="dataInicio"
            type="datetime-local"
            value={campos.dataInicio}
            onChange={alterarCampo}
            required
          />
        </label>
        <label className="campo">
          <span>Devolução prevista</span>
          <input
            name="dataPrevistaDevolucao"
            type="datetime-local"
            value={campos.dataPrevistaDevolucao}
            onChange={alterarCampo}
            required
          />
        </label>
      </div>
      <p className="dica">O valor total é calculado pela API: cada fração de 24 horas conta como uma diária completa.</p>
      <div className="acoes">
        <button type="submit" className="botao botao-primario" disabled={enviando || veiculos.length === 0}>
          {enviando ? 'Registrando…' : 'Registrar locação'}
        </button>
      </div>
      {veiculos.length === 0 && <p className="dica">Não há veículos disponíveis no momento.</p>}
    </form>
  );
}
