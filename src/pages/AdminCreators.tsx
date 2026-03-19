import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ExternalLink, Youtube, Twitter, Linkedin, Globe, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Creator {
  id: string;
  nome: string;
  descricao: string;
  avatar: string;
  especialidade: string;
  plataforma: string;
  link: string;
  seguidores?: string;
  destaque: boolean;
}

const AdminCreators = () => {
  usePageTitle("Admin - Creators");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    avatar: "",
    especialidade: "",
    plataforma: "YouTube",
    link: "",
    seguidores: "",
    destaque: false,
  });

  const queryClient = useQueryClient();

  // Fetch creators
  const { data: creators = [], isLoading } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("destaque", { ascending: false })
        .order("nome");
      
      if (error) throw error;
      return data as Creator[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        seguidores: data.seguidores || null,
      };

      if (editingCreator) {
        const { error } = await supabase
          .from("creators")
          .update(payload)
          .eq("id", editingCreator.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("creators")
          .insert([payload]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creators"] });
      toast({
        title: editingCreator ? "Creator atualizado!" : "Creator criado!",
        description: "As alterações foram salvas com sucesso.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("creators")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creators"] });
      toast({
        title: "Creator removido!",
        description: "O creator foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      avatar: "",
      especialidade: "",
      plataforma: "YouTube",
      link: "",
      seguidores: "",
      destaque: false,
    });
    setEditingCreator(null);
  };

  const handleEdit = (creator: Creator) => {
    setEditingCreator(creator);
    setFormData({
      nome: creator.nome,
      descricao: creator.descricao,
      avatar: creator.avatar,
      especialidade: creator.especialidade,
      plataforma: creator.plataforma,
      link: creator.link,
      seguidores: creator.seguidores || "",
      destaque: creator.destaque,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este creator?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const getPlatformIcon = (plataforma: string) => {
    const plataformaLower = plataforma.toLowerCase();
    const iconClass = "w-4 h-4";
    
    if (plataformaLower.includes("youtube")) return <Youtube className={iconClass} />;
    if (plataformaLower.includes("twitter")) return <Twitter className={iconClass} />;
    if (plataformaLower.includes("linkedin")) return <Linkedin className={iconClass} />;
    return <Globe className={iconClass} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Criadores de Conteúdo</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os principais criadores de conteúdo sobre IA
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Creator
        </Button>
      </div>

      {/* Lista de creators */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : creators.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Nenhum creator cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="flex flex-col border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={creator.avatar}
                  alt={creator.nome}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{creator.nome}</h3>
                    {creator.destaque && (
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {creator.especialidade}
                    </Badge>
                    {creator.seguidores && (
                      <Badge variant="outline" className="text-xs">
                        {creator.seguidores}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                {creator.descricao}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getPlatformIcon(creator.plataforma)}
                  <span>{creator.plataforma}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(creator.link, "_blank")}
                    title="Visitar perfil"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(creator)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(creator.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingCreator ? "Editar Creator" : "Novo Creator"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  placeholder="Ex: Andrew Ng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade *</Label>
                <Input
                  id="especialidade"
                  value={formData.especialidade}
                  onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                  required
                  placeholder="Ex: Deep Learning"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
                placeholder="Breve biografia do creator"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL *</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                required
                placeholder="https://exemplo.com/foto.jpg"
              />
              <p className="text-xs text-muted-foreground">
                URL da foto do creator (recomendado: imagem quadrada)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plataforma">Plataforma *</Label>
                <Select
                  value={formData.plataforma}
                  onValueChange={(value) => setFormData({ ...formData, plataforma: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Blog">Blog</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seguidores">Seguidores</Label>
                <Input
                  id="seguidores"
                  value={formData.seguidores}
                  onChange={(e) => setFormData({ ...formData, seguidores: e.target.value })}
                  placeholder="Ex: 1.2M"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link do Perfil *</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
                placeholder="https://exemplo.com/perfil"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="destaque"
                checked={formData.destaque}
                onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                className="w-4 h-4 rounded border-border"
                aria-label="Creator em destaque"
              />
              <Label htmlFor="destaque" className="cursor-pointer">
                Creator em destaque
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCreators;
