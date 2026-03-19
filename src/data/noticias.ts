export interface Noticia {
  id: number;
  categoria: string;
  trending?: boolean;
  titulo: string;
  descricao: string;
  tags: string[];
  tempoLeitura: string;
  data: string;
  link?: string;
  imagem_url?: string;
}

export const noticias: Noticia[] = [];
