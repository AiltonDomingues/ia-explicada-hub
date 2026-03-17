export interface Material {
  id: number;
  tipo: string;
  categoria: string;
  titulo: string;
  descricao: string;
  tamanho: string;
}

export const materiais: Material[] = [
  {
    id: 1,
    tipo: "PDF",
    categoria: "Teoria",
    titulo: "Guia Completo de Redes Neurais",
    descricao: "Documento abrangente sobre arquiteturas, treinamento e implementação de redes neurais artificiais com exemplos práticos.",
    tamanho: "2.3 MB",
  },
  {
    id: 2,
    tipo: "Vídeo",
    categoria: "Prática",
    titulo: "Tutorial: Criando Chatbots com LangChain",
    descricao: "Vídeo-aula completa mostrando como desenvolver chatbots inteligentes passo a passo usando LangChain e Python.",
    tamanho: "45 min",
  },
  {
    id: 3,
    tipo: "Código",
    categoria: "Código",
    titulo: "Código: Classificador de Imagens",
    descricao: "Implementação completa de um classificador de imagens usando PyTorch com código totalmente comentado e datasets de exemplo.",
    tamanho: "512 KB",
  },
  {
    id: 4,
    tipo: "E-book",
    categoria: "Aplicações",
    titulo: "E-book: IA na Medicina",
    descricao: "Livro digital explorando aplicações práticas de IA no diagnóstico médico, tratamento personalizado e pesquisa farmacológica.",
    tamanho: "15.7 MB",
  },
  {
    id: 5,
    tipo: "Dataset",
    categoria: "Dados",
    titulo: "Dataset: Análise de Sentimentos",
    descricao: "Conjunto de dados pré-processado para treinamento de modelos de análise de sentimentos em português.",
    tamanho: "125 MB",
  },
  {
    id: 6,
    tipo: "PDF",
    categoria: "Referência",
    titulo: "Cheat Sheet: Algoritmos de ML",
    descricao: "Guia de referência rápida com os principais algoritmos de machine learning, quando usar e como implementar.",
    tamanho: "856 KB",
  },
  {
    id: 7,
    tipo: "Código",
    categoria: "Template",
    titulo: "Template: API REST para IA",
    descricao: "Template completo para criar APIs REST que servem modelos de IA usando FastAPI e Docker.",
    tamanho: "1.2 MB",
  },
  {
    id: 8,
    tipo: "Vídeo",
    categoria: "Tendências",
    titulo: "Webinar: Tendências em IA 2024",
    descricao: "Gravação completa do webinar sobre as principais tendências e inovações em inteligência artificial para 2024.",
    tamanho: "1h 30min",
  },
];
