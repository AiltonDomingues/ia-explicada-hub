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

export const eventos: Evento[] = [
  {
    id: '1',
    titulo: 'AI Summit Brasil 2026',
    data: '2026-05-15',
    local: 'São Paulo, SP',
    tipo: 'Conferência',
    nivel: 'Intermediário',
    descricao: 'O maior evento de Inteligência Artificial da América Latina. Palestrantes internacionais, workshops práticos e networking com profissionais da área.',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    link: 'https://example.com/ai-summit',
    organizador: 'Tech Events Brasil'
  },
  {
    id: '2',
    titulo: 'Workshop: Machine Learning na Prática',
    data: '2026-04-20',
    local: 'Online',
    tipo: 'Workshop',
    nivel: 'Iniciante',
    descricao: 'Aprenda a construir seu primeiro modelo de Machine Learning do zero. Hands-on com Python, scikit-learn e casos práticos do mercado.',
    banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
    link: 'https://example.com/ml-workshop',
    organizador: 'IA Explicada'
  },
  {
    id: '3',
    titulo: 'Hackathon IA para Saúde',
    data: '2026-06-10',
    local: 'Rio de Janeiro, RJ',
    tipo: 'Hackathon',
    nivel: 'Avançado',
    descricao: 'Desenvolva soluções de IA para problemas reais da área de saúde. Prêmios de até R$ 50.000 e mentorias com especialistas.',
    banner: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
    link: 'https://example.com/hackathon-saude',
    organizador: 'Health Tech Innovation'
  },
  {
    id: '4',
    titulo: 'Meetup: Deep Learning e Visão Computacional',
    data: '2026-04-05',
    local: 'Belo Horizonte, MG',
    tipo: 'Meetup',
    nivel: 'Intermediário',
    descricao: 'Encontro mensal para discussão de técnicas avançadas de Deep Learning aplicadas a Computer Vision. Apresentação de projetos da comunidade.',
    banner: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop',
    link: 'https://example.com/meetup-dl',
    organizador: 'AI Community BH'
  }
];
