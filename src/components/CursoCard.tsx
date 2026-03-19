import { Clock, Star } from "lucide-react";
import type { Curso } from "@/data/cursos";

interface CursoCardProps {
  curso: Curso;
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
  
  // Fallback para primary
  return {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20"
  };
};

const CursoCard = ({ curso }: CursoCardProps) => {
  const nivelStyles = getNivelStyles(curso.nivel);
  
  return (
    <div className="card-base rounded-2xl bg-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className={`font-mono-meta text-xs uppercase tracking-wider px-2.5 py-1 rounded-md ${nivelStyles.bg} ${nivelStyles.text} font-medium border ${nivelStyles.border}`}>
          {curso.nivel}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">{curso.plataforma}</span>
          {curso.destaque && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-primary text-card font-medium">
              Destaque
            </span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold leading-snug mb-1">{curso.titulo}</h3>
      <p className="text-xs text-muted-foreground mb-2">Por {curso.autor}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{curso.descricao}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {curso.duracao}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {curso.nota}
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-primary">{curso.preco}</span>
        <a
          href={curso.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          Comprar Curso
        </a>
      </div>
    </div>
  );
};

export default CursoCard;
