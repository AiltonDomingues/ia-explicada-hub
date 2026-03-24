import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, Save, X, ChevronRight, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingConceito, setEditingConceito] = useState<Conceito | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewConceito, setPreviewConceito] = useState<Conceito | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    area: "",
    subarea: "",
    conteudo: "",
    tags: "",
    ordem: 0,
    nivel: "Intermediário",
    materiais_complementares: [] as Array<{
      titulo: string;
      url: string;
      tipo: "video" | "artigo" | "curso" | "documentacao" | "outro";
    }>,
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
        subarea: data.subarea || null,
        conteudo: data.conteudo,
        slug,
        tags: tagsArray,
        ordem: data.ordem,
        nivel: data.nivel,
        materiais_complementares: data.materiais_complementares || null,
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

  // Mutation para reordenar conceitos
  const reorderMutation = useMutation({
    mutationFn: async ({ conceito1, conceito2 }: { conceito1: Conceito; conceito2: Conceito }) => {
      const ordem1 = conceito1.ordem;
      const ordem2 = conceito2.ordem;

      // Troca as ordens
      const { error: error1 } = await supabase
        .from("conceitos")
        .update({ ordem: ordem2 })
        .eq("id", conceito1.id);
      
      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from("conceitos")
        .update({ ordem: ordem1 })
        .eq("id", conceito2.id);
      
      if (error2) throw error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conceitos"] });
      toast({
        title: "Ordem atualizada",
        description: "A ordem dos conceitos foi alterada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao reordenar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para reordenar áreas
  const reorderAreaMutation = useMutation({
    mutationFn: async ({ area, novaOrdem }: { area: string; novaOrdem: number }) => {
      const { error } = await supabase
        .from("conceitos")
        .update({ ordem_area: novaOrdem })
        .eq("area", area);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conceitos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao reordenar área",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para reordenar subáreas
  const reorderSubareaMutation = useMutation({
    mutationFn: async ({ area, subarea, novaOrdem }: { area: string; subarea: string; novaOrdem: number }) => {
      const { error } = await supabase
        .from("conceitos")
        .update({ ordem_subarea: novaOrdem })
        .eq("area", area)
        .eq("subarea", subarea);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conceitos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao reordenar subárea",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      area: "",
      subarea: "",
      conteudo: "",
      tags: "",
      ordem: 0,
      nivel: "Intermediário",
      materiais_complementares: [],
    });
    setEditingConceito(null);
  };

  const handleEdit = (conceito: Conceito) => {
    setEditingConceito(conceito);
    setFormData({
      titulo: conceito.titulo,
      area: conceito.area,
      subarea: conceito.subarea || "",
      conteudo: conceito.conteudo,
      tags: conceito.tags.join(", "),
      ordem: conceito.ordem,
      nivel: conceito.nivel || "Intermediário",
      materiais_complementares: conceito.materiais_complementares || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePreview = (conceito: Conceito) => {
    setPreviewConceito(conceito);
    setIsPreviewDialogOpen(true);
  };

  const handleMoveUp = (conceito: Conceito, conceitosSubarea: Conceito[]) => {
    const sortedConceitos = [...conceitosSubarea].sort((a, b) => a.ordem - b.ordem);
    const currentIndex = sortedConceitos.findIndex((c) => c.id === conceito.id);
    
    if (currentIndex > 0) {
      const previousConceito = sortedConceitos[currentIndex - 1];
      reorderMutation.mutate({ conceito1: conceito, conceito2: previousConceito });
    }
  };

  const handleMoveDown = (conceito: Conceito, conceitosSubarea: Conceito[]) => {
    const sortedConceitos = [...conceitosSubarea].sort((a, b) => a.ordem - b.ordem);
    const currentIndex = sortedConceitos.findIndex((c) => c.id === conceito.id);
    
    if (currentIndex < sortedConceitos.length - 1) {
      const nextConceito = sortedConceitos[currentIndex + 1];
      reorderMutation.mutate({ conceito1: conceito, conceito2: nextConceito });
    }
  };

  const handleMoveAreaUp = async (area: string, areasComOrdem: Array<{ area: string; ordem: number }>) => {
    const currentIndex = areasComOrdem.findIndex(a => a.area === area);
    if (currentIndex > 0) {
      const areaAtual = areasComOrdem[currentIndex];
      const areaAnterior = areasComOrdem[currentIndex - 1];
      
      // Troca as ordens
      await Promise.all([
        reorderAreaMutation.mutateAsync({ area: areaAtual.area, novaOrdem: areaAnterior.ordem }),
        reorderAreaMutation.mutateAsync({ area: areaAnterior.area, novaOrdem: areaAtual.ordem }),
      ]);
      
      toast({
        title: "Área movida",
        description: `"${area}" foi movida para cima`,
      });
    }
  };

  const handleMoveAreaDown = async (area: string, areasComOrdem: Array<{ area: string; ordem: number }>) => {
    const currentIndex = areasComOrdem.findIndex(a => a.area === area);
    if (currentIndex < areasComOrdem.length - 1) {
      const areaAtual = areasComOrdem[currentIndex];
      const areaProxima = areasComOrdem[currentIndex + 1];
      
      // Troca as ordens
      await Promise.all([
        reorderAreaMutation.mutateAsync({ area: areaAtual.area, novaOrdem: areaProxima.ordem }),
        reorderAreaMutation.mutateAsync({ area: areaProxima.area, novaOrdem: areaAtual.ordem }),
      ]);
      
      toast({
        title: "Área movida",
        description: `"${area}" foi movida para baixo`,
      });
    }
  };

  const handleMoveSubareaUp = async (area: string, subarea: string, subareasComOrdem: Array<{ subarea: string; ordem: number }>) => {
    const currentIndex = subareasComOrdem.findIndex(s => s.subarea === subarea);
    if (currentIndex > 0) {
      const subareaAtual = subareasComOrdem[currentIndex];
      const subareaAnterior = subareasComOrdem[currentIndex - 1];
      
      // Troca as ordens
      await Promise.all([
        reorderSubareaMutation.mutateAsync({ area, subarea: subareaAtual.subarea, novaOrdem: subareaAnterior.ordem }),
        reorderSubareaMutation.mutateAsync({ area, subarea: subareaAnterior.subarea, novaOrdem: subareaAtual.ordem }),
      ]);
      
      toast({
        title: "Subárea movida",
        description: `"${subarea}" foi movida para cima`,
      });
    }
  };

  const handleMoveSubareaDown = async (area: string, subarea: string, subareasComOrdem: Array<{ subarea: string; ordem: number }>) => {
    const currentIndex = subareasComOrdem.findIndex(s => s.subarea === subarea);
    if (currentIndex < subareasComOrdem.length - 1) {
      const subareaAtual = subareasComOrdem[currentIndex];
      const subareaProxima = subareasComOrdem[currentIndex + 1];
      
      // Troca as ordens
      await Promise.all([
        reorderSubareaMutation.mutateAsync({ area, subarea: subareaAtual.subarea, novaOrdem: subareaProxima.ordem }),
        reorderSubareaMutation.mutateAsync({ area, subarea: subareaProxima.subarea, novaOrdem: subareaAtual.ordem }),
      ]);
      
      toast({
        title: "Subárea movida",
        description: `"${subarea}" foi movida para baixo`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  // Agrupar conceitos em hierarquia: área → subárea → conceitos
  const hierarquia = useMemo(() => {
    const resultado: Record<string, Record<string, Conceito[]>> = {};
    
    conceitos.forEach((conceito) => {
      const area = conceito.area;
      const subarea = conceito.subarea || "Sem Subárea";
      
      if (!resultado[area]) {
        resultado[area] = {};
      }
      if (!resultado[area][subarea]) {
        resultado[area][subarea] = [];
      }
      resultado[area][subarea].push(conceito);
    });
    
    return resultado;
  }, [conceitos]);

  // Ordenar áreas com base no campo ordem_area
  const areasComOrdem = useMemo(() => {
    const areasMap = new Map<string, number>();
    
    conceitos.forEach((conceito) => {
      if (!areasMap.has(conceito.area)) {
        areasMap.set(conceito.area, conceito.ordem_area ?? 0);
      }
    });
    
    return Array.from(areasMap.entries())
      .map(([area, ordem]) => ({ area, ordem }))
      .sort((a, b) => {
        if (a.ordem !== b.ordem) {
          return a.ordem - b.ordem;
        }
        return a.area.localeCompare(b.area);
      });
  }, [conceitos]);

  // Função para ordenar subáreas com base no campo ordem_subarea
  const getSubareasComOrdem = (area: string, subareas: Record<string, Conceito[]>) => {
    const subareasMap = new Map<string, number>();
    
    Object.entries(subareas).forEach(([subarea, conceitosSubarea]) => {
      if (conceitosSubarea.length > 0) {
        subareasMap.set(subarea, conceitosSubarea[0].ordem_subarea ?? 0);
      }
    });
    
    return Array.from(subareasMap.entries())
      .map(([subarea, ordem]) => ({ subarea, ordem }))
      .sort((a, b) => {
        // "Sem Subárea" vai para o final
        if (a.subarea === "Sem Subárea") return 1;
        if (b.subarea === "Sem Subárea") return -1;
        
        if (a.ordem !== b.ordem) {
          return a.ordem - b.ordem;
        }
        return a.subarea.localeCompare(b.subarea);
      });
  };

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

      {/* Hierarquia expansível: Área → Subárea → Conceitos */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : conceitos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Nenhum conceito cadastrado</p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {areasComOrdem.map((areaInfo, areaIndex) => {
            const area = areaInfo.area;
            const subareas = hierarquia[area];
            const totalConceitos = Object.values(subareas).flat().length;
            const isFirstArea = areaIndex === 0;
            const isLastArea = areaIndex === areasComOrdem.length - 1;
            
            return (
              <AccordionItem
                key={area}
                value={area}
                className="border border-border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 bg-muted hover:bg-muted/80 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      {/* Botões de reordenamento de área */}
                      <div className="flex flex-col gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveAreaUp(area, areasComOrdem);
                          }}
                          disabled={isFirstArea || reorderAreaMutation.isPending}
                          title="Mover área para cima"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveAreaDown(area, areasComOrdem);
                          }}
                          disabled={isLastArea || reorderAreaMutation.isPending}
                          title="Mover área para baixo"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <h2 className="font-semibold text-lg">{area}</h2>
                      <Badge variant="secondary" className="text-xs">
                        {totalConceitos} {totalConceitos === 1 ? 'conceito' : 'conceitos'}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <Accordion type="multiple" className="divide-y divide-border">
                    {getSubareasComOrdem(area, subareas).map((subareaInfo, subareaIndex) => {
                      const subarea = subareaInfo.subarea;
                      const conceitosSubarea = subareas[subarea];
                      const subareasComOrdem = getSubareasComOrdem(area, subareas);
                      const isFirstSubarea = subareaIndex === 0;
                      const isLastSubarea = subareaIndex === subareasComOrdem.length - 1;
                      
                      return (
                        <AccordionItem
                          key={`${area}-${subarea}`}
                          value={`${area}-${subarea}`}
                          className="border-0"
                        >
                          <AccordionTrigger className="px-4 py-2.5 hover:bg-muted/50 hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-2">
                                {/* Botões de reordenamento de subárea */}
                                {subarea !== "Sem Subárea" && (
                                  <div className="flex flex-col gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveSubareaUp(area, subarea, subareasComOrdem);
                                      }}
                                      disabled={isFirstSubarea || reorderSubareaMutation.isPending}
                                      title="Mover subárea para cima"
                                    >
                                      <ArrowUp className="w-2.5 h-2.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveSubareaDown(area, subarea, subareasComOrdem);
                                      }}
                                      disabled={isLastSubarea || reorderSubareaMutation.isPending}
                                      title="Mover subárea para baixo"
                                    >
                                      <ArrowDown className="w-2.5 h-2.5" />
                                    </Button>
                                  </div>
                                )}
                                
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                <h3 className="font-medium text-sm">{subarea}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {conceitosSubarea.length}
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                            <AccordionContent className="p-0">
                              <div className="divide-y divide-border bg-background/50">
                                {conceitosSubarea
                                  .sort((a, b) => a.ordem - b.ordem)
                                  .map((conceito, index) => {
                                    const sortedConceitos = [...conceitosSubarea].sort((a, b) => a.ordem - b.ordem);
                                    const isFirst = index === 0;
                                    const isLast = index === sortedConceitos.length - 1;
                                    
                                    return (
                                      <div
                                        key={conceito.id}
                                        className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors group"
                                      >
                                        {/* Botões de Reordenamento */}
                                        <div className="flex flex-col gap-0.5 pt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 p-0"
                                            onClick={() => handleMoveUp(conceito, conceitosSubarea)}
                                            disabled={isFirst || reorderMutation.isPending}
                                            title="Mover para cima"
                                          >
                                            <ArrowUp className="w-3.5 h-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 p-0"
                                            onClick={() => handleMoveDown(conceito, conceitosSubarea)}
                                            disabled={isLast || reorderMutation.isPending}
                                            title="Mover para baixo"
                                          >
                                            <ArrowDown className="w-3.5 h-3.5" />
                                          </Button>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-sm">{conceito.titulo}</h4>
                                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            {conceito.nivel && (
                                              <Badge
                                                variant="outline"
                                                className={`text-xs ${getNivelStyles(conceito.nivel).bg} ${getNivelStyles(conceito.nivel).text} ${getNivelStyles(conceito.nivel).border}`}
                                              >
                                                {conceito.nivel}
                                              </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                              #{conceito.ordem}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handlePreview(conceito)}
                                            title="Visualizar conteúdo"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleEdit(conceito)}
                                            title="Editar"
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleDelete(conceito.id)}
                                            title="Deletar"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
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

            <div className="space-y-2">
              <Label htmlFor="subarea">
                Subárea <span className="text-muted-foreground text-xs">(opcional)</span>
              </Label>
              <Input
                id="subarea"
                value={formData.subarea}
                onChange={(e) => setFormData({ ...formData, subarea: e.target.value })}
                placeholder="Ex: Álgebra Linear"
              />
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

            {/* Materiais Complementares */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Materiais Complementares</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      materiais_complementares: [
                        ...formData.materiais_complementares,
                        { titulo: "", url: "", tipo: "video" as const },
                      ],
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Material
                </Button>
              </div>
              {formData.materiais_complementares.length > 0 && (
                <div className="space-y-3 border rounded-lg p-4">
                  {formData.materiais_complementares.map((material, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Título do material"
                          value={material.titulo}
                          onChange={(e) => {
                            const updated = [...formData.materiais_complementares];
                            updated[index].titulo = e.target.value;
                            setFormData({ ...formData, materiais_complementares: updated });
                          }}
                        />
                        <Input
                          placeholder="URL completa (https://...)"
                          value={material.url}
                          onChange={(e) => {
                            const updated = [...formData.materiais_complementares];
                            updated[index].url = e.target.value;
                            setFormData({ ...formData, materiais_complementares: updated });
                          }}
                        />
                        <Select
                          value={material.tipo}
                          onValueChange={(value: "video" | "artigo" | "curso" | "documentacao" | "outro") => {
                            const updated = [...formData.materiais_complementares];
                            updated[index].tipo = value;
                            setFormData({ ...formData, materiais_complementares: updated });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position="popper" className="z-[300]">
                            <SelectItem value="video">Vídeo</SelectItem>
                            <SelectItem value="artigo">Artigo</SelectItem>
                            <SelectItem value="curso">Curso</SelectItem>
                            <SelectItem value="documentacao">Documentação</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const updated = formData.materiais_complementares.filter((_, i) => i !== index);
                          setFormData({ ...formData, materiais_complementares: updated });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Dialog de Preview */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{previewConceito?.titulo}</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {previewConceito?.area}{previewConceito?.subarea ? ` › ${previewConceito?.subarea}` : ''}
              </Badge>
              {previewConceito?.nivel && (
                <Badge
                  variant="outline"
                  className={`text-xs ${getNivelStyles(previewConceito.nivel).bg} ${getNivelStyles(previewConceito.nivel).text} ${getNivelStyles(previewConceito.nivel).border}`}
                >
                  {previewConceito.nivel}
                </Badge>
              )}
            </div>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
            {previewConceito && (
              <MarkdownRenderer content={previewConceito.conteudo} />
            )}
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
