import { Clock, Star, Bookmark } from "lucide-react";
import type { Curso } from "@/data/cursos";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritos, useAddFavorito, useRemoveFavorito } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CursoCardProps {
  curso: Curso;
  showSaveButton?: boolean;
}

const getCategoryColor = (categoria: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    // Baseado nas cores dos roadmaps
    "Fundamentos": { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
    "IA Generativa": { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400" },
    "Agentes de IA": { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
    "Visão Computacional": { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
    "Processamento de Linguagem": { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
    "Deep Learning": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
    "Machine Learning": { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  };
  return colors[categoria] || { bg: "bg-primary/10", text: "text-primary" };
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
  
  // Fallback para primary
  return {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20"
  };
};

const CursoCard = ({ curso, showSaveButton = true }: CursoCardProps) => {
  const categoryColors = getCategoryColor(curso.categoria);
  const nivelStyles = getNivelStyles(curso.nivel);
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: favoritos = [] } = useFavoritos(user?.id, 'curso');
  const addFavorito = useAddFavorito();
  const removeFavorito = useRemoveFavorito();

  const isSalvo = favoritos.some(f => f.item_id === curso.id?.toString());

  const handleToggleSalvar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar cursos",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSalvo) {
        await removeFavorito.mutateAsync({
          userId: user.id,
          tipo: 'curso',
          itemId: curso.id?.toString() || '',
        });
        toast({
          title: "Removido dos salvos",
          description: "Curso removido da sua lista",
        });
      } else {
        await addFavorito.mutateAsync({
          userId: user.id,
          tipo: 'curso',
          itemId: curso.id?.toString() || '',
        });
        toast({
          title: "Salvo com sucesso",
          description: "Curso adicionado aos seus salvos",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar curso",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="card-base rounded-2xl bg-card p-5 flex flex-col h-full relative">
      {/* Botão de Salvar */}
      {showSaveButton && user && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 z-10"
          onClick={handleToggleSalvar}
        >
          <Bookmark 
            className={`w-4 h-4 transition-colors ${
              isSalvo ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          />
        </Button>
      )}
      
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 pr-8">
        <span className={`text-xs px-2 py-0.5 rounded-md ${categoryColors.bg} ${categoryColors.text} font-medium`}>
          {curso.categoria}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-md ${nivelStyles.bg} ${nivelStyles.text} font-medium`}>
            {curso.nivel}
          </span>
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
        <div className="flex items-center gap-3">
          <span className="font-medium">{curso.plataforma}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {curso.duracao}
          </span>
        </div>
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
