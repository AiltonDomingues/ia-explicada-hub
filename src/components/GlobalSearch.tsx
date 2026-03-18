import { useState, useEffect, useMemo } from "react";
import { Search, FileText, Newspaper, GraduationCap, BookOpen, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNoticias, useArtigos, useCursos, useMateriais } from "@/hooks/useSupabase";

interface SearchResult {
  id: string;
  type: 'noticia' | 'artigo' | 'curso' | 'material';
  titulo: string;
  descricao?: string;
  categoria: string;
  link?: string;
}

interface GlobalSearchProps {
  variant?: 'icon' | 'menu-item';
}

const GlobalSearch = ({ variant = 'icon' }: GlobalSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Fetch all content
  const { data: noticias = [] } = useNoticias();
  const { data: artigos = [] } = useArtigos();
  const { data: cursos = [] } = useCursos();
  const { data: materiais = [] } = useMateriais();

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerm = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search in noticias
    noticias.forEach((n) => {
      const matchTitle = n.titulo.toLowerCase().includes(searchTerm);
      const matchDesc = n.descricao.toLowerCase().includes(searchTerm);
      const matchTags = n.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm));

      if (matchTitle || matchDesc || matchTags) {
        allResults.push({
          id: n.id,
          type: 'noticia',
          titulo: n.titulo,
          descricao: n.descricao.substring(0, 100) + '...',
          categoria: n.categoria,
          link: n.link
        });
      }
    });

    // Search in artigos
    artigos.forEach((a) => {
      const matchTitle = a.titulo.toLowerCase().includes(searchTerm);
      const matchResumo = a.resumo?.toLowerCase().includes(searchTerm);
      const matchAutor = a.autor.toLowerCase().includes(searchTerm);
      const matchTags = a.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm));

      if (matchTitle || matchResumo || matchAutor || matchTags) {
        allResults.push({
          id: a.id,
          type: 'artigo',
          titulo: a.titulo,
          descricao: a.resumo?.substring(0, 100) + '...' || '',
          categoria: a.categoria,
          link: a.link
        });
      }
    });

    // Search in cursos
    cursos.forEach((c) => {
      const matchTitle = c.titulo.toLowerCase().includes(searchTerm);
      const matchDesc = c.descricao.toLowerCase().includes(searchTerm);
      const matchInstrutor = c.autor.toLowerCase().includes(searchTerm);

      if (matchTitle || matchDesc || matchInstrutor) {
        allResults.push({
          id: c.id,
          type: 'curso',
          titulo: c.titulo,
          descricao: c.descricao.substring(0, 100) + '...',
          categoria: c.nivel,
          link: c.link
        });
      }
    });

    // Search in materiais
    materiais.forEach((m) => {
      const matchTitle = m.titulo.toLowerCase().includes(searchTerm);
      const matchDesc = m.descricao.toLowerCase().includes(searchTerm);
      const matchTipo = m.tipo.toLowerCase().includes(searchTerm);

      if (matchTitle || matchDesc || matchTipo) {
        allResults.push({
          id: m.id,
          type: 'material',
          titulo: m.titulo,
          descricao: m.descricao.substring(0, 100) + '...',
          categoria: m.tipo,
          link: m.link
        });
      }
    });

    return allResults;
  }, [query, noticias, artigos, cursos, materiais]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups = {
      noticia: results.filter(r => r.type === 'noticia'),
      artigo: results.filter(r => r.type === 'artigo'),
      curso: results.filter(r => r.type === 'curso'),
      material: results.filter(r => r.type === 'material')
    };
    return groups;
  }, [results]);

  const handleResultClick = (result: SearchResult) => {
    if (result.link) {
      if (result.type === 'artigo') {
        // External link
        window.open(result.link, '_blank');
      } else {
        // Internal link
        window.location.href = result.link;
      }
    } else {
      // Navigate to appropriate page
      const pages: Record<string, string> = {
        noticia: '/noticias',
        artigo: '/artigos',
        curso: '/cursos',
        material: '/materiais'
      };
      navigate(pages[result.type]);
    }
    setIsOpen(false);
    setQuery("");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'noticia': return <Newspaper className="w-4 h-4 text-blue-500" />;
      case 'artigo': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'curso': return <GraduationCap className="w-4 h-4 text-green-500" />;
      case 'material': return <BookOpen className="w-4 h-4 text-orange-500" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      noticia: 'Notícias',
      artigo: 'Artigos',
      curso: 'Cursos',
      material: 'Materiais'
    };
    return names[type] || type;
  };

  const totalResults = results.length;

  return (
    <>
      {/* Search trigger button */}
      {variant === 'icon' ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-4 rounded-lg text-base font-medium transition-colors border-b border-border/50 text-muted-foreground hover:text-foreground w-full text-left"
        >
          <Search className="w-5 h-5" strokeWidth={1.5} />
          Buscar
        </button>
      )}

      {/* Search modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 max-h-[80vh] overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar notícias, artigos, cursos, materiais..."
              className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 hover:bg-muted rounded"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
            {query.length < 2 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Digite pelo menos 2 caracteres para buscar</p>
              </div>
            ) : totalResults === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Nenhum resultado encontrado para "{query}"</p>
              </div>
            ) : (
              <div className="p-2">
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  {totalResults} resultado{totalResults !== 1 && 's'} encontrado{totalResults !== 1 && 's'}
                </p>

                {/* Notícias */}
                {groupedResults.noticia.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
                      <Newspaper className="w-4 h-4 text-blue-500" />
                      <span>Notícias ({groupedResults.noticia.length})</span>
                    </div>
                    {groupedResults.noticia.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {getTypeIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1">{result.titulo}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {result.descricao}
                            </div>
                            <div className="text-xs text-primary mt-1">{result.categoria}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Artigos */}
                {groupedResults.artigo.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span>Artigos ({groupedResults.artigo.length})</span>
                    </div>
                    {groupedResults.artigo.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {getTypeIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1">{result.titulo}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {result.descricao}
                            </div>
                            <div className="text-xs text-primary mt-1">{result.categoria}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Cursos */}
                {groupedResults.curso.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
                      <GraduationCap className="w-4 h-4 text-green-500" />
                      <span>Cursos ({groupedResults.curso.length})</span>
                    </div>
                    {groupedResults.curso.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {getTypeIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1">{result.titulo}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {result.descricao}
                            </div>
                            <div className="text-xs text-primary mt-1">{result.categoria}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Materiais */}
                {groupedResults.material.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      <span>Materiais ({groupedResults.material.length})</span>
                    </div>
                    {groupedResults.material.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {getTypeIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1">{result.titulo}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {result.descricao}
                            </div>
                            <div className="text-xs text-primary mt-1">{result.categoria}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;
