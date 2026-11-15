import { Navigate, Route, Routes } from 'react-router-dom';
import RotaProtegida from './components/RotaProtegida.jsx';
import CadastroPage from './pages/CadastroPage.jsx';
import LocacoesPage from './pages/LocacoesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import VeiculosPage from './pages/VeiculosPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route element={<RotaProtegida />}>
        <Route path="/veiculos" element={<VeiculosPage />} />
        <Route path="/locacoes" element={<LocacoesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/veiculos" replace />} />
    </Routes>
  );
}
