import { useState, useMemo } from "react";
import { Book, ChevronRight, Search, Map, ArrowDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import MarkdownRenderer from "@/components/MarkdownRenderer";
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

  const areas = Object.keys(conceitosGrouped).sort();

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
            <Map className="mr-2 h-4 w-4" />
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
            {/* Sidebar - Lista de conceitos */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                {/* Áreas e Conceitos */}
                <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                  <Accordion type="multiple" defaultValue={areas} className="w-full">
                    {areas.map((area) => (
                      <AccordionItem key={area} value={area}>
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-semibold text-sm">{area}</span>
                            <Badge variant="secondary" className="ml-auto">
                              {Object.values(conceitosGrouped[area]).flat().length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-2">
                          {/* Conceitos sem subarea */}
                          {conceitosGrouped[area][""]?.length > 0 && (
                            <div className="space-y-1 mb-1">
                              {conceitosGrouped[area][""].map((conceito) => (
                                <button
                                  key={conceito.id}
                                  onClick={() => setSelectedConceito(conceito)}
                                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    selectedConceito?.id === conceito.id
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {conceito.titulo}
                                </button>
                              ))}
                            </div>
                          )}
                          {/* Subareas */}
                          {Object.entries(conceitosGrouped[area])
                            .filter(([sub]) => sub !== "")
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([subarea, items]) => (
                              <div key={subarea} className="mt-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-1 border-t border-border/50 pt-2">
                                  {subarea}
                                </p>
                                <div className="space-y-1">
                                  {items.map((conceito) => (
                                    <button
                                      key={conceito.id}
                                      onClick={() => setSelectedConceito(conceito)}
                                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                        selectedConceito?.id === conceito.id
                                          ? "bg-primary text-primary-foreground"
                                          : "hover:bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {conceito.titulo}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>

            {/* Conteúdo - Conceito selecionado */}
            <div className="lg:col-span-2">
              {selectedConceito ? (
                <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                  {/* Header do conceito */}
                  <div className="mb-6 border-b border-border pb-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className="bg-primary/10 text-primary border-primary/20">{selectedConceito.area}</Badge>
                      {selectedConceito.subarea && (
                        <Badge variant="outline" className="text-xs">{selectedConceito.subarea}</Badge>
                      )}
                      {selectedConceito.nivel && (() => {
                        const nivelStyles = getNivelStyles(selectedConceito.nivel);
                        return (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${nivelStyles.bg} ${nivelStyles.text}`}>
                            {selectedConceito.nivel}
                          </span>
                        );
                      })()}
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">
                      {selectedConceito.titulo}
                    </h1>
                    {selectedConceito.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedConceito.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Conteúdo em Markdown */}
                  {console.log('Conceito:', selectedConceito.titulo, 'Tamanho:', selectedConceito.conteudo.length, 'chars')}
                  <MarkdownRenderer content={selectedConceito.conteudo} />
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg shadow-sm p-12 text-center">
                  <Book className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Selecione um conceito na barra lateral para visualizar
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
              <Map className="w-8 h-8 text-primary" />
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
