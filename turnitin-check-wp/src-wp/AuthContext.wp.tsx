import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthState } from '@/types';

declare global {
  interface Window {
    academicAssistAjax?: {
      ajaxUrl: string;
      nonce: string;
      restUrl: string;
      isLoggedIn: boolean;
      currentUser?: {
        id: number;
        name: string;
        email: string;
      };
    };
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing WordPress session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (window.academicAssistAjax?.isLoggedIn && window.academicAssistAjax.currentUser) {
        const user: User = {
          id: window.academicAssistAjax.currentUser.id.toString(),
          email: window.academicAssistAjax.currentUser.email,
          name: window.academicAssistAjax.currentUser.name,
          createdAt: new Date(),
        };
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const ajaxUrl = window.academicAssistAjax?.ajaxUrl || '/wp-admin/admin-ajax.php';
      const nonce = window.academicAssistAjax?.nonce || '';
      
      const formData = new FormData();
      formData.append('action', 'academic_assist_auth');
      formData.append('nonce', nonce);
      formData.append('auth_action', 'login');
      formData.append('email', email);
      formData.append('password', password);
      
      const response = await fetch(ajaxUrl, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });
      
      const data = await response.json();
      
      if (data.success) {
        const user: User = {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name,
          createdAt: new Date(),
        };
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(data.data?.message || 'Login failed');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const ajaxUrl = window.academicAssistAjax?.ajaxUrl || '/wp-admin/admin-ajax.php';
      const nonce = window.academicAssistAjax?.nonce || '';
      
      const formData = new FormData();
      formData.append('action', 'academic_assist_auth');
      formData.append('nonce', nonce);
      formData.append('auth_action', 'register');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      
      const response = await fetch(ajaxUrl, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });
      
      const data = await response.json();
      
      if (data.success) {
        const user: User = {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name,
          createdAt: new Date(),
        };
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(data.data?.message || 'Registration failed');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // WordPress logout would need a custom endpoint
    // For now, just clear the local state
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Redirect to WordPress logout
    window.location.href = '/wp-login.php?action=logout';
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
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
