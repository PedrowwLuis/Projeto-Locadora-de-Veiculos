import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../api/authApi.js';
import Mensagem from '../components/Mensagem.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { mensagemDeErro } from '../utils/mensagens.js';

const estadoInicial = {
  nome: '',
  email: '',
  senha: '',
  confirmacao: '',
};

export default function CadastroPage() {
  const { usuario, carregando } = useAuth();
  const navigate = useNavigate();

  const [campos, setCampos] = useState(estadoInicial);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  if (!carregando && usuario) {
    return <Navigate to="/veiculos" replace />;
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setMensagem(null);

    if (campos.senha !== campos.confirmacao) {
      setMensagem({ tipo: 'erro', texto: 'A confirmação da senha não confere' });
      return;
    }

    setEnviando(true);

    try {
      await cadastrarUsuario({ nome: campos.nome, email: campos.email, senha: campos.senha });
      navigate('/login', { replace: true, state: { cadastroConcluido: true } });
    } catch (erro) {
      setMensagem(mensagemDeErro(erro));
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-autenticacao">
      <form className="cartao formulario cartao-autenticacao" onSubmit={enviar}>
        <h1>Criar conta</h1>
        <p className="subtitulo">Cadastre-se para registrar locações.</p>
        <Mensagem mensagem={mensagem} aoFechar={() => setMensagem(null)} />
        <label className="campo">
          <span>Nome</span>
          <input name="nome" value={campos.nome} onChange={alterarCampo} autoComplete="name" required />
        </label>
        <label className="campo">
          <span>E-mail</span>
          <input
            name="email"
            type="email"
            value={campos.email}
            onChange={alterarCampo}
            autoComplete="email"
            required
          />
        </label>
        <label className="campo">
          <span>Senha (mínimo de 6 caracteres)</span>
          <input
            name="senha"
            type="password"
            value={campos.senha}
            onChange={alterarCampo}
            minLength={6}
            autoComplete="new-password"
            required
          />
        </label>
        <label className="campo">
          <span>Confirmar senha</span>
          <input
            name="confirmacao"
            type="password"
            value={campos.confirmacao}
            onChange={alterarCampo}
            minLength={6}
            autoComplete="new-password"
            required
          />
        </label>
        <button type="submit" className="botao botao-primario botao-bloco" disabled={enviando}>
          {enviando ? 'Cadastrando…' : 'Cadastrar'}
        </button>
        <p className="rodape-formulario">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
