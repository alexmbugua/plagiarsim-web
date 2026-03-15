import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthState } from '@/types';

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

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // Mock always logged in
      const user: User = {
        id: '1',
        email: 'user@example.com',
        name: 'Demo User',
        createdAt: new Date(),
        isAdmin: true,
        roles: ['administrator'],
      };
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    };
    checkSession();
  }, []);
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

    // Mock login - always succeed
    setTimeout(() => {
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        isAdmin: true,
        roles: ['administrator'],
      };
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    }, 500);
  }, []);
          window.academicAssistAjax.currentUser = {
            id: data.data.user.id,
            name: data.data.user.name,
            email: data.data.user.email,
            roles: data.data.user.roles ?? [],
          };
          window.academicAssistAjax.isAdmin = data.data.user.isAdmin || false;
        }

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

    // Mock register - always succeed
    setTimeout(() => {
      const user: User = {
        id: '1',
        email,
        name,
        createdAt: new Date(),
        isAdmin: true,
        roles: ['administrator'],
      };
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    }, 500);
  }, []);
          window.academicAssistAjax.isAdmin = data.data.user.isAdmin || false;
        }

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
