import { useState } from "react";
import { useEventos } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const AdminEventos = () => {
  usePageTitle("Admin - Eventos");
  const { data: eventos = [], isLoading } = useEventos();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    descricao: "",
    data: "",
    local: "",
    tipo: "Conferência",
    nivel: "Intermediário",
    banner: "",
    link: "",
    organizador: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { id, ...data } = formData;

      let result;
      if (id) {
        // Update
        result = await supabase.from("eventos").update(data).eq("id", id);
      } else {
        // Insert
        result = await supabase.from("eventos").insert([data]);
      }

      if (result.error) {
        throw result.error;
      }

      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      setDialogOpen(false);
      resetForm();
      
      toast({
        title: "Sucesso!",
        description: id ? "Evento atualizado com sucesso." : "Evento criado com sucesso.",
      });
    } catch (error: any) {
      console.error("Error saving evento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao salvar evento. Verifique se as políticas do banco foram configuradas.",
      });
    }
  };

  const handleEdit = (evento: any) => {
    setFormData({
      id: evento.id,
      titulo: evento.titulo,
      descricao: evento.descricao,
      data: evento.data,
      local: evento.local,
      tipo: evento.tipo,
      nivel: evento.nivel || "Intermediário",
      banner: evento.banner,
      link: evento.link || "",
      organizador: evento.organizador || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        const { error } = await supabase.from("eventos").delete().eq("id", id);
        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ["eventos"] });
        toast({
          title: "Sucesso!",
          description: "Evento excluído com sucesso.",
        });
      } catch (error: any) {
        console.error("Error deleting evento:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Erro ao excluir evento.",
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
      local: "",
      tipo: "Conferência",
      nivel: "Intermediário",
      banner: "",
      link: "",
      organizador: "",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie os eventos de IA do seu site
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "Editar Evento" : "Novo Evento"}
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
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data">Data *</Label>
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
                  <Label htmlFor="local">Local *</Label>
                  <Input
                    id="local"
                    value={formData.local}
                    onChange={(e) =>
                      setFormData({ ...formData, local: e.target.value })
                    }
                    placeholder="São Paulo, SP ou Online"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conferência">Conferência</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Hackathon">Hackathon</SelectItem>
                      <SelectItem value="Meetup">Meetup</SelectItem>
                      <SelectItem value="Webinar">Webinar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nivel">Nível</Label>
                  <Select
                    value={formData.nivel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, nivel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="banner">URL do Banner *</Label>
                <Input
                  id="banner"
                  type="url"
                  value={formData.banner}
                  onChange={(e) =>
                    setFormData({ ...formData, banner: e.target.value })
                  }
                  placeholder="https://example.com/banner.jpg"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recomendado: 800x400px (proporção 2:1)
                </p>
              </div>

              <div>
                <Label htmlFor="organizador">Organizador</Label>
                <Input
                  id="organizador"
                  value={formData.organizador}
                  onChange={(e) =>
                    setFormData({ ...formData, organizador: e.target.value })
                  }
                  placeholder="Nome da empresa ou organização"
                />
              </div>

              <div>
                <Label htmlFor="link">Link de Inscrição</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://example.com/inscricao"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {formData.id ? "Atualizar" : "Criar"} Evento
                </Button>
              </div>
            </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Carregando eventos...</p>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum evento cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                eventos.map((evento: any) => (
                  <TableRow key={evento.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {evento.titulo}
                        {evento.link && (
                          <a
                            href={evento.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                            title="Ver link do evento"
                            aria-label="Ver link do evento"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(evento.data)}</TableCell>
                    <TableCell>{evento.local}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        {evento.tipo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                        {evento.nivel}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(evento)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(evento.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminEventos;
