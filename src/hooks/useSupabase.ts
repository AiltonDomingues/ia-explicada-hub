import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Noticia, Artigo, Curso, Material } from '@/lib/supabase';

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

// Fetch Artigos
export const useArtigos = () => {
  return useQuery({
    queryKey: ['artigos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artigos')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) throw error;
      return data as Artigo[];
    },
  });
};

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
      return data as Curso[];
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
      return data as Material[];
    },
  });
};
