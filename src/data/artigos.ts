export interface Artigo {
  id: number;
  categoria: string;
  destaque?: boolean;
  titulo: string;
  descricao: string;
  tags: string[];
  autor: string;
  tempoLeitura: string;
}

export const artigos: Artigo[] = [
  {
    id: 1,
    categoria: "Automação",
    destaque: true,
    titulo: "O Futuro da Automação com IA",
    descricao: "Explore como a inteligência artificial está revolucionando processos industriais e transformando o mercado de trabalho.",
    tags: ["automação", "indústria", "futuro", "trabalho"],
    autor: "Dr. Maria Silva",
    tempoLeitura: "8 min",
  },
  {
    id: 2,
    categoria: "Ética",
    titulo: "Ética em Inteligência Artificial",
    descricao: "Discussão aprofundada sobre os dilemas éticos e responsabilidades no desenvolvimento de sistemas de IA.",
    tags: ["ética", "responsabilidade", "desenvolvimento", "sociedade"],
    autor: "Prof. João Santos",
    tempoLeitura: "12 min",
  },
  {
    id: 3,
    categoria: "Medicina",
    destaque: true,
    titulo: "IA na Medicina: Diagnósticos Precisos",
    descricao: "Como algoritmos de machine learning estão auxiliando médicos em diagnósticos mais rápidos e precisos.",
    tags: ["medicina", "diagnóstico", "machine learning", "saúde"],
    autor: "Dra. Ana Costa",
    tempoLeitura: "10 min",
  },
  {
    id: 4,
    categoria: "Deep Learning",
    titulo: "Redes Neurais Explicadas",
    descricao: "Um guia detalhado sobre como funcionam as redes neurais artificiais e suas aplicações práticas.",
    tags: ["redes neurais", "deep learning", "algoritmos", "tutorial"],
    autor: "Carlos Lima",
    tempoLeitura: "15 min",
  },
  {
    id: 5,
    categoria: "NLP",
    destaque: true,
    titulo: "Processamento de Linguagem Natural: Estado da Arte",
    descricao: "Análise das técnicas mais recentes em NLP e suas aplicações em chatbots e assistentes virtuais.",
    tags: ["NLP", "transformers", "chatbots", "linguagem"],
    autor: "Prof. Elena Rodriguez",
    tempoLeitura: "11 min",
  },
  {
    id: 6,
    categoria: "Computer Vision",
    titulo: "Computer Vision: Além do Reconhecimento",
    descricao: "Explorando aplicações avançadas de visão computacional em realidade aumentada e veículos autônomos.",
    tags: ["computer vision", "AR", "veículos autônomos", "reconhecimento"],
    autor: "Dr. Rafael Mendes",
    tempoLeitura: "13 min",
  },
];
