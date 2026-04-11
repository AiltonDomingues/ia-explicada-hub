import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import CursoCard from "@/components/CursoCard";
import { cursos as cursosHardcoded } from "@/data/cursos";
import { useCursos, useProfile } from "@/hooks/useSupabase";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

// Mapeamento de nivel_ia do perfil (5 níveis) para valores do filtro de conteúdo (3 níveis)
const getNivelInicial = (userNivel?: string): string => {
  const mapa: Record<string, string> = {
    'iniciante': 'Iniciante',
    'explorador': 'Iniciante',      // Explorador = usa ferramentas prontas (ainda iniciante)
    'intermediario': 'Intermediário',
    'avancado': 'Avançado',
    'especialista': 'Avançado'       // Especialista agrupa em Avançado
  };
  return userNivel && mapa[userNivel] ? mapa[userNivel] : "Todos os Níveis";
};

const CursosPage = () => {
  usePageTitle("Cursos");
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: cursosData } = useCursos();
  const cursos = cursosData && cursosData.length > 0 ? cursosData : cursosHardcoded;
  
  // Garantir que os 3 níveis padrão sempre estejam disponíveis
  const niveis = ["Todos os Níveis", "Iniciante", "Intermediário", "Avançado"];
  const categorias = ["Todas as Categorias", ...Array.from(new Set(cursos.map((c) => c.categoria)))];
  const [search, setSearch] = useState("");
  const [nivel, setNivel] = useState("Todos os Níveis");
  const [categoria, setCategoria] = useState("Todas as Categorias");

  // Pré-selecionar filtro de nível baseado no perfil do usuário (se ativado)
  useEffect(() => {
    if (profile?.nivel_ia && profile?.auto_filtrar_por_nivel !== false) {
      const nivelInicial = getNivelInicial(profile.nivel_ia);
      setNivel(nivelInicial);
      console.log('[Cursos] Filtro aplicado:', nivelInicial, 'baseado em:', profile.nivel_ia);
    }
  }, [profile?.nivel_ia, profile?.auto_filtrar_por_nivel]);

  const filtered = useMemo(() => {
    let result = cursos.filter((c) => {
      const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase()) ||
        c.descricao.toLowerCase().includes(search.toLowerCase());
      const matchNivel = nivel === "Todos os Níveis" || c.nivel === nivel;
      const matchCategoria = categoria === "Todas as Categorias" || c.categoria === categoria;
      return matchSearch && matchNivel && matchCategoria;
    });
    // Ordenar por destaque primeiro, depois por outros critérios
    result = [...result].sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
    return result;
  }, [search, nivel, categoria]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />


      <PageHeader
        title="Cursos de"
        highlight="IA"
        subtitle="Desenvolva suas habilidades em inteligência artificial com cursos estruturados e ministrados por especialistas"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Select value={nivel} onValueChange={setNivel}>
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
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-[220px] bg-card border-border">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Encontrados <span className="text-primary font-bold">{filtered.length}</span> cursos
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
      <ScrollToTop />
    </div>
  );
};

export default CursosPage;
