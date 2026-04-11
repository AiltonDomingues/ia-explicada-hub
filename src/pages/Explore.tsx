import { Brain, Map as MapIcon, Compass, Target, Lightbulb, Route, Briefcase, Code, Shield, FlaskConical, Network, Database, Bot, BarChart3, TrendingUp, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import RoadmapCard from "@/components/RoadmapCard";
import AIWheelDiagram from "@/components/AIWheelDiagram";
import { usePageTitle } from "@/hooks/usePageTitle";
import { roadmaps } from "@/data/roadmaps";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Dados das carreiras em IA
const aiCareers = [
  {
    id: "ml-engineer",
    title: "Engenheiro(a) de IA/ML",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    description: "Desenvolve e implementa modelos de machine learning e deep learning para resolver problemas complexos.",
    responsibilities: [
      "Criar e treinar modelos de ML/DL usando frameworks como TensorFlow e PyTorch",
      "Otimizar algoritmos para melhorar performance e acurácia",
      "Implementar pipelines de dados e automação de treinamento",
      "Integrar modelos em aplicações de produção",
      "Realizar feature engineering e seleção de dados"
    ],
    skills: ["Python", "TensorFlow/PyTorch", "Scikit-learn", "MLOps", "Cloud (AWS/GCP/Azure)", "Docker/Kubernetes"]
  },
  {
    id: "ethics-specialist",
    title: "Especialista em Ética de IA",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
    description: "Garante que sistemas de IA sejam desenvolvidos e utilizados de forma ética, justa e responsável.",
    responsibilities: [
      "Avaliar vieses e impactos éticos de modelos de IA",
      "Desenvolver frameworks de governança para IA",
      "Garantir conformidade com regulamentações (LGPD, GDPR)",
      "Conduzir auditorias de fairness e transparência",
      "Educar equipes sobre práticas éticas em IA"
    ],
    skills: ["Ética em IA", "Legislação e Compliance", "Auditoria de Modelos", "Filosofia", "Comunicação", "Análise de Risco"]
  },
  {
    id: "research-scientist",
    title: "Cientista de Pesquisa em IA",
    icon: FlaskConical,
    color: "from-green-500 to-emerald-500",
    description: "Conduz pesquisas de ponta para avançar o estado da arte em inteligência artificial.",
    responsibilities: [
      "Publicar papers em conferências de top tier (NeurIPS, ICML, CVPR)",
      "Desenvolver novos algoritmos e arquiteturas de IA",
      "Conduzir experimentos e validar hipóteses científicas",
      "Colaborar com academia e indústria",
      "Orientar equipes técnicas em implementações"
    ],
    skills: ["PhD em IA/CS", "Matemática Avançada", "Estatística", "Publicações Científicas", "PyTorch/JAX", "Pesquisa Experimental"]
  },
  {
    id: "solutions-architect",
    title: "Arquiteto(a) de Soluções de IA",
    icon: Network,
    color: "from-orange-500 to-red-500",
    description: "Projeta arquiteturas escaláveis e eficientes para soluções de IA em nível empresarial.",
    responsibilities: [
      "Desenhar arquiteturas de IA end-to-end",
      "Selecionar tecnologias e ferramentas adequadas",
      "Garantir escalabilidade e confiabilidade dos sistemas",
      "Integrar IA com infraestrutura existente",
      "Estimar custos e ROI de projetos de IA"
    ],
    skills: ["Arquitetura de Software", "Cloud Architecture", "MLOps", "Microservices", "APIs", "DevOps"]
  },
  {
    id: "nlp-engineer",
    title: "Engenheiro(a) de NLP",
    icon: Briefcase,
    color: "from-indigo-500 to-blue-500",
    description: "Especialista em processamento de linguagem natural, desenvolvendo sistemas que entendem e geram texto.",
    responsibilities: [
      "Desenvolver chatbots e assistentes virtuais",
      "Implementar modelos de NLP (BERT, GPT, T5)",
      "Criar sistemas de análise de sentimento e classificação de texto",
      "Fine-tuning de LLMs para casos de uso específicos",
      "Trabalhar com embeddings e técnicas de retrieval"
    ],
    skills: ["Transformers", "Hugging Face", "spaCy/NLTK", "LangChain", "Vector Databases", "Prompt Engineering"]
  },
  {
    id: "big-data-engineer",
    title: "Engenheiro(a) de Big Data",
    icon: Database,
    color: "from-yellow-500 to-orange-500",
    description: "Constrói e mantém infraestruturas de dados em larga escala para alimentar sistemas de IA.",
    responsibilities: [
      "Desenvolver pipelines de ETL/ELT em escala massiva",
      "Gerenciar data lakes e data warehouses",
      "Otimizar queries e processamento distribuído",
      "Implementar streaming de dados em tempo real",
      "Garantir qualidade e governança de dados"
    ],
    skills: ["Spark", "Hadoop", "Kafka", "Airflow", "SQL/NoSQL", "Data Modeling", "Python/Scala"]
  },
  {
    id: "robotics-engineer",
    title: "Engenheiro(a) de Robótica",
    icon: Bot,
    color: "from-cyan-500 to-teal-500",
    description: "Integra IA com robótica para criar sistemas autônomos e inteligentes.",
    responsibilities: [
      "Desenvolver algoritmos de visão computacional para robôs",
      "Implementar sistemas de navegação autônoma",
      "Integrar sensores e atuadores com modelos de IA",
      "Programar controle e planejamento de movimento",
      "Trabalhar com simuladores (Gazebo, ROS)"
    ],
    skills: ["ROS/ROS2", "Computer Vision", "SLAM", "C++/Python", "Controle de Sistemas", "IoT"]
  },
  {
    id: "data-analyst",
    title: "Analista de Dados de IA",
    icon: BarChart3,
    color: "from-pink-500 to-rose-500",
    description: "Analisa dados usando IA para gerar insights e suportar tomada de decisão.",
    responsibilities: [
      "Explorar e visualizar grandes volumes de dados",
      "Aplicar modelos de ML para análise preditiva",
      "Criar dashboards e relatórios automatizados",
      "Identificar padrões e anomalias nos dados",
      "Comunicar insights para stakeholders não-técnicos"
    ],
    skills: ["Python/R", "SQL", "Power BI/Tableau", "Pandas/NumPy", "Estatística", "Data Visualization"]
  },
  {
    id: "data-scientist",
    title: "Cientista de Dados",
    icon: TrendingUp,
    color: "from-violet-500 to-purple-500",
    description: "Extrai conhecimento de dados usando estatística, ML e domain expertise.",
    responsibilities: [
      "Formular e testar hipóteses usando dados",
      "Construir modelos preditivos e prescritivos",
      "Realizar análises exploratórias e feature engineering",
      "Desenvolver experimentos A/B testing",
      "Colaborar com produto e negócio para definir métricas"
    ],
    skills: ["Python/R", "Scikit-learn", "Estatística", "SQL", "Storytelling com Dados", "Domain Knowledge"]
  },
  {
    id: "product-manager",
    title: "Gerente de Produto de IA",
    icon: Package,
    color: "from-red-500 to-orange-500",
    description: "Lidera o desenvolvimento de produtos baseados em IA, conectando tecnologia e negócio.",
    responsibilities: [
      "Definir roadmap e estratégia de produtos de IA",
      "Priorizar features com base em impacto e viabilidade",
      "Trabalhar com engenheiros para definir requisitos técnicos",
      "Analisar métricas e KPIs de produto",
      "Comunicar valor de IA para usuários e stakeholders"
    ],
    skills: ["Product Management", "Conhecimento de ML/IA", "Analytics", "UX/UI", "Comunicação", "Gestão de Stakeholders"]
  }
];

const Explore = () => {
  usePageTitle("Explore");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient-bg pt-20 pb-16 text-center border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Compass className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Descubra seu <span className="text-primary">Caminho em IA</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Não sabe por onde começar? Quer entender que área de IA combina com você? 
              Está perdido entre tantas opções de carreira?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <Lightbulb className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Entenda Carreiras</h3>
                <p className="text-sm text-muted-foreground">
                  Conheça as diferentes profissões e frentes de atuação
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Encontre sua Área</h3>
                <p className="text-sm text-muted-foreground">
                  Explore as diferentes disciplinas de IA e descubra qual mais te atrai
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <Route className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Trace seu Roteiro</h3>
                <p className="text-sm text-muted-foreground">
                  Siga roadmaps estruturados do iniciante ao avançado
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Carreiras em IA */}
      <div className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">
                Top 10 <span className="text-primary">Carreiras em IA</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça as profissões mais demandadas em Inteligência Artificial. 
              Clique em cada cargo para entender responsabilidades e habilidades necessárias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {aiCareers.map((career, index) => {
              const IconComponent = career.icon;
              return (
                <Dialog key={career.id}>
                  <DialogTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${career.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                        
                        <div className="relative z-10">
                          <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${career.color} p-3 mb-4 mx-auto`}>
                            <IconComponent className="w-full h-full text-white" />
                          </div>
                          
                          <h3 className="font-semibold text-center text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {career.title}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${career.color} p-3 flex-shrink-0`}>
                          <IconComponent className="w-full h-full text-white" />
                        </div>
                        <div>
                          <DialogTitle className="text-2xl">{career.title}</DialogTitle>
                        </div>
                      </div>
                      <DialogDescription className="text-base pt-2">
                        {career.description}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 mt-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Responsabilidades Principais
                        </h4>
                        <ul className="space-y-2">
                          {career.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Code className="w-5 h-5 text-primary" />
                          Habilidades Essenciais
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seção de Áreas da IA */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">
                Áreas da <span className="text-primary">Inteligência Artificial</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra as diferentes disciplinas e especializações dentro da Inteligência Artificial.
              Cada área tem suas próprias técnicas, aplicações e conceitos fundamentais.
            </p>
          </div>

          <AIWheelDiagram />
        </div>
      </div>

      {/* Seção de Roadmaps */}
      <div id="roadmaps" className="bg-muted/30 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapIcon className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">
                Roadmaps de <span className="text-primary">Aprendizado</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Guias estruturados para sua jornada em IA. Siga o caminho do iniciante ao avançado em cada área
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {roadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Explore;
