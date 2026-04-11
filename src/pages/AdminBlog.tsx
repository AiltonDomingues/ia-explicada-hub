import { useState } from "react";
import { useBlogPosts } from "@/hooks/useSupabase";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const AdminBlog = () => {
  usePageTitle("Admin - Blog");
  const { data: posts = [], isLoading } = useBlogPosts();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    descricao: "",
    url_imagem: "",
    url_conteudo: "",
    categoria: "Blog",
    nivel: "Todos os níveis",
    fonte: "",
    autor_original: "",
    tempo_leitura: "",
    data: "",
    tags: "",
    destaque: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { id, tags, ...data } = formData as any;
      const tagsArray = tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag);

      const payload = {
        ...data,
        tags: tagsArray,
        url_imagem: data.url_imagem || null,
        tempo_leitura: data.tempo_leitura || null,
      };

      let result;
      if (id) {
        result = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", id);
      } else {
        result = await supabase.from("blog_posts").insert([payload]);
      }

      if (result.error) throw result.error;

      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
      setDialogOpen(false);
      resetForm();
      
      toast({
        title: "Sucesso!",
        description: id ? "Post atualizado com sucesso." : "Post criado com sucesso.",
      });
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao salvar post. Verifique se as políticas do banco foram configuradas.",
      });
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      ...post,
      tags: post.tags.join(", "),
      url_imagem: post.url_imagem || "",
      tempo_leitura: post.tempo_leitura || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      try {
        const { error } = await supabase.from("blog_posts").delete().eq("id", id);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
        toast({
          title: "Sucesso!",
          description: "Post excluído com sucesso.",
        });
      } catch (error: any) {
        console.error("Error deleting post:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Erro ao excluir post.",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      titulo: "",
      descricao: "",
      url_imagem: "",
      url_conteudo: "",
      categoria: "Blog",
      nivel: "Todos os níveis",
      fonte: "",
      autor_original: "",
      tempo_leitura: "",
      data: "",
      tags: "",
      destaque: false,
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Blog</h1>
          <p className="text-muted-foreground">
            Gerencie os posts do seu blog
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "Editar Post" : "Novo Post"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    required
                    placeholder="Título do post"
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Resumo/preview do conteúdo (1-2 frases)"
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="url_conteudo">URL do Conteúdo Original *</Label>
                  <Input
                    id="url_conteudo"
                    type="url"
                    value={formData.url_conteudo}
                    onChange={(e) =>
                      setFormData({ ...formData, url_conteudo: e.target.value })
                    }
                    required
                    placeholder="https://exemplo.com/artigo"
                  />
                </div>

                <div>
                  <Label htmlFor="url_imagem">URL da Imagem de Preview</Label>
                  <Input
                    id="url_imagem"
                    type="url"
                    value={formData.url_imagem}
                    onChange={(e) =>
                      setFormData({ ...formData, url_imagem: e.target.value })
                    }
                    placeholder="https://exemplo.com/imagem.jpg (opcional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select 
                      value={formData.categoria} 
                      onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Blog">Blog</SelectItem>
                        <SelectItem value="Caso de Uso">Caso de Uso</SelectItem>
                        <SelectItem value="Guia">Guia</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nivel">Nível *</Label>
                    <Select 
                      value={formData.nivel} 
                      onValueChange={(value) => setFormData({ ...formData, nivel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos os níveis">Todos os níveis</SelectItem>
                        <SelectItem value="Iniciante">Iniciante</SelectItem>
                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fonte">Fonte *</Label>
                  <Input
                    id="fonte"
                    value={formData.fonte}
                    onChange={(e) =>
                      setFormData({ ...formData, fonte: e.target.value })
                    }
                    required
                    placeholder="Ex: Towards Data Science, Medium, Blog pessoal"
                  />
                </div>

                <div>
                  <Label htmlFor="autor_original">Autor Original *</Label>
                  <Input
                    id="autor_original"
                    value={formData.autor_original}
                    onChange={(e) =>
                      setFormData({ ...formData, autor_original: e.target.value })
                    }
                    required
                    placeholder="Nome do autor do conteúdo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tempo_leitura">Tempo de Leitura</Label>
                    <Input
                      id="tempo_leitura"
                      value={formData.tempo_leitura}
                      onChange={(e) =>
                        setFormData({ ...formData, tempo_leitura: e.target.value })
                      }
                      placeholder="Ex: 5 min (opcional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="data">Data de Publicação *</Label>
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
                </div>

                <div>
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="NLP, ChatGPT, LangChain"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destaque"
                    checked={formData.destaque}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, destaque: checked as boolean })
                    }
                  />
                  <Label htmlFor="destaque" className="cursor-pointer">
                    Marcar como Destaque
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  {formData.id ? "Atualizar" : "Criar"} Post
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post: any) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.titulo}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary">
                      {post.categoria}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.nivel}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.fonte}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(post.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {post.destaque && (
                      <span className="text-primary text-xs">★</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
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

export default AdminBlog;
