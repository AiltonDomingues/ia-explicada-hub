import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import ArtigoCard from "@/components/ArtigoCard";
import { useArtigos } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

const ArtigosPage = () => {
  usePageTitle("Artigos");
  const { data: artigosData = [] } = useArtigos();
  const artigos = artigosData;
  
  const categorias = ["Todas as Categorias", ...Array.from(new Set(artigos.map((a) => a.categoria)))];
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todas as Categorias");

  const filtered = useMemo(() => {
    return artigos.filter((a) => {
      const matchSearch = a.titulo.toLowerCase().includes(search.toLowerCase()) ||
        a.resumo.toLowerCase().includes(search.toLowerCase()) ||
        a.autor.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoria === "Todas as Categorias" || a.categoria === categoria;
      return matchSearch && matchCat;
    });
  }, [search, categoria]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Artigos"
        highlight="Especializados"
        subtitle="Explore nossa biblioteca de artigos acadêmicos e análises aprofundadas sobre inteligência artificial"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar artigos por título, autor ou conteúdo..."
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
          Encontrados <span className="text-primary font-bold">{filtered.length}</span> artigos
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((a) => (
            <motion.div key={a.id} variants={itemVariants}>
              <ArtigoCard artigo={a} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ArtigosPage;
