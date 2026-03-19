import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Noticia, Artigo, Curso, Material, Creator } from '@/lib/supabase';

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
      
      // Map database fields to component format
      return data.map((artigo: any) => ({
        ...artigo,
        tempoLeitura: artigo.tempo_leitura || '5 min',
        categoria: artigo.categoria || 'Inteligência Artificial',
      }));
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
        .order('area', { ascending: true })
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
