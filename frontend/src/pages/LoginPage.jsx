import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Mensagem from '../components/Mensagem.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { mensagemDeErro, mensagemDeSucesso } from '../utils/mensagens.js';

export default function LoginPage() {
  const { usuario, carregando, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(
    location.state?.cadastroConcluido ? mensagemDeSucesso('Cadastro realizado. Faça login para continuar.') : null,
  );

  if (!carregando && usuario) {
    return <Navigate to="/veiculos" replace />;
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setMensagem(null);

    try {
      await entrar(email, senha);
      navigate('/veiculos', { replace: true });
    } catch (erro) {
      setMensagem(mensagemDeErro(erro));
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-autenticacao">
      <form className="cartao formulario cartao-autenticacao" onSubmit={enviar}>
        <h1>Locadora de Veículos</h1>
        <p className="subtitulo">Entre com a sua conta para gerenciar veículos e locações.</p>
        <Mensagem mensagem={mensagem} aoFechar={() => setMensagem(null)} />
        <label className="campo">
          <span>E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="campo">
          <span>Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" className="botao botao-primario botao-bloco" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="rodape-formulario">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}
