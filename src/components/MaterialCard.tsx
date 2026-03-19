import { FileText, Video, Code, BookOpen, Database } from "lucide-react";
import { Link } from "react-router-dom";
import type { Material } from "@/data/materiais";

const tipoIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  Vídeo: Video,
  "Código": Code,
  "E-book": BookOpen,
  Dataset: Database,
};

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

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const Icon = tipoIcons[material.tipo] || FileText;
  const nivelStyles = getNivelStyles(material.nivel);

  return (
    <div className="card-base rounded-2xl bg-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
          {material.categoria}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-md ${nivelStyles.bg} ${nivelStyles.text} font-medium`}>
          {material.nivel}
        </span>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold leading-snug">{material.titulo}</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{material.descricao}</p>

      <div className="flex items-center text-xs text-muted-foreground mb-3">
        <span>Tamanho: {material.tamanho}</span>
      </div>

      <Link
        to={`/materiais/${material.id}`}
        className="block text-center py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
      >
        Ver Material
      </Link>
    </div>
  );
};

export default MaterialCard;
