import { useState } from "react";
import { useNoticias } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

const AdminNoticias = () => {
  usePageTitle("Admin - Notícias");
  const { data: noticias = [], isLoading } = useNoticias();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    descricao: "",
    data: "",
    categoria: "",
    link: "",
    tags: "",
    tempo_leitura: "5 min",
    trending: false,
    imagem_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { id, tags, ...data } = formData;
      const tagsArray = tags.split(",").map((tag) => tag.trim()).filter(Boolean);

      let result;
      if (id) {
        // Update
        result = await supabase.from("noticias").update({ ...data, tags: tagsArray }).eq("id", id);
      } else {
        // Insert
        result = await supabase.from("noticias").insert([{ ...data, tags: tagsArray }]);
      }

      if (result.error) {
        throw result.error;
      }

      queryClient.invalidateQueries({ queryKey: ["noticias"] });
      setDialogOpen(false);
      resetForm();
      
      toast({
        title: "Sucesso!",
        description: id ? "Notícia atualizada com sucesso." : "Notícia criada com sucesso.",
      });
    } catch (error: any) {
      console.error("Error saving noticia:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao salvar notícia. Verifique se as políticas do banco foram configuradas.",
      });
    }
  };

  const handleEdit = (noticia: any) => {
    setFormData({
      ...noticia,
      tags: noticia.tags.join(", "),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      try {
        const { error } = await supabase.from("noticias").delete().eq("id", id);
        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ["noticias"] });
        toast({
          title: "Sucesso!",
          description: "Notícia excluída com sucesso.",
        });
      } catch (error: any) {
        console.error("Error deleting noticia:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Erro ao excluir notícia.",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      titulo: "",
      descricao: "",
      data: "",
      categoria: "",
      link: "",
      tags: "",
      tempo_leitura: "5 min",
      trending: false,
      imagem_url: "",
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Notícias</h1>
          <p className="text-muted-foreground">
            Gerencie as notícias do seu site
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Notícia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "Editar Notícia" : "Nova Notícia"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
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
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
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
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
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
                  placeholder="IA, Machine Learning, Tecnologia"
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
                  placeholder="5 min"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trending"
                  checked={formData.trending}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, trending: checked as boolean })
                  }
                />
                <Label htmlFor="trending" className="cursor-pointer">
                  Marcar como Trending
                </Label>
              </div>
              <div>
                <Label htmlFor="link">Link da Notícia Original</Label>
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
              <div>
                <Label htmlFor="imagem_url">URL da Imagem</Label>
                <Input
                  id="imagem_url"
                  type="url"
                  value={formData.imagem_url}
                  onChange={(e) =>
                    setFormData({ ...formData, imagem_url: e.target.value })
                  }
                  placeholder="https://exemplo.com/imagem.jpg"
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
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : noticias.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-xl">
          <p className="text-muted-foreground mb-4">
            Nenhuma notícia cadastrada ainda
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeira Notícia
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {noticias.map((noticia) => (
                <TableRow key={noticia.id}>
                  <TableCell className="font-medium">
                    {noticia.titulo}
                  </TableCell>
                  <TableCell>{noticia.categoria}</TableCell>
                  <TableCell>{noticia.data}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(noticia)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(noticia.id)}
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

export default AdminNoticias;
