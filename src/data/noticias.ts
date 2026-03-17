export interface Noticia {
  id: number;
  categoria: string;
  trending?: boolean;
  titulo: string;
  descricao: string;
  tags: string[];
  tempoLeitura: string;
  data: string;
}

export const noticias: Noticia[] = [
  {
    id: 1,
    categoria: "Lançamentos",
    trending: true,
    titulo: "GPT-4 Turbo: Nova Era da Inteligência Artificial",
    descricao: "Descubra as principais novidades e melhorias da mais recente versão do modelo de linguagem da OpenAI.",
    tags: ["GPT-4", "OpenAI", "linguagem", "turbo"],
    tempoLeitura: "5 min",
    data: "14/01/2024",
  },
  {
    id: 2,
    categoria: "Tendências",
    titulo: "IA Generativa Transformando o Design",
    descricao: "Como ferramentas de IA estão revolucionando a criação de conteúdo visual e design gráfico.",
    tags: ["design", "criatividade", "geração", "visual"],
    tempoLeitura: "8 min",
    data: "11/01/2024",
  },
  {
    id: 3,
    categoria: "Análise",
    trending: true,
    titulo: "Ética em IA: Desafios e Soluções",
    descricao: "Análise profunda dos aspectos éticos no desenvolvimento e implementação de sistemas de IA.",
    tags: ["ética", "sociedade", "regulamentação", "responsabilidade"],
    tempoLeitura: "12 min",
    data: "09/01/2024",
  },
  {
    id: 4,
    categoria: "Lançamentos",
    trending: true,
    titulo: "Google Lança Gemini Ultra",
    descricao: "Nova família de modelos de IA do Google promete superar o GPT-4 em diversos benchmarks.",
    tags: ["Google", "Gemini", "benchmark", "competição"],
    tempoLeitura: "6 min",
    data: "07/01/2024",
  },
  {
    id: 5,
    categoria: "Empresarial",
    titulo: "Microsoft Copilot para Empresas",
    descricao: "Nova versão empresarial do Copilot oferece recursos avançados de segurança e compliance.",
    tags: ["Microsoft", "Copilot", "empresa", "segurança"],
    tempoLeitura: "7 min",
    data: "04/01/2024",
  },
  {
    id: 6,
    categoria: "Educação",
    titulo: "IA na Educação: Personalização do Aprendizado",
    descricao: "Como sistemas adaptativos estão revolucionando a forma como aprendemos.",
    tags: ["educação", "personalização", "aprendizado", "adaptativo"],
    tempoLeitura: "9 min",
    data: "02/01/2024",
  },
];
