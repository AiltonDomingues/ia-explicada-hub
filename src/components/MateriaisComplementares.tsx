import { ExternalLink, Video, BookOpen, GraduationCap, FileText, Link2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface Material {
  titulo: string;
  url: string;
  tipo: 'video' | 'artigo' | 'curso' | 'documentacao' | 'outro';
}

interface MateriaisComplementaresProps {
  materiais: Material[];
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'artigo':
      return <FileText className="w-4 h-4" />;
    case 'curso':
      return <GraduationCap className="w-4 h-4" />;
    case 'documentacao':
      return <BookOpen className="w-4 h-4" />;
    default:
      return <Link2 className="w-4 h-4" />;
  }
};

const getTipoLabel = (tipo: string) => {
  const labels = {
    video: 'Vídeo',
    artigo: 'Artigo',
    curso: 'Curso',
    documentacao: 'Documentação',
    outro: 'Link'
  };
  return labels[tipo as keyof typeof labels] || 'Link';
};

const getTipoColor = (tipo: string) => {
  const colors = {
    video: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    artigo: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    curso: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    documentacao: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    outro: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  };
  return colors[tipo as keyof typeof colors] || colors.outro;
};

const MateriaisComplementares = ({ materiais }: MateriaisComplementaresProps) => {
  if (!materiais || materiais.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t-2 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            Materiais Complementares
          </h3>
          <p className="text-sm text-muted-foreground">
            Recursos extras para se aprofundar no tema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {materiais.map((material, index) => (
          <a
            key={index}
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className={`p-3 rounded-lg ${getTipoColor(material.tipo)} flex-shrink-0`}>
              {getTipoIcon(material.tipo)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {material.titulo}
                </h4>
                <Badge 
                  variant="outline" 
                  className={`text-xs flex-shrink-0 ${getTipoColor(material.tipo)}`}
                >
                  {getTipoLabel(material.tipo)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {material.url}
              </p>
            </div>

            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default MateriaisComplementares;
