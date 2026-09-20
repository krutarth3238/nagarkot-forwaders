import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../lib/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Backend returns snake_case — map to camelCase AuthUser.
function mapUser(raw: any): AuthUser {
  return {
    id: raw.id,
    fullName: raw.full_name ?? raw.fullName ?? '',
    email: raw.email ?? '',
    role: raw.role ?? 'Operations Officer',
    officerCode: raw.officer_code ?? raw.officerCode ?? null,
    avatarUrl: raw.avatar_url ?? raw.avatarUrl ?? null,
  };
}
const TOKEN_KEY = 'nagarkot_session_token';

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  officerCode: string | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Session expired');

      const data = await res.json();
      // /api/auth/me returns { user: {...} } — unwrap and map snake_case.
      setUser(mapUser(data.user ?? data));
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const exchangeIdTokenForSession = async (
    idToken: string,
    fallbackMessage: string,
    fullName?: string
  ) => {
    const res = await fetch(`${API_URL}/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, fullName }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message = body?.error || fallbackMessage;
      setError(message);
      throw new Error(message);
    }

    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    // /api/auth/session returns { token, user: {...} } — map snake_case.
    setUser(mapUser(data.user));
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);

    const cred = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const idToken = await cred.user.getIdToken();

    await exchangeIdTokenForSession(
      idToken,
      'Invalid email or password'
    );
  }, []);

  const signUp = useCallback(async (
    fullName: string,
    email: string,
    password: string
  ) => {
    setError(null);

    const cred = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    if (fullName) {
      await updateProfile(cred.user, { displayName: fullName });
    }

    const idToken = await cred.user.getIdToken();

    await exchangeIdTokenForSession(
      idToken,
      'Could not create account',
      fullName
    );
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);

    const result = await signInWithPopup(
      firebaseAuth,
      googleProvider
    );

    const idToken = await result.user.getIdToken();

    await exchangeIdTokenForSession(
      idToken,
      'Google sign-in failed'
    );
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(firebaseAuth);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return ctx;
}
