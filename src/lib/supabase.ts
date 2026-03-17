import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Noticia = {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  link: string;
  tags: string[];
  tempo_leitura: string;
  trending: boolean;
  created_at?: string;
};

export type Artigo = {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  categoria: string;
  data: string;
  tags: string[];
  tempoLeitura: string;
  link: string;
  destaque?: boolean;
  created_at?: string;
};

export type Curso = {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  nivel: string;
  plataforma: string;
  duracao: string;
  estudantes: string;
  nota: string;
  avaliacoes: string;
  preco: string;
  link: string;
  destaque?: boolean;
  created_at?: string;
};

export type Material = {
  id: string;
  titulo: string;
  tipo: string;
  categoria: string;
  descricao: string;
  tamanho: string;
  downloads: string;
  autor?: string;
  link?: string;
  created_at?: string;
};
