export interface Creator {
  id: string;
  nome: string;
  descricao: string;
  avatar: string;
  especialidade: string;
  plataforma: string;
  link: string;
  seguidores?: string;
  destaque: boolean;
}

export const creators: Creator[] = [];
