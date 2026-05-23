import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      if (storedToken && storedUser) {
        // Verify token is not expired
        const decoded = jwtDecode(storedToken);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          localStorage.clear();
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    // Backend returns: { token, usuario: { id, nombre, rol } }
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data.usuario));
    setToken(data.token);
    setUser(data.usuario);
    return data;
  };

  const register = async (nombre, email, password) => {
    return authApi.register(nombre, email, password);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
