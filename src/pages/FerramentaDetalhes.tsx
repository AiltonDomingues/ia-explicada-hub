import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Star,
  Home,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Share2,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useState } from "react";
import { motion } from "framer-motion";

const FerramentaDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: ferramenta, isLoading } = useQuery({
    queryKey: ["ferramenta", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ferramentas")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  usePageTitle(ferramenta?.nome || "Ferramenta");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen hero-gradient-bg">
          <div className="container mx-auto px-4 py-24 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-muted-foreground text-sm">Carregando ferramenta...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!ferramenta) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen hero-gradient-bg">
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-2xl font-bold mb-4">Ferramenta não encontrada</h1>
            <Link to="/ferramentas">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Ferramentas
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Faixa hero no topo — cobre breadcrumb + header do card */}
      <div className="hero-gradient-bg pt-8 pb-52 relative z-0">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link to="/ferramentas" className="hover:text-foreground transition-colors">
              Ferramentas
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {ferramenta.nome}
            </span>
          </nav>
        </div>
      </div>

      {/* Conteúdo principal — bg normal, card sobe sobre o hero */}
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl -mt-44 pb-12">

          {/* Card Principal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg relative z-10"
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-5 border-b border-border">
              <div className="flex items-start gap-5">

                {/* Logo */}
                <div className="flex-shrink-0">
                  {ferramenta.logo && !imageError ? (
                    <img
                      src={ferramenta.logo}
                      alt={ferramenta.nome}
                      className="w-14 h-14 rounded-xl object-contain border border-border bg-white p-1.5 shadow-sm"
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                      <span className="text-2xl font-black text-primary">
                        {ferramenta.nome.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info central */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-black tracking-tight">{ferramenta.nome}</h1>
                    {ferramenta.verificada && (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                    {ferramenta.destaque && (
                      <Badge className="bg-amber-500/90 text-white border-0 text-xs">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {ferramenta.ranking && (
                      <span className="font-mono-meta text-sm font-semibold text-primary">
                        #{ferramenta.ranking}
                      </span>
                    )}
                    <span className="text-muted-foreground text-sm">em</span>
                    <Link
                      to={`/ferramentas?categoria=${encodeURIComponent(ferramenta.categoria)}`}
                      className="text-sm font-medium text-primary hover:underline underline-offset-2"
                    >
                      {ferramenta.categoria}
                    </Link>
                    {ferramenta.verificada && (
                      <div className="flex items-center gap-0.5 ml-1">
                        {[1, 2, 3, 4].map((i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                        <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Acoes */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-muted-foreground hover:text-foreground"
                    title="Copiar link"
                  >
                    <Share2 className="w-4 h-4" />
                    {copied && <span className="ml-1.5 text-xs">Copiado!</span>}
                  </Button>
                  <a
                    href={ferramenta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-primary hover:bg-primary/90 font-semibold tracking-wide">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      VISITAR SITE
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Linha separadora gradiente */}
            <div className="h-px w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

            {/* Corpo do Card - 2 colunas */}
            <div className="grid lg:grid-cols-[3fr,2fr] bg-card">

              {/* Coluna Esquerda - Preview */}
              <div className="border-r border-border bg-muted/20 p-6">
                {ferramenta.preview_image_url ? (
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border shadow-lg bg-muted/30">
                    <img
                      src={ferramenta.preview_image_url}
                      alt={`Preview de ${ferramenta.nome}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                      <a href={ferramenta.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Visitar Site
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[16/9] rounded-lg border border-border shadow-lg flex flex-col items-center justify-center gap-4 p-8 text-center bg-muted/30">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Preview não disponível</p>
                      <p className="text-sm text-muted-foreground">
                        Nenhuma imagem de preview foi cadastrada para esta ferramenta.
                      </p>
                    </div>
                    <a href={ferramenta.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visitar Site
                      </Button>
                    </a>
                  </div>
                )}
              </div>

              {/* Coluna Direita - Info */}
              <div className="p-6 flex flex-col gap-6 bg-muted/10">

                {/* Descrição */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Descrição
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ferramenta.descricao}
                  </p>
                </div>

                {/* Badges de status */}
                <div className="flex flex-col gap-2">
                  {ferramenta.verificada && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-medium text-primary">Ferramenta Verificada</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-muted-foreground">
                      {ferramenta.categoria}
                    </Badge>
                  </div>
                </div>

                {/* Link oficial */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Link Oficial
                  </p>
                  <a
                    href={ferramenta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4 font-medium"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{ferramenta.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                  </a>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Botão voltar */}
          <div className="mt-6">
            <Link to="/ferramentas">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Ferramentas
              </Button>
            </Link>
          </div>

        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </>
  );
};

export default FerramentaDetalhes;
