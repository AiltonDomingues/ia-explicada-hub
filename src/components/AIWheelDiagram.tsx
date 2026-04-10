import { useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface AISegment {
  id: string;
  name: string;
  description: string;
  examples: string[];
  color: string;
  startAngle: number;
  endAngle: number;
}

// 22 segmentos principais com cores gradientes variadas e aplicações práticas
const allSegments: AISegment[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'Simulação de processos de inteligência humana por máquinas, permitindo que sistemas aprendam, raciocinem e se adaptem',
    examples: [
      'Assistentes virtuais como Alexa, Google Assistant e Cortana',
      'Chatbots para atendimento ao cliente automatizado',
      'Sistemas de recomendação em e-commerce e streaming'
    ],
    color: '#8b5cf6',
    startAngle: 0,
    endAngle: 16.36
  },
  {
    id: 'bigdata',
    name: 'Big Data',
    description: 'Processamento e análise de grandes volumes de dados (estruturados e não estruturados) para extrair insights valiosos',
    examples: [
      'Análise preditiva para prever tendências de mercado',
      'Monitoramento em tempo real de redes sociais',
      'Data lakes para armazenar e processar petabytes de informação'
    ],
    color: '#3b82f6',
    startAngle: 16.36,
    endAngle: 32.72
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    description: 'Algoritmos que aprendem padrões a partir de dados sem programação explícita, melhorando com a experiência',
    examples: [
      'Detecção de fraudes bancárias e transações suspeitas',
      'Mecanismos de recomendação (Netflix, Spotify, Amazon)',
      'Classificação automática de e-mails (spam/não-spam)'
    ],
    color: '#06b6d4',
    startAngle: 32.72,
    endAngle: 49.08
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    description: 'Redes neurais profundas com múltiplas camadas que aprendem representações complexas de dados',
    examples: [
      'Reconhecimento facial em redes sociais e segurança',
      'Veículos autônomos e sistemas de piloto automático',
      'Tradução em tempo real e pesquisa por voz'
    ],
    color: '#10b981',
    startAngle: 49.08,
    endAngle: 65.44
  },
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    description: 'Permite que máquinas entendam, interpretem e gerem linguagem humana natural',
    examples: [
      'Chatbots inteligentes para atendimento 24/7',
      'Análise de sentimento em mídias sociais',
      'Sugestões de respostas automáticas em e-mails',
      'Filtros de spam e verificação de plágio'
    ],
    color: '#22c55e',
    startAngle: 65.44,
    endAngle: 81.8
  },
  {
    id: 'cv',
    name: 'Computer Vision',
    description: 'Capacita máquinas a interpretar e entender informações visuais do mundo real',
    examples: [
      'Reconhecimento facial para autenticação e segurança',
      'Inspeção automatizada de qualidade em manufatura',
      'Diagnóstico médico por análise de imagens (raios-X, tomografias)',
      'Tecnologia de realidade aumentada e filtros'
    ],
    color: '#84cc16',
    startAngle: 81.8,
    endAngle: 98.16
  },
  {
    id: 'rl',
    name: 'Reinforcement Learning',
    description: 'Aprende comportamentos ótimos através de tentativa e erro, recebendo recompensas ou penalidades',
    examples: [
      'Robótica avançada e automação industrial',
      'Game playing (AlphaGo, xadrez computacional)',
      'Otimização de rotas e logística'
    ],
    color: '#eab308',
    startAngle: 98.16,
    endAngle: 114.52
  },
  {
    id: 'sl',
    name: 'Supervised Learning',
    description: 'Aprendizado com dados rotulados, onde o algoritmo aprende a mapear entradas para saídas conhecidas',
    examples: [
      'Diagnóstico médico baseado em histórico de pacientes',
      'Previsão de preços de imóveis e ações',
      'Classificação de documentos e categorização'
    ],
    color: '#f59e0b',
    startAngle: 114.52,
    endAngle: 130.88
  },
  {
    id: 'ul',
    name: 'Unsupervised Learning',
    description: 'Descobre padrões ocultos em dados não rotulados, identificando estruturas e relações',
    examples: [
      'Segmentação de clientes para marketing direcionado',
      'Detecção de anomalias e comportamentos suspeitos',
      'Agrupamento de produtos similares em e-commerce'
    ],
    color: '#f97316',
    startAngle: 130.88,
    endAngle: 147.24
  },
  {
    id: 'ssl',
    name: 'Semi-Supervised',
    description: 'Combina pequena quantidade de dados rotulados com grande volume de dados não rotulados',
    examples: [
      'Classificação de imagens em larga escala',
      'Reconhecimento de fala com poucos exemplos',
      'Moderação de conteúdo em redes sociais'
    ],
    color: '#ef4444',
    startAngle: 147.24,
    endAngle: 163.6
  },
  {
    id: 'tl',
    name: 'Transfer Learning',
    description: 'Reutiliza conhecimento de modelos pré-treinados para resolver novos problemas relacionados',
    examples: [
      'Adaptar modelos de linguagem (BERT, GPT) para domínios específicos',
      'Fine-tuning de redes neurais para novas tarefas',
      'Análise de documentos legais usando NLP pré-treinado'
    ],
    color: '#ec4899',
    startAngle: 163.6,
    endAngle: 179.96
  },
  {
    id: 'gan',
    name: 'GANs',
    description: 'Redes Generativas Adversariais que criam dados realistas através de competição entre geradores e discriminadores',
    examples: [
      'Criação de imagens fotorrealistas e arte digital',
      'Geração de vídeos deepfake e avatares 3D',
      'Aumento de dados para treinamento de modelos'
    ],
    color: '#d946ef',
    startAngle: 179.96,
    endAngle: 196.32
  },
  {
    id: 'algo',
    name: 'Algorithms',
    description: 'Conjunto de instruções matemáticas e lógicas que definem como resolver problemas computacionais',
    examples: [
      'Algoritmos de busca (Google, Bing)',
      'Árvores de decisão, SVM, Random Forest',
      'Otimização de rotas e scheduling'
    ],
    color: '#a855f7',
    startAngle: 196.32,
    endAngle: 212.68
  },
  {
    id: 'ethics',
    name: 'AI Ethics',
    description: 'Princípios éticos e práticas responsáveis no desenvolvimento e uso de sistemas de IA',
    examples: [
      'Detecção e mitigação de viés algorítmico',
      'Frameworks de IA explicável e transparente',
      'Privacidade de dados e LGPD/GDPR compliance'
    ],
    color: '#8b5cf6',
    startAngle: 212.68,
    endAngle: 229.04
  },
  {
    id: 'edge',
    name: 'Edge AI',
    description: 'Execução de modelos de IA localmente em dispositivos (edge), sem depender da nuvem',
    examples: [
      'Reconhecimento de voz em tempo real em smartphones',
      'IoT inteligente para casas e indústrias',
      'Câmeras de segurança com análise local'
    ],
    color: '#6366f1',
    startAngle: 229.04,
    endAngle: 245.4
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    description: 'Infraestrutura escalável na nuvem para hospedar, processar e servir modelos de IA',
    examples: [
      'AWS SageMaker, Azure ML, Google Cloud AI',
      'Treinamento distribuído de modelos complexos',
      'APIs de IA como serviço (MLaaS)'
    ],
    color: '#3b82f6',
    startAngle: 245.4,
    endAngle: 261.76
  },
  {
    id: 'predictive',
    name: 'Predictive Analytics',
    description: 'Análise preditiva para antecipar eventos futuros baseando-se em dados históricos',
    examples: [
      'Previsão de churn de clientes',
      'Manutenção preditiva de equipamentos industriais',
      'Credit scoring e análise de risco de crédito'
    ],
    color: '#0ea5e9',
    startAngle: 261.76,
    endAngle: 278.12
  },
  {
    id: 'analytics',
    name: 'Data Analytics',
    description: 'Análise exploratória e descritiva de dados para extrair insights e apoiar decisões',
    examples: [
      'Dashboards de business intelligence (BI)',
      'Análise de tendências de vendas e KPIs',
      'Relatórios automatizados de performance'
    ],
    color: '#06b6d4',
    startAngle: 278.12,
    endAngle: 294.48
  },
  {
    id: 'viz',
    name: 'Data Visualization',
    description: 'Representação visual de dados para facilitar compreensão e comunicação de insights',
    examples: [
      'Gráficos interativos e dashboards dinâmicos',
      'Heat maps e mapas geográficos',
      'Storytelling com dados para apresentações'
    ],
    color: '#14b8a6',
    startAngle: 294.48,
    endAngle: 310.84
  },
  {
    id: 'anomaly',
    name: 'Anomaly Detection',
    description: 'Identificação automática de padrões anormais ou comportamentos suspeitos em dados',
    examples: [
      'Detecção de fraudes em transações financeiras',
      'Alertas de segurança de rede e intrusões',
      'Monitoramento de saúde de sistemas críticos'
    ],
    color: '#10b981',
    startAngle: 310.84,
    endAngle: 327.2
  },
  {
    id: 'feature',
    name: 'Feature Engineering',
    description: 'Processo de criar, selecionar e transformar features para melhorar performance de modelos',
    examples: [
      'Normalização e padronização de dados',
      'Encoding de variáveis categóricas',
      'Seleção de variáveis relevantes para modelos'
    ],
    color: '#84cc16',
    startAngle: 327.2,
    endAngle: 343.56
  },
  {
    id: 'datamining',
    name: 'Data Mining',
    description: 'Extração automatizada de padrões e conhecimento útil de grandes conjuntos de dados',
    examples: [
      'Análise de cesta de compras (market basket analysis)',
      'Segmentação avançada de mercado',
      'Text mining para análise de documentos'
    ],
    color: '#a3e635',
    startAngle: 343.56,
    endAngle: 360
  }
];

