import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function aoSair() {
    sair();
    navigate('/login', { replace: true });
  }

  function classeLink({ isActive }) {
    return isActive ? 'nav-link nav-link-ativo' : 'nav-link';
  }

  return (
    <header className="navbar">
      <div className="navbar-interno">
        <span className="navbar-marca">Locadora</span>
        <nav className="navbar-links">
          <NavLink to="/veiculos" className={classeLink}>
            Veículos
          </NavLink>
          <NavLink to="/locacoes" className={classeLink}>
            Locações
          </NavLink>
        </nav>
        <div className="navbar-usuario">
          <span className="navbar-nome">{usuario?.nome}</span>
          <button type="button" className="botao botao-secundario botao-pequeno" onClick={aoSair}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
