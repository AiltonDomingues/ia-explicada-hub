export interface Curso {
  id: number;
  categoria: string;
  nivel: string;
  plataforma: string;
  destaque?: boolean;
  titulo: string;
  autor: string;
  descricao: string;
  duracao: string;
  nota: string;
  preco: string;
  link: string;
}

export const cursos: Curso[] = [];
