import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type RoleType = 'admin' | 'user' | null;

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: RoleType;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchRole(userId: string): Promise<RoleType> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data.role as RoleType;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<RoleType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      if (!supabase) {
        if (mounted) {
          console.warn('Supabase is not configured. Admin login will not be available.');
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      if (!mounted) return;

      setSession(currentSession ?? null);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const fetchedRole = await fetchRole(currentSession.user.id);
        if (mounted) setRole(fetchedRole);
      } else {
        setRole(null);
      }

      setLoading(false);
    };

    initialize();

    const { data: authListener } = supabase?.auth.onAuthStateChange((_, authSession) => {
      setSession(authSession ?? null);
      setUser(authSession?.user ?? null);

      if (authSession?.user) {
        fetchRole(authSession.user.id).then((fetchedRole) => {
          if (mounted) setRole(fetchedRole);
        });
      } else {
        setRole(null);
      }
    }) ?? { data: null };

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Database is not configured. Please set up Supabase credentials in .env');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }

    const currentUser = data.user;
    if (!currentUser) {
      throw new Error('Authentication failed: No user returned');
    }

    const fetchedRole = await fetchRole(currentUser.id);
    if (fetchedRole !== 'admin') {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRole(null);
      throw new Error('This account is not authorized for admin access. Please contact the administrator.');
    }

    setUser(currentUser);
    setSession(data.session ?? null);
    setRole(fetchedRole);
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    role,
    isAdmin: role === 'admin',
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
