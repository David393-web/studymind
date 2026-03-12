import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sm_token');
    const stored = localStorage.getItem('sm_user');
    if (token && stored) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const persist = (token, user) => {
    localStorage.setItem('sm_token', token);
    localStorage.setItem('sm_user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    persist(data.token, data.user);
    return data;
  };

  const register = async (email, password, full_name) => {
    const { data } = await axios.post('/api/auth/register', { email, password, full_name });
    persist(data.token, data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sm_token');
    localStorage.removeItem('sm_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
