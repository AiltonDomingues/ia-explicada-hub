export interface Artigo {
  id: number;
  categoria: string;
  destaque?: boolean;
  titulo: string;
  resumo: string;
  tags: string[];
  autor: string;
  tempoLeitura: string;
  link: string;
}

export const artigos: Artigo[] = [];
