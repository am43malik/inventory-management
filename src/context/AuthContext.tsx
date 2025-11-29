'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api-client';

interface User {
  userId?: string;
  id?: string;
  email: string;
  name: string;
  role: 'admin' | 'cashier';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await api.verify();
      if (response.data.success) {
        setUser(response.data.user);
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } else {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  };

  // Auto-verify session on app startup
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check localStorage for cached user
        if (typeof window !== 'undefined') {
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
          }
        }

        // Then verify with server
        await refresh();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      if (response.data.success) {
        setUser(response.data.user);
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.register(email, name, password);
      if (response.data.success) {
        setUser(response.data.user);
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
