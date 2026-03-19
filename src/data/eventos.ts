export interface Evento {
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
}

export const eventos: Evento[] = [];
