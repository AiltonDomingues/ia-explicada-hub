import { useState, useMemo } from "react";
import { Book, ChevronRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useConceitos } from "@/hooks/useSupabase";
import { Conceito } from "@/lib/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ConceitosPage = () => {
  const { data: conceitos = [], isLoading } = useConceitos();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConceito, setSelectedConceito] = useState<Conceito | null>(null);

  // Agrupar conceitos por área
  const conceitosPorArea = useMemo(() => {
    const grupos: Record<string, Conceito[]> = {};
    
    conceitos.forEach((conceito) => {
      if (!grupos[conceito.area]) {
        grupos[conceito.area] = [];
      }
      grupos[conceito.area].push(conceito);
    });

    return grupos;
  }, [conceitos]);

  // Filtrar conceitos por busca
  const conceitosFiltrados = useMemo(() => {
    if (!searchQuery.trim()) return conceitosPorArea;

    const query = searchQuery.toLowerCase();
    const filtrados: Record<string, Conceito[]> = {};

    Object.entries(conceitosPorArea).forEach(([area, conceitosArea]) => {
      const matches = conceitosArea.filter(
        (c) =>
          c.titulo.toLowerCase().includes(query) ||
          c.area.toLowerCase().includes(query) ||
          c.conteudo.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query))
      );

      if (matches.length > 0) {
        filtrados[area] = matches;
      }
    });

    return filtrados;
  }, [conceitosPorArea, searchQuery]);

  const areas = Object.keys(conceitosFiltrados).sort();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Conceitos de"
        highlight="IA & ML"
        subtitle="Explore conceitos fundamentais de Inteligência Artificial e Machine Learning organizados por área de conhecimento"
      />

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
                {/* Busca */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar conceitos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

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
                              {conceitosFiltrados[area].length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-2">
                          <div className="space-y-1">
                            {conceitosFiltrados[area].map((conceito) => (
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
                    <Badge className="mb-2">{selectedConceito.area}</Badge>
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

      <Footer />
    </div>
  );
};

export default ConceitosPage;
