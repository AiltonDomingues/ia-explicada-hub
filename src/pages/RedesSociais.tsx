import { motion } from "framer-motion";
import { Youtube, Linkedin, Instagram, Twitter, ExternalLink, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";

const socialPlatforms = [
  { name: "YouTube", desc: "Tutoriais em vídeo, explicações detalhadas e lives sobre IA", icon: Youtube, bgColor: "bg-red-500", label: "Seguir no YouTube" },
  { name: "LinkedIn", desc: "Insights profissionais, tendências do mercado e networking", icon: Linkedin, bgColor: "bg-blue-600", label: "Seguir no LinkedIn" },
  { name: "Instagram", desc: "Conteúdo visual, infográficos e stories sobre IA", icon: Instagram, bgColor: "bg-pink-500", label: "Seguir no Instagram" },
  { name: "Twitter/X", desc: "Notícias rápidas, discussões e threads educativas", icon: Twitter, bgColor: "bg-sky-500", label: "Seguir no Twitter/X" },
  { name: "TikTok", desc: "Vídeos curtos, trends e conteúdo viral sobre IA", icon: Youtube, bgColor: "bg-foreground", label: "Seguir no TikTok" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const RedesSociaisPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm">
        <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <Home className="w-3.5 h-3.5" /> Voltar ao Início
        </Link>
      </div>

      <PageHeader
        title="Nossas"
        highlight="Redes Sociais"
        subtitle="Conecte-se conosco nas principais plataformas e faça parte da nossa comunidade de aprendizado em Inteligência Artificial"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {socialPlatforms.map((p) => (
            <motion.div
              key={p.name}
              variants={itemVariants}
              className="card-base rounded-2xl bg-card p-8 text-center"
            >
              <div className={`w-16 h-16 ${p.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                <p.icon className="w-8 h-8 text-card" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{p.desc}</p>
              <button className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-card text-sm font-medium hover:bg-primary/90 transition-colors">
                <ExternalLink className="w-4 h-4" /> {p.label}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Dica Especial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 max-w-2xl mx-auto card-base rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center"
        >
          <p className="text-lg font-semibold mb-2">💡 Dica Especial</p>
          <p className="text-sm text-muted-foreground">
            Siga todas as nossas redes para não perder nenhum conteúdo exclusivo e participar da maior comunidade de IA do Brasil!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RedesSociaisPage;
