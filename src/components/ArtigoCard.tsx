import { Clock, Tag, User, Sparkles } from "lucide-react";
import type { Artigo } from "@/data/artigos";
import { cn } from "@/lib/utils";

interface ArtigoCardProps {
  artigo: Artigo;
  featured?: boolean;
}

const ArtigoCard = ({ artigo, featured = false }: ArtigoCardProps) => (
  <div className={cn(
    "card-base rounded-2xl bg-card flex flex-col h-full transition-all duration-300",
    featured ? "p-6 lg:p-8" : "p-5"
  )}>
    <div className="flex items-center justify-between mb-3">
      <span className={cn(
        "px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium",
        featured ? "text-sm" : "text-xs"
      )}>
        {artigo.categoria}
      </span>
      {artigo.destaque && (
        <span className={cn(
          "px-2 py-0.5 rounded-md bg-primary text-card font-medium flex items-center gap-1",
          featured ? "text-sm" : "text-xs"
        )}>
          <Sparkles className="w-3 h-3" />
          Destaque
        </span>
      )}
    </div>

    <h3 className={cn(
      "font-semibold leading-snug mb-2",
      featured ? "text-xl lg:text-2xl mb-3" : "text-lg"
    )}>
      {artigo.titulo}
    </h3>
    
    <p className={cn(
      "text-muted-foreground leading-relaxed mb-4 flex-1",
      featured ? "text-base" : "text-sm"
    )}>
      {artigo.resumo}
    </p>

    <div className="flex flex-wrap gap-1.5 mb-4">
      <Tag className={cn(
        "text-muted-foreground mt-0.5",
        featured ? "w-4 h-4" : "w-3.5 h-3.5"
      )} />
      {artigo.tags.map((tag) => (
        <span key={tag} className={cn(
          "font-mono-meta px-2 py-0.5 rounded bg-muted text-muted-foreground",
          featured ? "text-sm" : "text-xs"
        )}>
          {tag}
        </span>
      ))}
    </div>

    <div className={cn(
      "flex items-center justify-between text-muted-foreground mb-3",
      featured ? "text-sm" : "text-xs"
    )}>
      <span className="flex items-center gap-1">
        <User className={cn(featured ? "w-4 h-4" : "w-3.5 h-3.5")} /> 
        {artigo.autor}
      </span>
      <span className="flex items-center gap-1">
        <Clock className={cn(featured ? "w-4 h-4" : "w-3.5 h-3.5")} /> 
        {artigo.tempoLeitura}
      </span>
    </div>

    <a
      href={artigo.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block text-center rounded-lg border border-primary/30 text-primary font-medium hover:bg-primary/5 transition-colors",
        featured ? "py-3 text-base" : "py-2 text-sm"
      )}
    >
      Ler Artigo Completo
    </a>
  </div>
);

export default ArtigoCard;
