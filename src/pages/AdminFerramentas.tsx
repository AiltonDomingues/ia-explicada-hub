import { useState } from "react";
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
import { Plus, Pencil, Trash2, Search, Filter, ExternalLink } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { categorias } from "@/data/ferramentas";

const AdminFerramentas = () => {
  usePageTitle("Admin - Ferramentas");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("all");
  const [precoFilter, setPrecoFilter] = useState("all");
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    descricao: "",
    categoria: "",
    preco: "Freemium" as "Gratuito" | "Freemium" | "Pago" | "Trial Grátis",
    url: "",
    logo: "",
    tags: "",
    verificada: false,
    destaque: false,
    ranking: "",
  });

  // Query para buscar ferramentas
  const { data: ferramentas = [], isLoading } = useQuery({
    queryKey: ["ferramentas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ferramentas")
        .select("*")
        .order("categoria", { ascending: true })
        .order("ranking", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Filtrar ferramentas
  const filteredFerramentas = ferramentas.filter((f: any) => {
    const matchSearch = f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       f.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFilter === "all" || f.categoria === categoriaFilter;
    const matchPreco = precoFilter === "all" || f.preco === precoFilter;
    return matchSearch && matchCategoria && matchPreco;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { id, tags, ranking, ...data } = formData as any;
      const tagsArray = tags.split(",").map((tag: string) => tag.trim()).filter((t: string) => t);
      const rankingNum = ranking ? parseInt(ranking) : null;

      let result;
      if (id) {
        result = await supabase
          .from("ferramentas")
          .update({ ...data, tags: tagsArray, ranking: rankingNum })
          .eq("id", id);
      } else {
        // Gerar ID único
        const newId = `${data.nome.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
        result = await supabase
          .from("ferramentas")
          .insert([{ ...data, id: newId, tags: tagsArray, ranking: rankingNum }]);
      }

      if (result.error) throw result.error;

      queryClient.invalidateQueries({ queryKey: ["ferramentas"] });
      setDialogOpen(false);
      resetForm();

      toast({
        title: "Sucesso!",
        description: id ? "Ferramenta atualizada com sucesso." : "Ferramenta criada com sucesso.",
      });
    } catch (error: any) {
      console.error("Error saving ferramenta:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao salvar ferramenta.",
      });
    }
  };

  const handleEdit = (ferramenta: any) => {
    setFormData({
      ...ferramenta,
      tags: ferramenta.tags?.join(", ") || "",
      ranking: ferramenta.ranking?.toString() || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta ferramenta?")) {
      try {
        const { error } = await supabase.from("ferramentas").delete().eq("id", id);
        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ["ferramentas"] });
        
        toast({
          title: "Sucesso!",
          description: "Ferramenta excluída com sucesso.",
        });
      } catch (error: any) {
        console.error("Error deleting ferramenta:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Erro ao excluir ferramenta.",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      nome: "",
      descricao: "",
      categoria: "",
      preco: "Freemium",
      url: "",
      logo: "",
      tags: "",
      verificada: false,
      destaque: false,
      ranking: "",
    });
  };

  const handleNewFerramenta = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando ferramentas...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ferramentas IA</h1>
          <p className="text-muted-foreground">
            {filteredFerramentas.length} de {ferramentas.length} ferramentas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewFerramenta}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Ferramenta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "Editar Ferramenta" : "Nova Ferramenta"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.nome} value={cat.nome}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preco">Preço *</Label>
                  <Select
                    value={formData.preco}
                    onValueChange={(value: any) => setFormData({ ...formData, preco: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gratuito">Gratuito</SelectItem>
                      <SelectItem value="Freemium">Freemium</SelectItem>
                      <SelectItem value="Pago">Pago</SelectItem>
                      <SelectItem value="Trial Grátis">Trial Grátis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ranking">Ranking (opcional)</Label>
                  <Input
                    id="ranking"
                    type="number"
                    value={formData.ranking}
                    onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                    placeholder="Ex: 1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="logo">Logo URL (opcional)</Label>
                <Input
                  id="logo"
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="ia, texto, imagem"
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verificada"
                    checked={formData.verificada}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, verificada: checked as boolean })
                    }
                  />
                  <Label htmlFor="verificada">Verificada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destaque"
                    checked={formData.destaque}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, destaque: checked as boolean })
                    }
                  />
                  <Label htmlFor="destaque">Destaque</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {formData.id ? "Atualizar" : "Criar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ferramentas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.nome} value={cat.nome}>
                {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={precoFilter} onValueChange={setPrecoFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Preço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos preços</SelectItem>
            <SelectItem value="Gratuito">Gratuito</SelectItem>
            <SelectItem value="Freemium">Freemium</SelectItem>
            <SelectItem value="Pago">Pago</SelectItem>
            <SelectItem value="Trial Grátis">Trial Grátis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFerramentas.map((ferramenta: any) => (
              <TableRow key={ferramenta.id}>
                <TableCell className="font-medium">
                  {ferramenta.ranking || "-"}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{ferramenta.nome}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {ferramenta.descricao}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{ferramenta.categoria}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ferramenta.preco}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {ferramenta.verificada && (
                      <Badge variant="default" className="text-xs">Verificada</Badge>
                    )}
                    {ferramenta.destaque && (
                      <Badge variant="secondary" className="text-xs">Destaque</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(ferramenta.url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(ferramenta)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ferramenta.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredFerramentas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma ferramenta encontrada com os filtros atuais.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminFerramentas;
