import { useState } from "react";
import { useCursos } from "@/hooks/useSupabase";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const AdminCursos = () => {
  usePageTitle("Admin - Cursos");
  const { data: cursos = [], isLoading } = useCursos();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    instrutor: "",
    descricao: "",
    nivel: "",
    duracao: "",
    preco: "",
    link: "",
    plataforma: "",
    nota: "",
    categoria: "Fundamentos",
    destaque: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { id, ...data } = formData;

      let result;
      if (id) {
        result = await supabase.from("cursos").update(data).eq("id", id);
      } else {
        result = await supabase.from("cursos").insert([data]);
      }

      if (result.error) throw result.error;

      queryClient.invalidateQueries({ queryKey: ["cursos"] });
      setDialogOpen(false);
      resetForm();
      
      toast({
        title: "Sucesso!",
        description: id ? "Curso atualizado com sucesso." : "Curso criado com sucesso.",
      });
    } catch (error: any) {
      console.error("Error saving curso:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao salvar curso. Verifique se as políticas do banco foram configuradas.",
      });
    }
  };

  const handleEdit = (curso: any) => {
    setFormData(curso);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      try {
        const { error } = await supabase.from("cursos").delete().eq("id", id);
        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ["cursos"] });
        toast({
          title: "Sucesso!",
          description: "Curso excluído com sucesso.",
        });
      } catch (error: any) {
        console.error("Error deleting curso:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Erro ao excluir curso.",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      titulo: "",
      instrutor: "",
      descricao: "",
      nivel: "",
      duracao: "",
      preco: "",
      link: "",
      plataforma: "",
      nota: "",
      categoria: "Fundamentos",
      destaque: false,
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Cursos</h1>
          <p className="text-muted-foreground">Gerencie os cursos do seu site</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "Editar Curso" : "Novo Curso"}
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
                <Label htmlFor="instrutor">Instrutor</Label>
                <Input
                  id="instrutor"
                  value={formData.instrutor}
                  onChange={(e) =>
                    setFormData({ ...formData, instrutor: e.target.value })
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
                <Label htmlFor="nivel">Nível</Label>
                <Select
                  value={formData.nivel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, nivel: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iniciante">Iniciante</SelectItem>
                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                    <SelectItem value="Avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duracao">Duração</Label>
                <Input
                  id="duracao"
                  value={formData.duracao}
                  onChange={(e) =>
                    setFormData({ ...formData, duracao: e.target.value })
                  }
                  placeholder="ex: 8 semanas"
                  required
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço</Label>
                <Input
                  id="preco"
                  value={formData.preco}
                  onChange={(e) =>
                    setFormData({ ...formData, preco: e.target.value })
                  }
                  placeholder="ex: Gratuito ou R$ 99"
                  required
                />
              </div>
              <div>
                <Label htmlFor="link">Link do Curso</Label>
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
                <Label htmlFor="plataforma">Plataforma</Label>
                <Input
                  id="plataforma"
                  value={formData.plataforma}
                  onChange={(e) =>
                    setFormData({ ...formData, plataforma: e.target.value })
                  }
                  placeholder="Ex: Udemy, Coursera, edX"
                />
              </div>
              <div>
                <Label htmlFor="nota">Nota</Label>
                <Input
                  id="nota"
                  value={formData.nota}
                  onChange={(e) =>
                    setFormData({ ...formData, nota: e.target.value })
                  }
                  placeholder="Ex: 4.8/5.0"
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoria: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fundamentos">Fundamentos</SelectItem>
                    <SelectItem value="IA Generativa">IA Generativa</SelectItem>
                    <SelectItem value="Agentes de IA">Agentes de IA</SelectItem>
                    <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    <SelectItem value="Processamento de Linguagem">Processamento de Linguagem</SelectItem>
                    <SelectItem value="Visão Computacional">Visão Computacional</SelectItem>
                  </SelectContent>
                </Select>
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
      ) : cursos.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-xl">
          <p className="text-muted-foreground mb-4">
            Nenhum curso cadastrado ainda
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Curso
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Instrutor</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursos.map((curso) => (
                <TableRow key={curso.id}>
                  <TableCell className="font-medium">{curso.titulo}</TableCell>
                  <TableCell>{curso.instrutor}</TableCell>
                  <TableCell>{curso.nivel}</TableCell>
                  <TableCell>{curso.preco}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(curso)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(curso.id)}
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

export default AdminCursos;
