import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Noticia, Curso, Material, Creator, Ferramenta, Profile, UserFavorito, UserInteresse } from '@/lib/supabase';

// Fetch Notícias
export const useNoticias = () => {
  return useQuery({
    queryKey: ['noticias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to component format
      return data.map((noticia: any) => ({
        ...noticia,
        tempoLeitura: noticia.tempo_leitura,
      }));
    },
  });
};

// Fetch Blog Posts
export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// DEPRECATED: Substituído por useBlogPosts
// export const useArtigos = () => {
//   return useQuery({
//     queryKey: ['artigos'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('artigos')
//         .select('*')
//         .order('data', { ascending: false });
//       
//       if (error) throw error;
//       
//       return data.map((artigo: any) => ({
//         ...artigo,
//         tempoLeitura: artigo.tempo_leitura || '5 min',
//         categoria: artigo.categoria || 'Inteligência Artificial',
//       }));
//     },
//   });
// };

// Fetch Cursos
export const useCursos = () => {
  return useQuery({
    queryKey: ['cursos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to component format
      return data.map((curso: any) => ({
        ...curso,
        autor: curso.autor || curso.instrutor || 'Autor',
        plataforma: curso.plataforma || 'Online',
        nota: curso.nota || '0',
      }));
    },
  });
};

// Fetch Materiais
export const useMateriais = () => {
  return useQuery({
    queryKey: ['materiais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to component format
      return data.map((material: any) => ({
        ...material,
        nivel: material.nivel || 'Iniciante',
        tamanho: material.tamanho || '0 MB',
      }));
    },
  });
};

// Fetch Conceitos
export const useConceitos = () => {
  return useQuery({
    queryKey: ['conceitos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conceitos')
        .select('*')
        .order('ordem_area', { ascending: true })
        .order('area', { ascending: true })
        .order('ordem_subarea', { ascending: true })
        .order('subarea', { ascending: true })
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      
      // Map database fields to component format
      return data.map((conceito: any) => ({
        ...conceito,
        nivel: conceito.nivel || 'Intermediário',
      }));
    },
  });
};

// Fetch Eventos
export const useEventos = () => {
  return useQuery({
    queryKey: ['eventos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data', { ascending: true });
      
      if (error) throw error;
      
      // Map database fields to component format
      return data.map((evento: any) => ({
        ...evento,
      }));
    },
  });
};

// Fetch Creators
export const useCreators = () => {
  return useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('destaque', { ascending: false })
        .order('nome', { ascending: true });
      
      if (error) throw error;
      
      return data as Creator[];
    },
  });
};

// Fetch Ferramentas
export const useFerramentas = () => {
  return useQuery({
    queryKey: ['ferramentas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ferramentas')
        .select('*')
        .order('categoria', { ascending: true })
        .order('ranking', { ascending: true, nullsLast: true })
        .order('nome', { ascending: true });
      
      if (error) throw error;
      
      return data as Ferramenta[];
    },
  });
};

// ============================================
// USER SYSTEM HOOKS
// ============================================

// Fetch Profile do usuário logado
export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });
};

// Fetch Profile por username
export const useProfileByUsername = (username?: string) => {
  return useQuery({
    queryKey: ['profile', 'username', username],
    queryFn: async () => {
      if (!username) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!username,
  });
};

// Verificar se username está disponível
export const useCheckUsername = (username?: string) => {
  return useQuery({
    queryKey: ['check-username', username],
    queryFn: async () => {
      if (!username || username.length < 3) return { available: null, message: null };
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (error) {
        console.error('Erro ao verificar username:', error);
        return { available: null, message: 'Erro ao verificar' };
      }
      
      return {
        available: !data,
        message: data ? 'Nome de usuário já existe' : 'Nome de usuário disponível'
      };
    },
    enabled: !!username && username.length >= 3,
    staleTime: 5000, // Cache por 5 segundos
    retry: false,
  });
};

// Update Profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'username', data.username] });
    },
  });
};

// Fetch Interesses do usuário
export const useUserInteresses = (userId?: string) => {
  return useQuery({
    queryKey: ['user_interesses', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_interesses')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data as UserInteresse[];
    },
    enabled: !!userId,
  });
};

// Add Interesse
export const useAddInteresse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, interesse }: { userId: string; interesse: UserInteresse['interesse'] }) => {
      // Verificar se já existe antes de inserir
      const { data: existing } = await supabase
        .from('user_interesses')
        .select('id')
        .eq('user_id', userId)
        .eq('interesse', interesse)
        .maybeSingle();
      
      if (existing) {
        // Já existe, retornar sem erro
        return existing as UserInteresse;
      }
      
      const { data, error } = await supabase
        .from('user_interesses')
        .insert({ user_id: userId, interesse })
        .select()
        .single();
      
      if (error) throw error;
      return data as UserInteresse;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_interesses', variables.userId] });
    },
  });
};

