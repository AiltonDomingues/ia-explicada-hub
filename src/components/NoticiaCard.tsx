import { Clock, TrendingUp, Tag } from "lucide-react";
import type { Noticia } from "@/data/noticias";

interface NoticiaCardProps {
  noticia: Noticia;
}

const NoticiaCard = ({ noticia }: NoticiaCardProps) => (
  <div className="card-base rounded-2xl bg-card p-5 flex flex-col h-full">
    <div className="flex items-center justify-between mb-3">
      <span className="font-mono-meta text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium">
        {noticia.categoria}
      </span>
      {noticia.trending && (
        <span className="flex items-center gap-1 text-xs text-primary font-medium">
          <TrendingUp className="w-3.5 h-3.5" /> Trending
        </span>
      )}
    </div>

    <h3 className="text-lg font-semibold leading-snug mb-2">{noticia.titulo}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{noticia.descricao}</p>

    <div className="flex flex-wrap gap-1.5 mb-4">
      <Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
      {noticia.tags.map((tag) => (
        <span key={tag} className="font-mono-meta text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
          {tag}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
      <span className="flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" /> {noticia.tempoLeitura}
      </span>
      {noticia.data && <span>{noticia.data}</span>}
    </div>

    <a
      href={noticia.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-center py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
    >
      Ler Notícia
    </a>
  </div>
);

export default NoticiaCard;
