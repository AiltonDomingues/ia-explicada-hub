import { FileText, Video, Code, BookOpen, Database, Download } from "lucide-react";
import { Link } from "react-router-dom";
import type { Material } from "@/data/materiais";

const tipoIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  Vídeo: Video,
  "Código": Code,
  "E-book": BookOpen,
  Dataset: Database,
};

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const Icon = tipoIcons[material.tipo] || FileText;

  return (
    <div className="card-base rounded-2xl bg-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono-meta text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium">
          {material.tipo}
        </span>
        <span className="text-xs text-primary font-medium">{material.categoria}</span>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold leading-snug">{material.titulo}</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{material.descricao}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>Tamanho: {material.tamanho}</span>
        <span>{material.downloads} downloads</span>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/materiais/${material.id}`}
          className="flex-1 block text-center py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          Ver Material
        </Link>
        <button className="p-2 rounded-lg bg-primary text-card hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