// Remove Interesse
export const useRemoveInteresse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, interesse }: { userId: string; interesse: string }) => {
      const { error } = await supabase
        .from('user_interesses')
        .delete()
        .eq('user_id', userId)
        .eq('interesse', interesse);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_interesses', variables.userId] });
    },
  });
};

// Fetch Favoritos do usuário
export const useFavoritos = (userId?: string, tipo?: UserFavorito['tipo']) => {
  return useQuery({
    queryKey: ['user_favoritos', userId, tipo],
    queryFn: async () => {
      if (!userId) return [];
      
      let query = supabase
        .from('user_favoritos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (tipo) {
        query = query.eq('tipo', tipo);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as UserFavorito[];
    },
    enabled: !!userId,
  });
};

// Add Favorito
export const useAddFavorito = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, tipo, itemId }: { userId: string; tipo: UserFavorito['tipo']; itemId: string }) => {
      const { data, error } = await supabase
        .from('user_favoritos')
        .insert({ user_id: userId, tipo, item_id: itemId })
        .select()
        .single();
      
      if (error) throw error;
      return data as UserFavorito;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_favoritos', variables.userId] });
    },
  });
};

// Remove Favorito
export const useRemoveFavorito = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, tipo, itemId }: { userId: string; tipo: UserFavorito['tipo']; itemId: string }) => {
      const { error } = await supabase
        .from('user_favoritos')
        .delete()
        .eq('user_id', userId)
        .eq('tipo', tipo)
        .eq('item_id', itemId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_favoritos', variables.userId] });
    },
  });
};

// Check se item está nos favoritos
export const useIsFavorito = (userId?: string, tipo?: UserFavorito['tipo'], itemId?: string) => {
  return useQuery({
    queryKey: ['is_favorito', userId, tipo, itemId],
    queryFn: async () => {
      if (!userId || !tipo || !itemId) return false;
      
      const { data, error } = await supabase
        .from('user_favoritos')
        .select('id')
        .eq('user_id', userId)
        .eq('tipo', tipo)
        .eq('item_id', itemId)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!userId && !!tipo && !!itemId,
  });
};

// Add ao histórico (ou atualiza última visualização)
export const useAddHistorico = () => {
  return useMutation({
    mutationFn: async ({ userId, tipo, itemId }: { userId: string; tipo: UserFavorito['tipo']; itemId: string }) => {
      const { error } = await supabase
        .from('user_historico')
        .upsert(
          { user_id: userId, tipo, item_id: itemId, ultima_visualizacao: new Date().toISOString() },
          { onConflict: 'user_id,tipo,item_id' }
        );
      
      if (error) throw error;
    },
  });
};

// ============ ADMIN - GESTÃO DE USUÁRIOS ============

// Buscar todos os usuários com seus perfis
export const useAllUsers = () => {
  return useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
  });
};

// Estatísticas gerais de usuários
export const useUserStats = () => {
  return useQuery({
    queryKey: ['user_stats'],
    queryFn: async () => {
      // Total de usuários
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Usuários cadastrados hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayUsers, error: todayError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      if (todayError) throw todayError;

      // Usuários cadastrados esta semana (últimos 7 dias)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: weekUsers, error: weekError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      if (weekError) throw weekError;

      // Usuários por nível de IA
      const { data: nivelData, error: nivelError } = await supabase
        .from('profiles')
        .select('nivel_ia');

      if (nivelError) throw nivelError;

      const nivelCounts = {
        iniciante: 0,
        explorador: 0,
        intermediario: 0,
        avancado: 0,
        especialista: 0,
        naoInformado: 0
      };

      nivelData?.forEach(profile => {
        if (profile.nivel_ia) {
          nivelCounts[profile.nivel_ia as keyof typeof nivelCounts]++;
        } else {
          nivelCounts.naoInformado++;
        }
      });

      // Usuários por situação
      const { data: situacaoData, error: situacaoError } = await supabase
        .from('profiles')
        .select('situacao');

      if (situacaoError) throw situacaoError;

      const situacaoCounts = {
        estudante: 0,
        profissional: 0,
        pesquisador: 0,
        empreendedor: 0,
        transicao: 0,
        explorando: 0,
        naoInformado: 0
      };

      situacaoData?.forEach(profile => {
        if (profile.situacao) {
          situacaoCounts[profile.situacao as keyof typeof situacaoCounts]++;
        } else {
          situacaoCounts.naoInformado++;
        }
      });

      // Interesses mais populares
      const { data: interessesData, error: interessesError } = await supabase
        .from('user_interesses')
        .select('interesse');

      if (interessesError) throw interessesError;

      const interesseCounts: Record<string, number> = {};
      interessesData?.forEach(item => {
        interesseCounts[item.interesse] = (interesseCounts[item.interesse] || 0) + 1;
      });

      const topInteresses = Object.entries(interesseCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([interesse, count]) => ({ interesse, count }));

      return {
        totalUsers: totalUsers || 0,
        todayUsers: todayUsers || 0,
        weekUsers: weekUsers || 0,
        nivelCounts,
        situacaoCounts,
        topInteresses
      };
    },
  });
};