const AIWheelDiagram = () => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeSegment = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
    const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
    const outerStart = polarToCartesian(x, y, outerRadius, endAngle);
    const outerEnd = polarToCartesian(x, y, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", outerStart.x, outerStart.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const getTextPosition = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    return polarToCartesian(centerX, centerY, radius, midAngle);
  };

  const centerX = 300;
  const centerY = 300;
  const centerRadius = 60;
  const innerRadius = 75;
  const outerRadius = 250;

  const hoveredSegmentData = allSegments.find(s => s.id === hoveredSegment);

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Coluna Esquerda - Roda */}
        <div className="flex justify-center items-center">
          <svg viewBox="0 0 600 600" className="w-full h-auto max-h-[550px]">
          {/* Centro com ícone de cérebro */}
          <g>
            <circle cx={centerX} cy={centerY} r={centerRadius} fill="#6d28d9" opacity="0.95" />
            <foreignObject x={centerX - 25} y={centerY - 25} width="50" height="50">
              <div className="flex items-center justify-center w-full h-full">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </foreignObject>
          </g>

          {/* 22 Segmentos */}
          {allSegments.map((segment) => {
            const isHovered = hoveredSegment === segment.id;
            const midAngle = (segment.startAngle + segment.endAngle) / 2;
            
            // Posiciona texto no centro da seção (meio do raio)
            const textRadius = (innerRadius + outerRadius) / 2;
            const textPos = getTextPosition(centerX, centerY, textRadius, segment.startAngle, segment.endAngle);
            
            // Rotação para alinhar com o raio, mantendo sempre legível
            // Metade superior (0-180°): texto do centro para fora
            // Metade inferior (180-360°): texto de fora para centro (para não ficar de cabeça para baixo)
            let rotation = midAngle - 90;
            
            if (midAngle > 180) {
              rotation = midAngle + 90;
            }
            
            return (
              <g key={segment.id}>
                <defs>
                  <linearGradient id={`gradient-${segment.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={segment.color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={segment.color} stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path
                  d={describeSegment(centerX, centerY, innerRadius, outerRadius, segment.startAngle, segment.endAngle)}
                  fill={`url(#gradient-${segment.id})`}
                  opacity={hoveredSegment && !isHovered ? 0.25 : 0.95}
                  stroke="white"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${rotation}, ${textPos.x}, ${textPos.y})`}
                  className="text-[11px] font-extrabold fill-white pointer-events-none"
                  style={{ 
                    stroke: '#000000',
                    strokeWidth: '0.5px',
                    paintOrder: 'stroke',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))'
                  }}
                >
                  {segment.name}
                </text>
              </g>
            );
          })}
        </svg>
        </div>

        {/* Coluna Direita - Painel de Informações */}
        <div className="flex items-center">
          <div className="w-full">
            {hoveredSegmentData ? (
              <motion.div
                key={hoveredSegmentData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl shadow-2xl border-2"
                style={{
                  background: `linear-gradient(135deg, ${hoveredSegmentData.color}15 0%, ${hoveredSegmentData.color}05 100%)`,
                  borderColor: hoveredSegmentData.color
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-5 h-5 rounded-full animate-pulse"
                    style={{ backgroundColor: hoveredSegmentData.color }}
                  />
                  <h2 className="text-3xl font-bold text-foreground">{hoveredSegmentData.name}</h2>
                </div>

                {/* Descrição */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    O que é?
                  </h3>
                  <p className="text-base text-foreground leading-relaxed">
                    {hoveredSegmentData.description}
                  </p>
                </div>

                {/* Aplicações Práticas */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Aplicações Práticas
                  </h3>
                  <div className="space-y-3">
                    {hoveredSegmentData.examples.map((example, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-background/50 backdrop-blur-sm"
                      >
                        <div 
                          className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: hoveredSegmentData.color }}
                        />
                        <p className="text-sm text-foreground leading-relaxed">{example}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Badge de Categoria */}
                <div className="mt-6 pt-6 border-t border-border">
                  <span 
                    className="inline-block px-4 py-2 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: hoveredSegmentData.color }}
                  >
                    {hoveredSegmentData.id.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="p-8 rounded-2xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center text-center h-[550px]">
                <Brain className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Explore as Áreas da IA
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Passe o mouse sobre cada segmento da roda para descobrir detalhes sobre as diferentes áreas da Inteligência Artificial e suas aplicações práticas no mundo real.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Passe o mouse sobre cada área para ver descrição completa e exemplos de aplicação prática
        </p>
      </div>
    </div>
  );
};

export default AIWheelDiagram;
