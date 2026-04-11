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

export type BlogPost = {
  id: string;
  titulo: string;
  descricao: string;
  url_imagem: string | null;
  url_conteudo: string;
  categoria: 'Blog' | 'Caso de Uso' | 'Guia' | 'Tutorial';
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Todos os níveis';
  fonte: string;
  autor_original: string;
  tempo_leitura: string | null;
  tags: string[];
  data: string;
  destaque: boolean;
  created_at?: string;
  updated_at?: string;
};

// DEPRECATED: Substituído por BlogPost
// export type Artigo = {
//   id: string;
//   titulo: string;
//   autor: string;
//   resumo: string;
//   categoria: string;
//   data: string;
//   tags: string[];
//   tempo_leitura: string;
//   tempoLeitura?: string;
//   link: string;
//   destaque?: boolean;
//   created_at?: string;
// };

export type Ferramenta = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: "Gratuito" | "Freemium" | "Pago" | "Trial Grátis";
  url: string;
  logo?: string;
  tags: string[];
  verificada: boolean;
  destaque: boolean;
  ranking?: number;
  created_at?: string;
  updated_at?: string;
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
  ordem_area?: number;
  ordem_subarea?: number;
  nivel?: string;
  materiais_complementares?: Array<{
    titulo: string;
    url: string;
    tipo: 'video' | 'artigo' | 'curso' | 'documentacao' | 'outro';
  }>;
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

// User System Types
export type Profile = {
  id: string;
  username: string;
  nome_completo: string;
  bio?: string;
  avatar_url?: string;
  
  // Permissões
  is_admin?: boolean;
  email?: string;
  
  // Situação profissional/acadêmica
  situacao?: 'estudante' | 'profissional' | 'pesquisador' | 'empreendedor' | 'transicao' | 'explorando';
  instituicao?: string;
  curso?: string;
  semestre?: string;
  empresa?: string;
  cargo?: string;
  area_atuacao?: 'ti' | 'saude' | 'financas' | 'marketing' | 'educacao' | 'engenharia' | 'design' | 'vendas' | 'juridico' | 'outros';
  
  // Experiência com IA
  nivel_ia?: 'iniciante' | 'explorador' | 'intermediario' | 'avancado' | 'especialista';
  trabalha_com_ia?: 'funcao_principal' | 'dia_a_dia' | 'quer_trabalhar' | 'interesse_pessoal';
  objetivo?: 'aprender_zero' | 'desenvolver_carreira' | 'aplicar_trabalho' | 'transicao_carreira' | 'manter_atualizado' | 'pesquisa_academica';
  auto_filtrar_por_nivel?: boolean;
  
  // Dados complementares
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  localizacao?: string;
  
  created_at?: string;
  updated_at?: string;
};

export type UserInteresse = {
  id: string;
  user_id: string;
  interesse: 'machine_learning' | 'deep_learning' | 'nlp' | 'visao_computacional' | 'ia_generativa' | 'mlops' | 'ia_etica' | 'robotica' | 'data_science' | 'big_data';
  created_at?: string;
};

export type UserFavorito = {
  id: string;
  user_id: string;
  tipo: 'blog' | 'curso' | 'material';  // Apenas blog, cursos e materiais podem ser salvos
  item_id: string;
  created_at?: string;
};

export type UserHistorico = {
  id: string;
  user_id: string;
  tipo: 'blog' | 'curso' | 'ferramenta' | 'material' | 'evento' | 'noticia' | 'conceito';
  item_id: string;
  ultima_visualizacao?: string;
};
