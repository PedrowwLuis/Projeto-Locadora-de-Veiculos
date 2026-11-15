import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';

export default function RotaProtegida() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p className="carregando">Verificando sessão…</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="conteudo">
        <Outlet />
      </main>
    </>
  );
}
