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
import type { Ferramenta } from "@/lib/supabase";

// Componente para card de alternativa
const AlternativaCard = ({ ferramenta }: { ferramenta: Ferramenta }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group flex flex-col h-full">
      {/* Card clicável - leva para página da ferramenta */}
      <Link
        to={`/ferramentas/${ferramenta.id}`}
        className="flex-1 flex flex-col p-6 hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent transition-colors"
      >
        {/* Header com logo e nome */}
        <div className="flex items-start gap-4 mb-4">
          {ferramenta.logo && !imageError ? (
            <img
              src={ferramenta.logo}
              alt={ferramenta.nome}
              className="w-14 h-14 rounded-xl object-contain border border-border bg-white p-2 flex-shrink-0 shadow-sm"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-xl font-bold text-primary">
                {ferramenta.nome.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {ferramenta.nome}
              </h3>
              {ferramenta.verificada && (
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            {ferramenta.destaque && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs shadow-sm">
                <Star className="w-3 h-3 mr-1 fill-white" />
                Destaque
              </Badge>
            )}
          </div>
        </div>

        {/* Descrição */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-auto">
          {ferramenta.descricao}
        </p>
      </Link>

      {/* Botão para site - separado do card clicável */}
      <div className="px-6 pb-5 pt-3 border-t border-border/50 bg-gradient-to-t from-muted/10 to-transparent">
        <a
          href={ferramenta.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2" />
            <span className="font-medium">
              Visitar Site
            </span>
          </Button>
        </a>
      </div>
    </div>
  );
};

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

  // Buscar ferramentas alternativas da mesma categoria
  const { data: alternativas } = useQuery({
    queryKey: ["alternativas", ferramenta?.categoria, id],
    queryFn: async () => {
      if (!ferramenta?.categoria) return [];
      const { data, error } = await supabase
        .from("ferramentas")
        .select("*")
        .eq("categoria", ferramenta.categoria)
        .neq("id", id)
        .limit(6);
      if (error) throw error;
      return data;
    },
    enabled: !!ferramenta?.categoria,
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

                {/* Saiba mais com ChatGPT */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Saiba Mais
                  </p>
                  <a
                    href={`https://chat.openai.com/?q=${encodeURIComponent(
                      `Forneça-me uma visão geral clara e concisa da ${ferramenta.nome}. Explique o que essa ferramenta de IA faz, para quem ela é mais indicada, seus principais recursos, modelo de preços, pontos fortes, pontos fracos e possíveis alternativas.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button size="sm" variant="outline" className="w-full gap-2 hover:bg-primary/5 hover:border-primary/50 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                      </svg>
                      <span className="font-medium">Perguntar ao ChatGPT</span>
                    </Button>
                  </a>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Seção de Alternativas */}
          {alternativas && alternativas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0, 0, 1] }}
              className="mt-16"
            >
              {/* Headliner centralizado com divisor */}
              <div className="relative flex items-center justify-center mb-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t-2 border-primary/20"></div>
                </div>
                <div className="relative bg-background px-6">
                  <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Alternativas para {ferramenta.nome}
                  </h2>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {alternativas.map((alt) => (
                  <AlternativaCard key={alt.id} ferramenta={alt} />
                ))}
              </div>
            </motion.div>
          )}

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
