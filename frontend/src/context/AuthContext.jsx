import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buscarPerfil, entrarNoSistema } from '../api/authApi.js';
import { definirAoNaoAutorizado, lerToken, removerToken, salvarToken } from '../api/http.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const sair = useCallback(() => {
    removerToken();
    setUsuario(null);
  }, []);

  useEffect(() => {
    definirAoNaoAutorizado(sair);
  }, [sair]);

  useEffect(() => {
    let ativo = true;

    async function restaurarSessao() {
      if (!lerToken()) {
        setCarregando(false);
        return;
      }
      try {
        const perfil = await buscarPerfil();
        if (ativo) {
          setUsuario(perfil);
        }
      } catch {
        removerToken();
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    restaurarSessao();

    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (email, senha) => {
    const resposta = await entrarNoSistema({ email, senha });
    salvarToken(resposta.token);
    setUsuario(resposta.usuario);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, sair }),
    [usuario, carregando, entrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return contexto;
}
