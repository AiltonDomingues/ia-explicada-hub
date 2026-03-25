import { useState } from "react";
import { ExternalLink, CheckCircle2, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Ferramenta } from "@/lib/supabase";
import { Link } from "react-router-dom";

interface FerramentaCardProps {
  ferramenta: Ferramenta;
}

const getCategoryColor = (categoria: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    "Geradores de Imagem": { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
    "Chat & Assistentes": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    "Geradores de Vídeo": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
    "Text-to-Speech": { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
    "Escrita & SEO": { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
    "Código & Desenvolvimento": { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
    "Produtividade": { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    "Educação": { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
    "Marketing": { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
    "Design": { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400" },
  };
  return colors[categoria] || { bg: "bg-primary/10", text: "text-primary" };
};

const FerramentaCard = ({ ferramenta }: FerramentaCardProps) => {
  const categoryColors = getCategoryColor(ferramenta.categoria);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/ferramentas/${ferramenta.id}`}
      className="bg-card rounded-xl border border-border hover:border-muted-foreground/20 transition-all duration-300 overflow-hidden h-full flex flex-col hover:shadow-md group"
    >
      {/* Header com Logo/Ícone */}
      <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        {ferramenta.destaque && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-amber-500/90 text-white border-0 shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              Destaque
            </Badge>
          </div>
        )}
        
        <div className="flex items-start gap-3">
          {/* Logo ou Ícone */}
          {ferramenta.logo && !imageError ? (
            <img 
              src={ferramenta.logo} 
              alt={ferramenta.nome}
              className="w-12 h-12 rounded-lg object-cover bg-white p-1"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${categoryColors.bg} ${categoryColors.text} font-bold text-lg`}>
              {ferramenta.nome.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg text-foreground line-clamp-1">
                {ferramenta.nome}
              </h3>
              {ferramenta.verificada && (
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ferramenta.categoria}
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {ferramenta.descricao}
          </p>

          {/* Tags */}
          {ferramenta.tags && ferramenta.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ferramenta.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              {ferramenta.tags.length > 3 && (
                <span className="text-xs px-2 py-1 text-muted-foreground">
                  +{ferramenta.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer com Badges */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {ferramenta.ranking && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span>#{ferramenta.ranking}</span>
                </div>
              )}
            </div>

            <a
              href={ferramenta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(ferramenta.url, '_blank');
              }}
              title="Visitar site oficial"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>
    </Link>
  );
};

export default FerramentaCard;
