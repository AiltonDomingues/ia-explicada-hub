import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useConceitos } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Conceito } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import slugify from "slugify";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

const AdminConceitos = () => {
  usePageTitle("Admin - Conceitos");
  const { data: conceitos = [], isLoading } = useConceitos();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingConceito, setEditingConceito] = useState<Conceito | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    area: "",
    conteudo: "",
    tags: "",
    ordem: 0,
    nivel: "Intermediário",
  });

  // Mutation para criar/atualizar conceito
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const slug = slugify(data.titulo, { lower: true, strict: true });
      const tagsArray = data.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

      const payload = {
        titulo: data.titulo,
        area: data.area,
        conteudo: data.conteudo,
        slug,
        tags: tagsArray,
        ordem: data.ordem,
        nivel: data.nivel,
        updated_at: new Date().toISOString(),
      };

      if (editingConceito) {
        const { error } = await supabase
          .from("conceitos")
          .update(payload)
          .eq("id", editingConceito.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("conceitos").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conceitos"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: editingConceito ? "Conceito atualizado" : "Conceito criado",
        description: "Operação realizada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar conceito
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("conceitos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conceitos"] });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      toast({
        title: "Conceito deletado",
        description: "O conceito foi removido com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      area: "",
      conteudo: "",
      tags: "",
      ordem: 0,
      nivel: "Intermediário",
    });
    setEditingConceito(null);
  };

  const handleEdit = (conceito: Conceito) => {
    setEditingConceito(conceito);
    setFormData({
      titulo: conceito.titulo,
      area: conceito.area,
      conteudo: conceito.conteudo,
      tags: conceito.tags.join(", "),
      ordem: conceito.ordem,
      nivel: conceito.nivel || "Intermediário",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  // Agrupar conceitos por área
  const conceitosPorArea = conceitos.reduce((acc: Record<string, Conceito[]>, conceito) => {
    if (!acc[conceito.area]) {
      acc[conceito.area] = [];
    }
    acc[conceito.area].push(conceito);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conceitos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie conceitos de IA/ML com suporte a Markdown, LaTeX e código
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
          Novo Conceito
        </Button>
      </div>

      {/* Lista de conceitos agrupados por área */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : conceitos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Nenhum conceito cadastrado</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.entries(conceitosPorArea) as [string, Conceito[]][])
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([area, conceitosArea]) => (
              <div key={area} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 border-b border-border">
                  <h2 className="font-semibold text-lg">{area}</h2>
                  <p className="text-sm text-muted-foreground">{conceitosArea.length} conceitos</p>
                </div>
                <div className="divide-y divide-border">
                  {conceitosArea.map((conceito) => (
                    <div
                      key={conceito.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{conceito.titulo}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          {conceito.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {conceito.nivel && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${getNivelStyles(conceito.nivel).bg} ${getNivelStyles(conceito.nivel).text} ${getNivelStyles(conceito.nivel).border}`}
                            >
                              {conceito.nivel}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Ordem: {conceito.ordem}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(conceito)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(conceito.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingConceito ? "Editar Conceito" : "Novo Conceito"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                  placeholder="Ex: Redes Neurais Convolucionais"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área de Conhecimento *</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                  placeholder="Ex: Deep Learning"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Ex: CNN, visão computacional, imagem"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nivel">Nível de Dificuldade</Label>
              <Select
                value={formData.nivel}
                onValueChange={(value) => setFormData({ ...formData, nivel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[300]">
                  <SelectItem value="Iniciante">Iniciante</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-2">
                <Label htmlFor="conteudo">
                  Conteúdo (Markdown com LaTeX e código) *
                </Label>
                <Textarea
                  id="conteudo"
                  value={formData.conteudo}
                  onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                  required
                  rows={20}
                  className="font-mono text-sm"
                  placeholder={`# Título

## Subtítulo

Texto normal com **negrito** e *itálico*.

### Fórmula LaTeX
$$f(x) = \\frac{1}{1 + e^{-x}}$$

### Código Python
\`\`\`python
import numpy as np
def sigmoid(x):
    return 1 / (1 + np.exp(-x))
\`\`\`

### Lista
- Item 1
- Item 2

### Imagem
![Alt text](https://exemplo.com/imagem.jpg)`}
                />
              </TabsContent>

              <TabsContent value="preview" className="border border-border rounded-lg p-6 min-h-[500px] overflow-auto">
                <MarkdownRenderer content={formData.conteudo || "*Nenhum conteúdo para preview*"} />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog de Deletar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O conceito será permanentemente deletado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminConceitos;
