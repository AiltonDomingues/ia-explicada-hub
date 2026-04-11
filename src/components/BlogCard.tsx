import { Clock, Tag, ExternalLink, Sparkles, TrendingUp, Bookmark } from "lucide-react";
import type { BlogPost } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritos, useAddFavorito, useRemoveFavorito } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  showSaveButton?: boolean;
}

const getCategoryColor = (categoria: string) => {
  const colors = {
    'Blog': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'Caso de Uso': 'bg-green-500/10 text-green-600 dark:text-green-400',
    'Guia': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'Tutorial': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  };
  return colors[categoria as keyof typeof colors] || 'bg-primary/10 text-primary';
};

const getNivelBadgeColor = (nivel: string) => {
  const colors = {
    'Iniciante': 'bg-green-500/10 text-green-700 dark:text-green-300',
    'Intermediário': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
    'Avançado': 'bg-red-500/10 text-red-700 dark:text-red-300',
    'Todos os níveis': 'bg-slate-500/10 text-slate-700 dark:text-slate-300',
  };
  return colors[nivel as keyof typeof colors] || 'bg-muted text-muted-foreground';
};

const BlogCard = ({ post, featured = false, showSaveButton = true }: BlogCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: favoritos = [] } = useFavoritos(user?.id, 'blog');
  const addFavorito = useAddFavorito();
  const removeFavorito = useRemoveFavorito();

  const isSalvo = favoritos.some(f => f.item_id === post.id?.toString());

  const handleToggleSalvar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar artigos",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSalvo) {
        await removeFavorito.mutateAsync({
          userId: user.id,
          tipo: 'blog',
          itemId: post.id?.toString() || '',
        });
        toast({
          title: "Removido dos salvos",
          description: "Artigo removido da sua lista",
        });
      } else {
        await addFavorito.mutateAsync({
          userId: user.id,
          tipo: 'blog',
          itemId: post.id?.toString() || '',
        });
        toast({
          title: "Salvo com sucesso",
          description: "Artigo adicionado aos seus salvos",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar artigo",
        variant: "destructive",
      });
    }
  };

  return (
  <a
    href={post.url_conteudo}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "card-base rounded-2xl bg-card flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative",
      featured ? "p-0" : "p-0"
    )}
  >
    {/* Botão de Salvar */}
    {showSaveButton && user && (
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 left-3 h-8 w-8 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={handleToggleSalvar}
      >
        <Bookmark 
          className={`w-4 h-4 transition-colors ${
            isSalvo ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        />
      </Button>
    )}
    {/* Imagem de Preview */}
    {post.url_imagem && (
      <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden bg-muted">
        <img 
          src={post.url_imagem} 
          alt={post.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {post.destaque && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-primary text-white font-medium flex items-center gap-1 text-xs shadow-lg">
            <Sparkles className="w-3 h-3" />
            Destaque
          </div>
        )}
      </div>
    )}

    <div className={cn("flex flex-col flex-1", featured ? "p-6" : "p-5")}>
      {/* Badges: Categoria e Nível */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={cn(
          "px-2.5 py-1 rounded-md font-medium",
          getCategoryColor(post.categoria),
          featured ? "text-sm" : "text-xs"
        )}>
          {post.categoria}
        </span>
        <span className={cn(
          "px-2.5 py-1 rounded-md font-medium",
          getNivelBadgeColor(post.nivel),
          featured ? "text-sm" : "text-xs"
        )}>
          {post.nivel}
        </span>
      </div>

      {/* Título */}
      <h3 className={cn(
        "font-bold leading-snug mb-2 group-hover:text-primary transition-colors",
        featured ? "text-xl lg:text-2xl mb-3" : "text-lg"
      )}>
        {post.titulo}
      </h3>
      
      {/* Descrição */}
      <p className={cn(
        "text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3",
        featured ? "text-base" : "text-sm"
      )}>
        {post.descricao}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Tag className={cn(
            "text-muted-foreground mt-0.5 flex-shrink-0",
            featured ? "w-4 h-4" : "w-3.5 h-3.5"
          )} />
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={cn(
              "font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground",
              featured ? "text-xs" : "text-[10px]"
            )}>
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className={cn(
              "font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground",
              featured ? "text-xs" : "text-[10px]"
            )}>
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: Fonte, Autor, Tempo de Leitura */}
      <div className="space-y-2 mb-4">
        <div className={cn(
          "flex items-center justify-between text-muted-foreground",
          featured ? "text-sm" : "text-xs"
        )}>
          <span className="font-medium truncate flex-1">
            <span className="text-foreground/70">Fonte:</span> {post.fonte}
          </span>
          {post.tempo_leitura && (
            <span className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Clock className={cn(featured ? "w-4 h-4" : "w-3.5 h-3.5")} /> 
              {post.tempo_leitura}
            </span>
          )}
        </div>
        
        <div className={cn(
          "text-muted-foreground",
          featured ? "text-sm" : "text-xs"
        )}>
          <span className="text-foreground/70">Por:</span> {post.autor_original}
        </div>
      </div>

      {/* Call-to-Action */}
      <div className={cn(
        "flex items-center justify-center gap-2 rounded-lg border border-primary/30 text-primary font-medium group-hover:bg-primary/10 group-hover:border-primary transition-colors",
        featured ? "py-3 text-base" : "py-2 text-sm"
      )}>
        Ler Conteúdo Original
        <ExternalLink className="w-4 h-4" />
      </div>
    </div>
  </a>
  );
};

export default BlogCard;
