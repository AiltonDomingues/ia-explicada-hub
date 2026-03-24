import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Calendar, TrendingUp, Map, BookOpen, Rocket, User, Briefcase, Zap, Target, GraduationCap, FolderKanban, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNoticias, useEventos } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getCategoryColor } from "@/lib/utils";

const Index = () => {
  usePageTitle("IA Explicada Hub");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // Fetch data from Supabase
  const { data: noticiasData = [] } = useNoticias();
  const { data: eventosData = [] } = useEventos();
  
  // Dados para a seção de atividades
  const noticiasRecentes = noticiasData.slice(0, 3);
  const proximosEventos = eventosData
    .filter((e: any) => new Date(e.data) >= new Date())
    .sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient-bg pt-1 pb-2 sm:pt-2 sm:pb-4 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex justify-center -mb-6">
              <img src="/logo.png" alt="iA Explicada" className="h-64 sm:h-80 w-auto" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Seu <span className="text-primary">HUB</span> completo sobre{" "}
              <span className="text-primary">Inteligência Artificial</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Do conceito à prática, com curadoria inteligente pra você não perder tempo.
            </p>
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-primary text-card font-medium text-sm hover:bg-primary/90 transition-colors active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Explorar Conteúdo <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Audience Selection */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Qual é o seu <span className="text-primary">objetivo</span> com IA?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Escolha seu perfil e descubra o caminho ideal
            </p>
          </motion.div>

          {/* Main Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Iniciante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="h-full"
            >
              <Card 
                className={`h-full cursor-pointer transition-all duration-300 ${
                  expandedCard === 'beginner' 
                    ? 'ring-2 ring-primary shadow-2xl scale-[1.03]' 
                    : 'shadow-md hover:shadow-lg hover:scale-[1.01]'
                }`}
                onClick={() => setExpandedCard(expandedCard === 'beginner' ? null : 'beginner')}
              >
                <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center transition-all duration-300 ${
                      expandedCard === 'beginner' ? 'bg-emerald-500/20 scale-110' : ''
                    }`}>
                      <User className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Quero Entender IA</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece do zero. Aprenda os fundamentos sem se perder em termos técnicos complexos.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 text-primary font-medium">
                      {expandedCard === 'beginner' ? 'Ver menos' : 'Começar a Aprender'}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        expandedCard === 'beginner' ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2: Carreira */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="h-full"
            >
              <Card 
                className={`h-full cursor-pointer transition-all duration-300 ${
                  expandedCard === 'career' 
                    ? 'ring-2 ring-primary shadow-2xl scale-[1.03]' 
                    : 'shadow-md hover:shadow-lg hover:scale-[1.01]'
                }`}
                onClick={() => setExpandedCard(expandedCard === 'career' ? null : 'career')}
              >
                <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center transition-all duration-300 ${
                      expandedCard === 'career' ? 'bg-blue-500/20 scale-110' : ''
                    }`}>
                      <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Quero Trabalhar com IA</h3>
                    <p className="text-muted-foreground mb-4">
                      Siga um caminho estruturado para desenvolver habilidades que o mercado procura.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 text-primary font-medium">
                      {expandedCard === 'career' ? 'Ver menos' : 'Ver Roadmaps'}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        expandedCard === 'career' ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3: Profissional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="h-full"
            >
              <Card 
                className={`h-full cursor-pointer transition-all duration-300 ${
                  expandedCard === 'professional' 
                    ? 'ring-2 ring-primary shadow-2xl scale-[1.03]' 
                    : 'shadow-md hover:shadow-lg hover:scale-[1.01]'
                }`}
                onClick={() => setExpandedCard(expandedCard === 'professional' ? null : 'professional')}
              >
                <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center transition-all duration-300 ${
                      expandedCard === 'professional' ? 'bg-amber-500/20 scale-110' : ''
                    }`}>
                      <Zap className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Quero Usar IA Agora</h3>
                    <p className="text-muted-foreground mb-4">
                      Ferramentas práticas e guias diretos para aplicar IA nos seus projetos hoje.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 text-primary font-medium">
                      {expandedCard === 'professional' ? 'Ver menos' : 'Explorar Ferramentas'}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        expandedCard === 'professional' ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Expanded Subcards */}
          <AnimatePresence mode="wait">
            {expandedCard === 'beginner' && (
              <motion.div
                key="beginner-sub"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-3 gap-6"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Map className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Planeje sua Jornada</h4>
                      <p className="text-sm text-muted-foreground">
                        Roadmaps estruturados para aprender no caminho certo
                      </p>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Aprenda do Zero</h4>
                      <p className="text-sm text-muted-foreground">
                        Conceitos fundamentais explicados de forma clara
                      </p>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Pratique e Evolua</h4>
                      <p className="text-sm text-muted-foreground">
                        Materiais práticos para consolidar o aprendizado
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            )}

            {expandedCard === 'career' && (
              <motion.div
                key="career-sub"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-3 gap-6"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Especializações</h4>
                      <p className="text-sm text-muted-foreground">
                        ML, NLP, Visão Computacional: escolha sua área
                      </p>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Cursos Profissionalizantes</h4>
                      <p className="text-sm text-muted-foreground">
                        Certificações e cursos reconhecidos pelo mercado
                      </p>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderKanban className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Projetos no Portfólio</h4>
                      <p className="text-sm text-muted-foreground">
                        Projetos práticos para impressionar recrutadores
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            )}

            {expandedCard === 'professional' && (
              <motion.div
                key="professional-sub"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-3 gap-6"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Ferramentas Práticas</h4>
                      <p className="text-sm text-muted-foreground">
                        APIs, plataformas e SDKs para usar hoje
                      </p>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Casos de Uso</h4>
                      <p className="text-sm text-muted-foreground">
                        Exemplos reais de aplicação por indústria
                      </p>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <Link to="#">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold mb-2">Tutoriais Rápidos</h4>
                      <p className="text-sm text-muted-foreground">
                        Guias diretos para integrar IA no seu projeto
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Activity Dashboard */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              O que há de <span className="text-primary">novo</span> no Hub
            </motion.h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Acompanhe as últimas atualizações, eventos e conteúdos adicionados
            </p>
          </div>

          {/* Activity Feed */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Notícias Recentes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Notícias Recentes</h3>
              </div>
              <div className="space-y-4">
                {noticiasRecentes.map((noticia: any) => {
                  const categoryColors = getCategoryColor(noticia.categoria);
                  return (
                    <Card key={noticia.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {noticia.imagem_url && (
                            <img 
                              src={noticia.imagem_url} 
                              alt={noticia.titulo}
                              className="w-20 h-20 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            {noticia.categoria && (
                              <span className={`text-xs px-2 py-0.5 rounded-md ${categoryColors.bg} ${categoryColors.text} font-medium inline-block mb-2`}>
                                {noticia.categoria}
                              </span>
                            )}
                            <h4 className="font-semibold text-sm line-clamp-2 mb-1">{noticia.titulo}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(noticia.data).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                <Link 
                  to="/noticias" 
                  className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  Ver todas as notícias <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            {/* Próximos Eventos */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Próximos Eventos</h3>
              </div>
              <div className="space-y-4">
                {proximosEventos.length > 0 ? (
                  <>
                    {proximosEventos.map((evento: any) => {
                      const diasRestantes = Math.ceil(
                        (new Date(evento.data).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <Card key={evento.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">{evento.titulo}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(evento.data).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <Badge variant="secondary" className="whitespace-nowrap">
                                {diasRestantes === 0 ? 'Hoje' : diasRestantes === 1 ? 'Amanhã' : `em ${diasRestantes}d`}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    <Link 
                      to="/eventos" 
                      className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                    >
                      Ver todos os eventos <ArrowRight className="w-3 h-3" />
                    </Link>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Nenhum evento programado no momento
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
