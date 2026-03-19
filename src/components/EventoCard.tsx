import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import type { Evento } from "@/data/eventos";

interface EventoCardProps {
  evento: Evento;
}

const getNivelStyles = (nivel: string) => {
  const nivelLower = nivel.toLowerCase();
  
  if (nivelLower.includes("iniciante") || nivelLower.includes("básico") || nivelLower.includes("beginner")) {
    return {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20"
    };
  }
  
  if (nivelLower.includes("intermediário") || nivelLower.includes("intermediario") || nivelLower.includes("intermediate")) {
    return {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20"
    };
  }
  
  if (nivelLower.includes("avançado") || nivelLower.includes("avancado") || nivelLower.includes("advanced")) {
    return {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20"
    };
  }
  
  return {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20"
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function EventoCard({ evento }: EventoCardProps) {
  const nivelStyles = evento.nivel ? getNivelStyles(evento.nivel) : null;

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
      {/* Banner Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={evento.banner}
          alt={evento.titulo}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Event Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-mono-meta font-semibold uppercase tracking-wider bg-primary text-primary-foreground shadow-lg">
            {evento.tipo}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {evento.titulo}
        </h3>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(evento.data)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{evento.local}</span>
          </div>

          {evento.organizador && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{evento.organizador}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {evento.descricao}
        </p>

        {/* Footer with Level and Link */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {nivelStyles ? (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono-meta font-semibold uppercase tracking-wider border ${nivelStyles.bg} ${nivelStyles.text} ${nivelStyles.border}`}>
              {evento.nivel}
            </span>
          ) : (
            <div />
          )}

          {evento.link && (
            <a
              href={evento.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <span>Saiba mais</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
