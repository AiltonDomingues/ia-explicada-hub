import { Clock, Star } from "lucide-react";
import type { Curso } from "@/data/cursos";

interface CursoCardProps {
  curso: Curso;
}

const CursoCard = ({ curso }: CursoCardProps) => (
  <div className="card-base rounded-2xl bg-card p-5 flex flex-col h-full">
    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
      <span className="font-mono-meta text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium">
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

export default CursoCard;
