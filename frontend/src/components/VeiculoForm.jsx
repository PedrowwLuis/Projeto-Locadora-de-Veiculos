import { useState } from 'react';
import { cadastrarVeiculo } from '../api/veiculosApi.js';

const estadoInicial = {
  marca: '',
  modelo: '',
  placa: '',
  ano: '',
  valorDiaria: '',
};

export default function VeiculoForm({ aoCadastrar, aoErro }) {
  const [campos, setCampos] = useState(estadoInicial);
  const [enviando, setEnviando] = useState(false);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);

    try {
      const veiculo = await cadastrarVeiculo({
        marca: campos.marca,
        modelo: campos.modelo,
        placa: campos.placa,
        ano: Number(campos.ano),
        valorDiaria: Number(campos.valorDiaria),
      });
      setCampos(estadoInicial);
      await aoCadastrar(veiculo);
    } catch (erro) {
      aoErro(erro);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario" onSubmit={enviar}>
      <h2>Cadastrar veículo</h2>
      <div className="grade-campos">
        <label className="campo">
          <span>Marca</span>
          <input name="marca" value={campos.marca} onChange={alterarCampo} maxLength={60} required />
        </label>
        <label className="campo">
          <span>Modelo</span>
          <input name="modelo" value={campos.modelo} onChange={alterarCampo} maxLength={60} required />
        </label>
        <label className="campo">
          <span>Placa</span>
          <input
            name="placa"
            value={campos.placa}
            onChange={alterarCampo}
            placeholder="ABC1D23"
            maxLength={8}
            required
          />
        </label>
        <label className="campo">
          <span>Ano</span>
          <input
            name="ano"
            type="number"
            value={campos.ano}
            onChange={alterarCampo}
            min={1950}
            step={1}
            required
          />
        </label>
        <label className="campo">
          <span>Valor da diária (R$)</span>
          <input
            name="valorDiaria"
            type="number"
            value={campos.valorDiaria}
            onChange={alterarCampo}
            min={0.01}
            step={0.01}
            required
          />
        </label>
      </div>
      <div className="acoes">
        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? 'Salvando…' : 'Cadastrar veículo'}
        </button>
      </div>
    </form>
  );
}
