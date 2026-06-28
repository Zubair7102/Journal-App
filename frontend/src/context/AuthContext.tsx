import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { login as loginApi, signup as signupApi } from '../api/auth.api';
import { fetchCurrentUser } from '../api/user.api';
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUsername,
  setStoredAuth,
} from '../api/client';
import type { UserCredentials, UserProfile } from '../types/user';

interface AuthContextValue {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  signup: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      return;
    }
    const profile = await fetchCurrentUser();
    setUser(profile);
  }, []);

  useEffect(() => {
    const init = async () => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        await refreshUser();
      } catch {
        clearStoredAuth();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void init();
  }, [refreshUser]);

  const login = useCallback(async (credentials: UserCredentials) => {
    const jwt = await loginApi(credentials);
    setStoredAuth(jwt, credentials.userName);
    setToken(jwt);
    await refreshUser();
  }, [refreshUser]);

  const signup = useCallback(async (credentials: UserCredentials) => {
    await signupApi(credentials);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.roles?.includes('ADMIN') ?? false,
      isLoading,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [token, user, isLoading, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const getDisplayName = (user: UserProfile | null): string =>
  user?.userName ?? getStoredUsername() ?? 'User';
