import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import CursoCard from "@/components/CursoCard";
import { cursos as cursosHardcoded } from "@/data/cursos";
import { useCursos } from "@/hooks/useSupabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

const CursosPage = () => {
  const { data: cursosData } = useCursos();
  const cursos = cursosData && cursosData.length > 0 ? cursosData : cursosHardcoded;
  
  const niveis = ["Todos os Níveis", ...Array.from(new Set(cursos.map((c) => c.nivel)))];
  const [search, setSearch] = useState("");
  const [nivel, setNivel] = useState("Todos os Níveis");
  const [sortBy, setSortBy] = useState("Destaques");

  const filtered = useMemo(() => {
    let result = cursos.filter((c) => {
      const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase()) ||
        c.descricao.toLowerCase().includes(search.toLowerCase());
      const matchNivel = nivel === "Todos os Níveis" || c.nivel === nivel;
      return matchSearch && matchNivel;
    });
    if (sortBy === "Destaques") {
      result = [...result].sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
    }
    return result;
  }, [search, nivel, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm">
        <Link to="/" className="text-primary hover:underline">Início</Link>
        <span className="text-muted-foreground mx-1">/</span>
        <span className="text-muted-foreground">Cursos</span>
      </div>

      <PageHeader
        title="Cursos de"
        highlight="IA"
        subtitle="Desenvolva suas habilidades em inteligência artificial com cursos estruturados e ministrados por especialistas"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex gap-3">
            <Select value={nivel} onValueChange={setNivel}>
              <SelectTrigger className="w-[180px] bg-card border-border">
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Destaques">Destaques</SelectItem>
                <SelectItem value="Mais Recentes">Mais Recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-bold">{filtered.length}</span> cursos encontrados
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((c) => (
            <motion.div key={c.id} variants={itemVariants}>
              <CursoCard curso={c} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default CursosPage;
