import { useState, useMemo } from "react";
import { Book, ChevronRight, Search, Map as MapIcon, ArrowDown, Circle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import MateriaisComplementares from "@/components/MateriaisComplementares";
import RoadmapCard from "@/components/RoadmapCard";
import { useConceitos } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Conceito } from "@/lib/supabase";
import { roadmaps } from "@/data/roadmaps";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

const ConceitosPage = () => {
  usePageTitle("Conceitos");
  const { data: conceitos = [], isLoading } = useConceitos();
  const [searchQuery, setSearchQuery] = useState("");
  const [nivelFilter, setNivelFilter] = useState("Todos os Níveis");
  const [selectedConceito, setSelectedConceito] = useState<Conceito | null>(null);

  const niveis = ["Todos os Níveis", ...Array.from(new Set(conceitos.filter(c => c.nivel).map(c => c.nivel!)))];

  // Filtrar conceitos (flat) por busca e nível
  const filteredFlat = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return conceitos.filter((c) => {
      const matchSearch = !searchQuery.trim() ||
        c.titulo.toLowerCase().includes(query) ||
        c.area.toLowerCase().includes(query) ||
        (c.subarea?.toLowerCase().includes(query) ?? false) ||
        c.conteudo.toLowerCase().includes(query) ||
        c.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchNivel = nivelFilter === "Todos os Níveis" || c.nivel === nivelFilter;
      return matchSearch && matchNivel;
    });
  }, [conceitos, searchQuery, nivelFilter]);

  // Agrupar em 2 níveis: area → subarea → conceitos
  const conceitosGrouped = useMemo(() => {
    const groups: Record<string, Record<string, Conceito[]>> = {};
    filteredFlat.forEach((c) => {
      if (!groups[c.area]) groups[c.area] = {};
      const sub = c.subarea || "";
      if (!groups[c.area][sub]) groups[c.area][sub] = [];
      groups[c.area][sub].push(c);
    });
    return groups;
  }, [filteredFlat]);

  const areas = useMemo(() => {
    const areasMap = new Map<string, number>();

    filteredFlat.forEach((conceito) => {
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
      })
      .map(({ area }) => area);
  }, [filteredFlat]);

  const getOrderedSubareas = (area: string) => {
    const subareas = conceitosGrouped[area] || {};
    const subareasMap = new Map<string, number>();

    Object.entries(subareas).forEach(([subarea, items]) => {
      if (items.length > 0) {
        subareasMap.set(subarea, items[0].ordem_subarea ?? 0);
      }
    });

    return Array.from(subareasMap.entries())
      .filter(([subarea]) => subarea !== "")
      .map(([subarea, ordem]) => ({ subarea, ordem }))
      .sort((a, b) => {
        if (a.ordem !== b.ordem) {
          return a.ordem - b.ordem;
        }
        return a.subarea.localeCompare(b.subarea);
      })
      .map(({ subarea }) => subarea);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Conceitos de"
        highlight="IA & ML"
        subtitle="Explore conceitos fundamentais de Inteligência Artificial e Machine Learning organizados por área de conhecimento"
      />

      {/* Busca e Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar conceitos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <Select value={nivelFilter} onValueChange={setNivelFilter}>
              <SelectTrigger className="w-[220px] bg-card border-border">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                {niveis.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              const roadmapsSection = document.getElementById('roadmaps');
              if (roadmapsSection) {
                roadmapsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            variant="outline"
            className="w-full sm:w-auto whitespace-nowrap"
          >
            <MapIcon className="mr-2 h-4 w-4" />
            Ver Roadmaps
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Encontrados <span className="text-primary font-bold">{filteredFlat.length}</span> conceitos
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : conceitos.length === 0 ? (
          <div className="text-center py-12">
            <Book className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              Nenhum conceito disponível ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Lista hierárquica de conceitos */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      Índice de Conceitos
                    </h3>
                  </div>
                  <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
                    <Accordion type="multiple" defaultValue={areas} className="w-full">
                      {areas.map((area) => {
                        const totalConceitos = Object.values(conceitosGrouped[area]).flat().length;
                        const subareas = getOrderedSubareas(area);
                        const conceitosSemSubarea = conceitosGrouped[area][""] || [];

                        return (
                          <AccordionItem key={area} value={area} className="border-b border-border/50">
                            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline group">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                                    {area}
                                  </span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {totalConceitos}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-0">
                              {/* Se há subáreas, usar accordion aninhado */}
                              {subareas.length > 0 ? (
                                <Accordion type="multiple" className="pl-2">
                                  {/* Conceitos sem subárea primeiro */}
                                  {conceitosSemSubarea.length > 0 && (
                                    <div className="pb-2 border-b border-border/30">
                                      <div className="space-y-1 px-2">
                                        {conceitosSemSubarea
                                          .sort((a, b) => a.ordem - b.ordem)
                                          .map((conceito) => (
                                            <button
                                              key={conceito.id}
                                              onClick={() => setSelectedConceito(conceito)}
                                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                                                selectedConceito?.id === conceito.id
                                                  ? "bg-primary text-primary-foreground shadow-sm"
                                                  : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                              }`}
                                            >
                                              <div className="flex items-center gap-2">
                                                <Circle className="w-1 h-1 flex-shrink-0 fill-current opacity-60" />
                                                <span className="flex-1">{conceito.titulo}</span>
                                                {conceito.nivel && (
                                                  <span className={`text-xs px-1.5 py-0.5 rounded ${getNivelStyles(conceito.nivel).bg} ${getNivelStyles(conceito.nivel).text}`}>
                                                    {conceito.nivel.charAt(0)}
                                                  </span>
                                                )}
                                              </div>
                                            </button>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                  {/* Subáreas */}
                                  {subareas.map((subarea) => {
                                    const items = conceitosGrouped[area][subarea] || [];

                                    return (
                                    <AccordionItem
                                      key={`${area}-${subarea}`}
                                      value={`${area}-${subarea}`}
                                      className="border-0"
                                    >
                                      <AccordionTrigger className="px-3 py-2 hover:bg-muted/50 hover:no-underline text-sm">
                                        <div className="flex items-center gap-2 flex-1">
                                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                          <span className="font-medium text-muted-foreground">
                                            {subarea}
                                          </span>
                                          <Badge variant="outline" className="text-xs ml-auto">
                                            {items.length}
                                          </Badge>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="pb-2">
                                        <div className="space-y-1 pl-4">
                                          {items
                                            .sort((a, b) => a.ordem - b.ordem)
                                            .map((conceito) => (
                                              <button
                                                key={conceito.id}
                                                onClick={() => setSelectedConceito(conceito)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                                                  selectedConceito?.id === conceito.id
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                                }`}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Circle className="w-1 h-1 flex-shrink-0 fill-current opacity-60" />
                                                  <span className="flex-1">{conceito.titulo}</span>
                                                  {conceito.nivel && (
                                                    <span className={`text-xs px-1.5 py-0.5 rounded ${getNivelStyles(conceito.nivel).bg} ${getNivelStyles(conceito.nivel).text}`}>
                                                      {conceito.nivel.charAt(0)}
                                                    </span>
                                                  )}
                                                </div>
                                              </button>
                                            ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                    );
                                  })}
                                </Accordion>
                              ) : (
                                // Se não há subáreas, mostrar conceitos direto
                                <div className="space-y-1 px-2 pb-2">
                                  {conceitosSemSubarea
                                    .sort((a, b) => a.ordem - b.ordem)
                                    .map((conceito) => (
                                      <button
                                        key={conceito.id}
                                        onClick={() => setSelectedConceito(conceito)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                                          selectedConceito?.id === conceito.id
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                            <Circle className="w-1 h-1 flex-shrink-0 fill-current opacity-60" />
                                          <span className="flex-1">{conceito.titulo}</span>
                                          {conceito.nivel && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${getNivelStyles(conceito.nivel).bg} ${getNivelStyles(conceito.nivel).text}`}>
                                              {conceito.nivel.charAt(0)}
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    ))}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo - Conceito selecionado */}
            <div className="lg:col-span-2">
              {selectedConceito ? (
                <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  {/* Header do conceito com gradiente */}
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge className="bg-primary/20 text-primary border-primary/30 font-medium">
                        {selectedConceito.area}
                      </Badge>
                      {selectedConceito.subarea && (
                        <>
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs font-medium">
                            {selectedConceito.subarea}
                          </Badge>
                        </>
                      )}
                      {selectedConceito.nivel && (() => {
                        const nivelStyles = getNivelStyles(selectedConceito.nivel);
                        return (
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium ml-auto ${nivelStyles.bg} ${nivelStyles.text} ${nivelStyles.border}`}
                          >
                            {selectedConceito.nivel}
                          </Badge>
                        );
                      })()}
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">
                      {selectedConceito.titulo}
                    </h1>
                  </div>

                  {/* Conteúdo em Markdown */}
                  <div className="p-6">
                    <MarkdownRenderer content={selectedConceito.conteudo} />
                    
                    {/* Materiais Complementares */}
                    {selectedConceito.materiais_complementares && (
                      <MateriaisComplementares materiais={selectedConceito.materiais_complementares} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg shadow-lg p-12 text-center">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Book className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Selecione um Conceito
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Navegue pela barra lateral e escolha um conceito para visualizar seu conteúdo completo
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Seção de Roadmaps */}
      <div id="roadmaps" className="bg-muted/30 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapIcon className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">
                Roadmaps de <span className="text-primary">Aprendizado</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Guias estruturados para sua jornada em IA. Siga o caminho do iniciante ao avançado em cada área
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {roadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ConceitosPage;
