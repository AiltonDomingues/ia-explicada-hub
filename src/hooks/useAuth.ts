import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign In com Email/Senha
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // Sign Up com Email/Senha
  const signUp = async (email: string, password: string, metadata?: {
    nome_completo?: string;
    username?: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Metadados que serão usados no trigger para criar o perfil
      },
    });
    return { data, error };
  };

  // Sign In com Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  // Sign In com GitHub
  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  // Reset Password (envia email)
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  // Update Password
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Delete Account (permanentemente)
  const deleteAccount = async () => {
    if (!user) return { error: new Error('Usuário não autenticado') };
    
    console.log('[useAuth] Deletando conta do usuário:', user.id);
    
    try {
      // Chamar função SQL que deleta tudo (criada no script enable-account-deletion.sql)
      console.log('[useAuth] Chamando RPC delete_user_account...');
      const { data, error } = await supabase.rpc('delete_user_account');
      
      console.log('[useAuth] Resposta do RPC:', { data, error });
      
      if (error) {
        console.error('[useAuth] Erro no RPC:', error);
        throw error;
      }
      
      console.log('[useAuth] Conta deletada com sucesso, fazendo logout...');
      
      // Fazer logout após deletar
      await signOut();
      
      console.log('[useAuth] Logout completo');
      
      return { error: null };
    } catch (error: any) {
      console.error('[useAuth] Exceção ao deletar conta:', error);
      return { error };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    updatePassword,
    signOut,
    deleteAccount,
    isAuthenticated: !!user,
  };
};
