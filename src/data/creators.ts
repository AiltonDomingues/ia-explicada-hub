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

export const creators: Creator[] = [
  {
    id: "1",
    nome: "Andrew Ng",
    descricao: "Co-fundador do Coursera e professor de Stanford. Pioneiro em Deep Learning e educação em IA acessível.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    especialidade: "Deep Learning",
    plataforma: "YouTube",
    link: "https://www.youtube.com/@Deeplearningai",
    seguidores: "1.2M",
    destaque: true
  },
  {
    id: "2",
    nome: "Lex Fridman",
    descricao: "Pesquisador do MIT e host de podcast. Entrevistas profundas com líderes em IA e tecnologia.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    especialidade: "AI Research",
    plataforma: "YouTube",
    link: "https://www.youtube.com/@lexfridman",
    seguidores: "3.5M",
    destaque: true
  },
  {
    id: "3",
    nome: "Yannic Kilcher",
    descricao: "Análises detalhadas de papers de ML/AI. Explicações técnicas e claras sobre os últimos avanços.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    especialidade: "Machine Learning",
    plataforma: "YouTube",
    link: "https://www.youtube.com/@YannicKilcher",
    seguidores: "450K",
    destaque: true
  },
  {
    id: "4",
    nome: "Cassie Kozyrkov",
    descricao: "Chief Decision Scientist no Google. Torna conceitos complexos de ML acessíveis para todos.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    especialidade: "Data Science",
    plataforma: "LinkedIn",
    link: "https://www.linkedin.com/in/cassie-kozyrkov-9531919",
    seguidores: "800K",
    destaque: true
  },
  {
    id: "5",
    nome: "Andrej Karpathy",
    descricao: "Co-fundador da OpenAI e ex-diretor de IA da Tesla. Educador apaixonado em Deep Learning.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    especialidade: "Computer Vision",
    plataforma: "Twitter",
    link: "https://twitter.com/karpathy",
    seguidores: "900K",
    destaque: true
  },
  {
    id: "6",
    nome: "Two Minute Papers",
    descricao: "Resumos rápidos e visuais dos papers mais recentes em IA, gráficos e simulações.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    especialidade: "AI Research",
    plataforma: "YouTube",
    link: "https://www.youtube.com/@TwoMinutePapers",
    seguidores: "1.5M",
    destaque: true
  },
  {
    id: "7",
    nome: "StatQuest",
    descricao: "Josh Starmer explica estatística e ML de forma divertida e clara, com músicas e animações.",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
    especialidade: "Statistics & ML",
    plataforma: "YouTube",
    link: "https://www.youtube.com/@statquest",
    seguidores: "1.1M",
    destaque: false
  },
  {
    id: "8",
    nome: "Rachel Thomas",
    descricao: "Co-fundadora do fast.ai. Defensora de IA ética e educação acessível em Deep Learning.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    especialidade: "AI Ethics",
    plataforma: "Twitter",
    link: "https://twitter.com/math_rachel",
    seguidores: "100K",
    destaque: false
  }
];
