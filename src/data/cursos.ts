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

export const cursos: Curso[] = [
  {
    id: 1,
    categoria: "IA Generativa",
    nivel: "Intermediário",
    plataforma: "Alura",
    destaque: true,
    titulo: "GPT e Java: integre uma aplicação com a OpenAI",
    autor: "Rodrigo da Silva Ferreira Caneppele",
    descricao: "Desenvolva uma aplicação Java integrada com a API da OpenAI utilizando bibliotecas Java e boas práticas de engenharia de prompts.",
    duracao: "10h",
    nota: "9.3",
    preco: "R$ 19,90",
    link: "https://www.alura.com.br/curso-online-gpt-java-integre-aplicacao-openai",
  },
  {
    id: 2,
    categoria: "Agentes de IA",
    nivel: "Intermediário",
    plataforma: "Alura",
    destaque: true,
    titulo: "LangChain: desenvolva agentes de inteligência artificial",
    autor: "Guilherme Silveira",
    descricao: "Utilize LangChain e Python para criar agentes inteligentes que executam tarefas e automatizam a tomada de decisão.",
    duracao: "8h",
    nota: "9.3",
    preco: "R$ 79,90",
    link: "https://www.alura.com.br/curso-online-langchain-desenvolva-agentes-inteligencia-artificial",
  },
  {
    id: 3,
    categoria: "Fundamentos",
    nivel: "Iniciante",
    plataforma: "Udemy",
    destaque: true,
    titulo: "Formação Completa Inteligência Artificial - 2025",
    autor: "Fernando Amaral",
    descricao: "Machine Learning, Deep Learning, LLMs, IA Generativa, Redes Neurais, NLP e Agentes, tudo em um único curso completo!",
    duracao: "32.5h",
    nota: "4.6",
    preco: "R$ 59,90",
    link: "https://www.udemy.com/course/inteligencia-artificial-e-machine-learning/",
  },
  {
    id: 4,
    categoria: "Visão Computacional",
    nivel: "Iniciante",
    plataforma: "Udemy",
    destaque: true,
    titulo: "Computer Vision com OpenCV",
    autor: "Carlos Antônio",
    descricao: "Aprenda processamento de imagens e visão computacional usando OpenCV e Python.",
    duracao: "12h",
    nota: "8.9",
    preco: "R$ 49,90",
    link: "https://www.udemy.com/computer-vision-opencv",
  },
  {
    id: 5,
    categoria: "Processamento de Linguagem",
    nivel: "Avançado",
    plataforma: "edX",
    titulo: "NLP com Transformers",
    autor: "Dr. Maria Fernanda",
    descricao: "Processamento de linguagem natural usando modelos transformer estado da arte como BERT e GPT.",
    duracao: "20h",
    nota: "9.5",
    preco: "R$ 149,90",
    link: "https://www.edx.org/nlp-transformers",
  },
  {
    id: 6,
    categoria: "Deep Learning",
    nivel: "Intermediário",
    plataforma: "Coursera",
    titulo: "PyTorch para Deep Learning",
    autor: "Ana Paula Gomes",
    descricao: "Domine o framework PyTorch criando redes neurais desde o básico até arquiteturas avançadas.",
    duracao: "15h",
    nota: "9.1",
    preco: "R$ 89,90",
    link: "https://www.coursera.org/pytorch-deep-learning",
  },
];
