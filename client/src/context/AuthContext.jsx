import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('lumiere_token');
      if (token) {
        try {
          const res = await getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
          }
        } catch (err) {
          console.error('Session expired', err);
          localStorage.removeItem('lumiere_token');
          localStorage.removeItem('lumiere_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        localStorage.setItem('lumiere_token', res.token);
        localStorage.setItem('lumiere_user', JSON.stringify(res.user));
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await registerUser(userData);
      if (res.success) {
        localStorage.setItem('lumiere_token', res.token);
        localStorage.setItem('lumiere_user', JSON.stringify(res.user));
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('lumiere_token');
      localStorage.removeItem('lumiere_user');
      setUser(null);
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
