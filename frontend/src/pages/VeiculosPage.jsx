import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { listarVeiculos } from '../api/veiculosApi.js';
import Mensagem from '../components/Mensagem.jsx';
import VeiculoForm from '../components/VeiculoForm.jsx';
import VeiculoLista from '../components/VeiculoLista.jsx';
import { mensagemDeErro, mensagemDeSucesso } from '../utils/mensagens.js';

const FILTROS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'true', rotulo: 'Disponíveis' },
  { valor: 'false', rotulo: 'Locados' },
];

export default function VeiculosPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const ehAdmin = usuario?.perfil === 'ADMIN';
  const [veiculos, setVeiculos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const lista = await listarVeiculos(filtro === 'todos' ? undefined : filtro);
      setVeiculos(lista);
    } catch (erro) {
      setMensagem(mensagemDeErro(erro));
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function aoCadastrar(veiculo) {
    setMensagem(mensagemDeSucesso(`Veículo ${veiculo.marca} ${veiculo.modelo} cadastrado com sucesso.`));
    await carregar();
  }

  function aoErro(erro) {
    setMensagem(mensagemDeErro(erro));
  }

  function aoLocar(veiculoId) {
    navigate('/locacoes', { state: { veiculoId } });
  }

  return (
    <div className="pagina">
      <h1>Veículos</h1>
      <Mensagem mensagem={mensagem} aoFechar={() => setMensagem(null)} />
      {ehAdmin && <VeiculoForm aoCadastrar={aoCadastrar} aoErro={aoErro} />}
      <section className="cartao">
        <div className="cabecalho-secao">
          <h2>Frota</h2>
          <div className="filtros" role="group" aria-label="Filtro de disponibilidade">
            {FILTROS.map((opcao) => (
              <button
                key={opcao.valor}
                type="button"
                className={filtro === opcao.valor ? 'filtro filtro-ativo' : 'filtro'}
                onClick={() => setFiltro(opcao.valor)}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
        </div>
        {carregando ? <p className="carregando">Carregando veículos…</p> : <VeiculoLista veiculos={veiculos} aoLocar={aoLocar} />}
      </section>
    </div>
  );
}
