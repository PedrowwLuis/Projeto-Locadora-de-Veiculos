import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { finalizarLocacao, listarLocacoes } from '../api/locacoesApi.js';
import { listarVeiculosDisponiveis } from '../api/veiculosApi.js';
import LocacaoForm from '../components/LocacaoForm.jsx';
import LocacaoLista from '../components/LocacaoLista.jsx';
import Mensagem from '../components/Mensagem.jsx';
import { formatarMoeda } from '../utils/formatadores.js';
import { mensagemDeErro, mensagemDeSucesso } from '../utils/mensagens.js';

const FILTROS = [
  { valor: '', rotulo: 'Todas' },
  { valor: 'ATIVA', rotulo: 'Ativas' },
  { valor: 'FINALIZADA', rotulo: 'Finalizadas' },
];

export default function LocacoesPage() {
  const location = useLocation();
  const veiculoInicial = location.state?.veiculoId ?? null;

  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState([]);
  const [locacoes, setLocacoes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [finalizandoId, setFinalizandoId] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const [disponiveis, historico] = await Promise.all([
        listarVeiculosDisponiveis(),
        listarLocacoes(filtroStatus),
      ]);
      setVeiculosDisponiveis(disponiveis);
      setLocacoes(historico);
    } catch (erro) {
      setMensagem(mensagemDeErro(erro));
    } finally {
      setCarregando(false);
    }
  }, [filtroStatus]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function aoRegistrar(locacao) {
    setMensagem(
      mensagemDeSucesso(
        `Locação registrada: ${locacao.veiculo.marca} ${locacao.veiculo.modelo}. Valor total: ${formatarMoeda(locacao.valorTotal)}.`,
      ),
    );
    await carregar();
  }

  async function aoFinalizar(id) {
    setFinalizandoId(id);
    setMensagem(null);

    try {
      const locacao = await finalizarLocacao(id);
      setMensagem(
        mensagemDeSucesso(`Locação finalizada: ${locacao.veiculo.marca} ${locacao.veiculo.modelo} está disponível novamente.`),
      );
      await carregar();
    } catch (erro) {
      setMensagem(mensagemDeErro(erro));
      await carregar();
    } finally {
      setFinalizandoId(null);
    }
  }

  function aoErro(erro) {
    setMensagem(mensagemDeErro(erro));
    carregar();
  }

  return (
    <div className="pagina">
      <h1>Locações</h1>
      <Mensagem mensagem={mensagem} aoFechar={() => setMensagem(null)} />
      <LocacaoForm
        veiculos={veiculosDisponiveis}
        veiculoInicial={veiculoInicial}
        aoRegistrar={aoRegistrar}
        aoErro={aoErro}
      />
      <section className="cartao">
        <div className="cabecalho-secao">
          <h2>Histórico de locações</h2>
          <div className="filtros" role="group" aria-label="Filtro de status">
            {FILTROS.map((opcao) => (
              <button
                key={opcao.valor || 'todas'}
                type="button"
                className={filtroStatus === opcao.valor ? 'filtro filtro-ativo' : 'filtro'}
                onClick={() => setFiltroStatus(opcao.valor)}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
        </div>
        {carregando ? (
          <p className="carregando">Carregando locações…</p>
        ) : (
          <LocacaoLista locacoes={locacoes} finalizandoId={finalizandoId} aoFinalizar={aoFinalizar} />
        )}
      </section>
    </div>
  );
}
