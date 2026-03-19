import { Clock, TrendingUp, Tag, Sparkles } from "lucide-react";
import type { Noticia } from "@/data/noticias";
import { timeAgo, isNew, getCategoryColor } from "@/lib/utils";

interface NoticiaCardProps {
  noticia: Noticia;
  featured?: boolean;
}

const NoticiaCard = ({ noticia, featured = false }: NoticiaCardProps) => {
  const categoryColors = getCategoryColor(noticia.categoria);
  const isNewArticle = isNew(noticia.data);
  
  if (featured) {
    return (
      <div className={`card-base rounded-2xl bg-card overflow-hidden border-l-4 ${categoryColors.border} hover:shadow-2xl hover:scale-[1.01] transition-all duration-300`}>
        {noticia.imagem_url && (
          <div className="w-full h-64 md:h-80 overflow-hidden">
            <img 
              src={noticia.imagem_url} 
              alt={noticia.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`font-mono-meta text-xs uppercase tracking-wider px-3 py-1.5 rounded-md ${categoryColors.bg} ${categoryColors.text} font-semibold`}>
              {noticia.categoria}
            </span>
            {noticia.trending && (
              <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <TrendingUp className="w-4 h-4" /> Trending
              </span>
            )}
            {isNewArticle && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
                <Sparkles className="w-4 h-4" /> NOVO
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{noticia.titulo}</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">{noticia.descricao}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
            {noticia.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="font-mono-meta text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {noticia.tempoLeitura}
            </span>
            {noticia.data && <span className="font-medium">{timeAgo(noticia.data)}</span>}
          </div>

          <a
            href={noticia.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-lg"
          >
            Ler Notícia Completa →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-base rounded-2xl bg-card overflow-hidden flex flex-col border-l-4 ${categoryColors.border} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}>
      {noticia.imagem_url && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={noticia.imagem_url} 
            alt={noticia.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className={`font-mono-meta text-xs uppercase tracking-wider px-2.5 py-1 rounded-md ${categoryColors.bg} ${categoryColors.text} font-medium`}>
            {noticia.categoria}
          </span>
          <div className="flex items-center gap-2">
            {noticia.trending && (
              <span className="flex items-center gap-1 text-xs text-primary font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> Trending
              </span>
            )}
            {isNewArticle && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> NOVO
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold leading-snug mb-2 group-hover:text-primary transition-colors">{noticia.titulo}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{noticia.descricao}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
          {noticia.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="font-mono-meta text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {noticia.tempoLeitura}
          </span>
          {noticia.data && <span className="font-medium">{timeAgo(noticia.data)}</span>}
        </div>

        <a
          href={noticia.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-2 rounded-lg border-2 border-primary/30 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all group-hover:border-primary"
        >
          Ler Notícia
        </a>
      </div>
    </div>
  );
};

export default NoticiaCard;
