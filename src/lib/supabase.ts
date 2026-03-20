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
  resumo: string;
  categoria: string;
  data: string;
  tags: string[];
  tempo_leitura: string;
  tempoLeitura?: string; // Computed alias
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
  nota: string;
  preco: string;
  link: string;
  categoria: string;
  destaque?: boolean;
  created_at?: string;
};

export type Material = {
  id: string;
  titulo: string;
  tipo: string;
  nivel: string;
  descricao: string;
  tamanho: string;
  autor: string;
  link: string;
  created_at?: string;
};

export type Conceito = {
  id: string;
  titulo: string;
  area: string;
  subarea?: string;
  conteudo: string;
  slug: string;
  tags: string[];
  ordem: number;
  nivel?: string;
  created_at?: string;
  updated_at?: string;
};

export type Evento = {
  id: string;
  titulo: string;
  data: string;
  local: string;
  tipo: string;
  descricao: string;
  banner: string;
  link?: string;
  organizador?: string;
  nivel?: string;
  created_at?: string;
};

export type Creator = {
  id: string;
  nome: string;
  descricao: string;
  avatar: string;
  especialidade: string;
  plataforma: string;
  link: string;
  seguidores?: string;
  destaque: boolean;
  created_at?: string;
};
