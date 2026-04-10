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
    // Criação de Conteúdo Visual
    "Geradores de Imagem": { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
    "Geradores de Vídeo": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
    "Edição de Imagem": { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400" },
    "Edição de Vídeo": { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
    "Face Swap & DeepFake": { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
    "Criação de Logos": { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
    "Texto para Vídeo": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
    "Modelos 3D": { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
    
    // Texto e Escrita
    "Escrita & SEO": { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    "Geradores de Texto": { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400" },
    "E-mail": { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
    "Resumidor": { bg: "bg-lime-500/10", text: "text-lime-600 dark:text-lime-400" },
    "Gerador de Histórias": { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    
    // Áudio e Voz
    "Texto para Fala": { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
    "Edição de Áudio": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    "Música": { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400" },
    "Transcrição": { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
    
    // Chat e Assistentes
    "Chat & Assistentes IA": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    "Assistentes de Vida": { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
    "Memória": { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
    "Agentes de IA": { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
    
    // Tecnologia e Desenvolvimento
    "Assistente de Código": { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
    "Ferramentas para Devs": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    "Sites & Design": { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400" },
    "Apresentações": { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
    "Automação": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
    
    // Negócios e Produtividade
    "Produtividade": { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
    "Marketing": { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
    "Redes Sociais": { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
    "E-commerce": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    "Recursos Humanos": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    "Finanças": { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
    "Imobiliário": { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400" },
    
    // Dados e Análise
    "Dados & Analytics": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
    "Mecanismos de Busca": { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
    "Arquivos & Planilhas": { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
    
    // Educação e Pesquisa
    "Educação": { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400" },
    "Pesquisa & Ciência": { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
    
    // Especialidades
    "Saúde": { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
    "Assistentes Jurídicos": { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400" },
    "Moda": { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400" },
    "Viagens": { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
    "Tecnologia Assistiva": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    "Tradução": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
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
