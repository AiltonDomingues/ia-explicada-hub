import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoticiaCard from "@/components/NoticiaCard";
import ArtigoCard from "@/components/ArtigoCard";
import CursoCard from "@/components/CursoCard";
import MaterialCard from "@/components/MaterialCard";
import { cursos as cursosHardcoded } from "@/data/cursos";
import { materiais as materiaisHardcoded } from "@/data/materiais";
import { Youtube, Linkedin, Instagram, Twitter } from "lucide-react";
import { useNoticias, useArtigos, useCursos, useMateriais } from "@/hooks/useSupabase";

import { containerVariants, itemVariants } from "@/lib/animations";

const socialPlatforms = [
  { name: "YouTube", desc: "Tutoriais em vídeo, explicações detalhadas e lives sobre IA", icon: Youtube, color: "bg-red-500" },
  { name: "LinkedIn", desc: "Insights profissionais, tendências do mercado e networking", icon: Linkedin, color: "bg-blue-600" },
  { name: "Instagram", desc: "Conteúdo visual, infográficos e stories sobre IA", icon: Instagram, color: "bg-pink-500" },
  { name: "Twitter/X", desc: "Notícias rápidas, discussões e threads educativas", icon: Twitter, color: "bg-sky-500" },
];

const SectionHeader = ({ title, highlight, subtitle, linkTo, linkLabel }: {
  title: string; highlight: string; subtitle: string; linkTo?: string; linkLabel?: string;
}) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl sm:text-4xl">
      {title} <span className="text-primary">{highlight}</span>
    </h2>
    <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
    {linkTo && (
      <Link to={linkTo} className="inline-flex items-center gap-1 mt-4 text-primary text-sm font-medium hover:underline">
        {linkLabel} <ArrowRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

const Index = () => {
  // Fetch data from Supabase
  const { data: noticiasData = [] } = useNoticias();
  const { data: artigosData = [] } = useArtigos();
  const { data: cursosData } = useCursos();
  const { data: materiaisData } = useMateriais();

  // Use Supabase data (notícias e artigos são populados pelos workflows)
  const noticias = noticiasData;
  const artigos = artigosData;
  // Cursos e materiais ainda usam fallback hardcoded
  const cursos = cursosData && cursosData.length > 0 ? cursosData : cursosHardcoded;
  const materiais = materiaisData && materiaisData.length > 0 ? materiaisData : materiaisHardcoded;

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
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra as últimas novidades, aprenda com cursos especializados e acesse materiais didáticos de qualidade sobre IA.
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

      {/* Notícias */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Últimas"
            highlight="Notícias"
            subtitle="Fique por dentro das novidades mais importantes do mundo da Inteligência Artificial"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {noticias.map((n) => (
              <motion.div key={n.id} variants={itemVariants}>
                <NoticiaCard noticia={n} />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link to="/noticias" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              Ver Todas as Notícias <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Artigos */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Artigos"
            highlight="Especializados"
            subtitle="Mergulhe em análises aprofundadas e pesquisas acadêmicas sobre inteligência artificial"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {artigos.map((a) => (
              <motion.div key={a.id} variants={itemVariants}>
                <ArtigoCard artigo={a} />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link to="/artigos" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              Ver Todos os Artigos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cursos */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Cursos de"
            highlight="IA"
            subtitle="Desenvolva suas habilidades com cursos estruturados e ministrados por especialistas"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {cursos.map((c) => (
              <motion.div key={c.id} variants={itemVariants}>
                <CursoCard curso={c} />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link to="/cursos" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              Ver Todos os Cursos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Materiais */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Materiais"
            highlight="Didáticos"
            subtitle="Recursos gratuitos para aprender, praticar e aprofundar seus conhecimentos em IA"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {materiais.slice(0, 6).map((m) => (
              <motion.div key={m.id} variants={itemVariants}>
                <MaterialCard material={m} />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link to="/materiais" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              Ver Todos os Materiais <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Redes"
            highlight="Sociais"
            subtitle="Conecte-se conosco em todas as plataformas e faça parte da maior comunidade de IA do Brasil"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialPlatforms.map((p) => (
              <div key={p.name} className="card-base rounded-2xl bg-card p-6 text-center">
                <div className={`w-14 h-14 ${p.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <p.icon className="w-7 h-7 text-card" />
                </div>
                <h3 className="font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                <button className="w-full py-2 rounded-lg bg-primary text-card text-sm font-medium hover:bg-primary/90 transition-colors">
                  Seguir
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
