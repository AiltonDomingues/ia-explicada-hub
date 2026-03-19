import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import NoticiaCard from "@/components/NoticiaCard";
import { useNoticias } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

const NoticiasPage = () => {
  usePageTitle("Notícias");
  const { data: noticiasData = [] } = useNoticias();
  const noticias = noticiasData;
  
  const categorias = ["Todas as Categorias", ...Array.from(new Set(noticias.map((n) => n.categoria)))];
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todas as Categorias");

  const filtered = useMemo(() => {
    const results = noticias.filter((n) => {
      const matchSearch = n.titulo.toLowerCase().includes(search.toLowerCase()) ||
        n.descricao.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoria === "Todas as Categorias" || n.categoria === categoria;
      return matchSearch && matchCat;
    });
    
    // Sort: 1. Trending first, 2. Most recent
    return results.sort((a, b) => {
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });
  }, [search, categoria, noticias]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Últimas"
        highlight="Notícias"
        subtitle="Mantenha-se atualizado com as mais recentes novidades do mundo da Inteligência Artificial"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar notícias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-[220px] bg-card border-border">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Encontradas <span className="text-primary font-bold">{filtered.length}</span> notícias
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length > 0 && (
          <>
            {/* Featured News - Hero Section */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Em Destaque
              </h2>
              <NoticiaCard noticia={filtered[0]} featured={true} />
            </motion.div>

            {/* Remaining News Grid */}
            {filtered.length > 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  Mais Notícias
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filtered.slice(1).map((n) => (
                    <motion.div key={n.id} variants={itemVariants}>
                      <NoticiaCard noticia={n} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </>
        )}
        
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhuma notícia encontrada</p>
          </div>
        )}
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default NoticiasPage;
