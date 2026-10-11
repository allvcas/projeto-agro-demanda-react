import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageGet, storageSet, storageRemove } from '../utils/storage';
import * as authService from '../services/authService';

const AuthContext = createContext(null);
const SESSION_KEY = 'agrodemanda_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storageGet(SESSION_KEY));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      storageSet(SESSION_KEY, user);
    } else {
      storageRemove(SESSION_KEY);
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      return await authService.register(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    storageRemove('agrodemanda_draft');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
