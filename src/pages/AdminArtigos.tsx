import { useState } from "react";
import { useArtigos } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const AdminArtigos = () => {
  const { data: artigos = [], isLoading } = useArtigos();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    autor: "",
    resumo: "",
    descricao: "",
    categoria: "",
    tempo_leitura: "",
    data: "",
    tags: "",
    link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { id, tags, ...data } = formData;
      const tagsArray = tags.split(",").map((tag) => tag.trim());

      let result;
      if (id) {
        result = await supabase
          .from("artigos")
          .update({ ...data, tags: tagsArray })
          .eq("id", id);
      } else {
        result = await supabase.from("artigos").insert([{ ...data, tags: tagsArray }]);
      }

      if (result.error) throw result.error;

      queryClient.invalidateQueries({ queryKey: ["artigos"] });
      setDialogOpen(false);
      resetForm();
      
      toast({
        title: "Sucesso!",
        description: id ? "Artigo atualizado com sucesso." : "Artigo criado com sucesso.",
      });
    } catch (error: any) {
      console.error("Error saving artigo:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao salvar artigo. Verifique se as políticas do banco foram configuradas.",
      });
    }
  };

  const handleEdit = (artigo: any) => {
    setFormData({
      ...artigo,
      tags: artigo.tags.join(", "),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      try {
        const { error } = await supabase.from("artigos").delete().eq("id", id);
        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ["artigos"] });
        toast({
          title: "Sucesso!",
          description: "Artigo excluído com sucesso.",
        });
      } catch (error: any) {
        console.error("Error deleting artigo:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Erro ao excluir artigo.",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      titulo: "",
      autor: "",
      resumo: "",
      descricao: "",
      categoria: "",
      tempo_leitura: "",
      data: "",
      tags: "",
      link: "",
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Artigos</h1>
          <p className="text-muted-foreground">
            Gerencie os artigos do seu site
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "Editar Artigo" : "Novo Artigo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="autor">Autor</Label>
                <Input
                  id="autor"
                  value={formData.autor}
                  onChange={(e) =>
                    setFormData({ ...formData, autor: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="resumo">Resumo</Label>
                <Textarea
                  id="resumo"
                  value={formData.resumo}
                  onChange={(e) =>
                    setFormData({ ...formData, resumo: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descrição completa do artigo (opcional)"
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  placeholder="Ex: Machine Learning, NLP, Tutorial"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tempo_leitura">Tempo de Leitura</Label>
                <Input
                  id="tempo_leitura"
                  value={formData.tempo_leitura}
                  onChange={(e) =>
                    setFormData({ ...formData, tempo_leitura: e.target.value })
                  }
                  placeholder="Ex: 5 min"
                  required
                />
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="IA, Machine Learning, Tutorial"
                  required
                />
              </div>
              <div>
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : artigos.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-xl">
          <p className="text-muted-foreground mb-4">
            Nenhum artigo cadastrado ainda
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Artigo
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artigos.map((artigo) => (
                <TableRow key={artigo.id}>
                  <TableCell className="font-medium">{artigo.titulo}</TableCell>
                  <TableCell>{artigo.autor}</TableCell>
                  <TableCell>{artigo.data}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(artigo)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(artigo.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminArtigos;
