import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Users, ArrowDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import MaterialCard from "@/components/MaterialCard";
import CreatorCard from "@/components/CreatorCard";
import { Button } from "@/components/ui/button";
import { materiais as materiaisHardcoded } from "@/data/materiais";
import { creators as creatorsHardcoded } from "@/data/creators";
import { useMateriais, useCreators } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

const MateriaisPage = () => {
  usePageTitle("Materiais");
  const { data: materiaisData } = useMateriais();
  const { data: creatorsData } = useCreators();
  const materiais = materiaisData && materiaisData.length > 0 ? materiaisData : materiaisHardcoded;
  const creators = creatorsData && creatorsData.length > 0 ? creatorsData : creatorsHardcoded;
  
  const niveis = ["Todos os Níveis", ...Array.from(new Set(materiais.map((m) => m.nivel)))];
  const tipos = ["Todos os Tipos", ...Array.from(new Set(materiais.map((m) => m.tipo)))];
  const categorias = ["Todas as Categorias", ...Array.from(new Set(materiais.map((m) => m.categoria).filter(Boolean)))];
  const especialidades = ["Todas as Especialidades", ...Array.from(new Set(creators.map((c) => c.especialidade)))];
  const [search, setSearch] = useState("");
  const [nivel, setNivel] = useState("Todos os Níveis");
  const [tipo, setTipo] = useState("Todos os Tipos");
  const [categoria, setCategoria] = useState("Todas as Categorias");
  const [especialidade, setEspecialidade] = useState("Todas as Especialidades");

  const filtered = useMemo(() => {
    return materiais.filter((m) => {
      const matchSearch = m.titulo.toLowerCase().includes(search.toLowerCase()) ||
        m.descricao.toLowerCase().includes(search.toLowerCase());
      const matchNivel = nivel === "Todos os Níveis" || m.nivel === nivel;
      const matchTipo = tipo === "Todos os Tipos" || m.tipo === tipo;
      const matchCategoria = categoria === "Todas as Categorias" || m.categoria === categoria;
      return matchSearch && matchNivel && matchTipo && matchCategoria;
    });
  }, [search, nivel, tipo, categoria]);

  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      const matchEspecialidade = especialidade === "Todas as Especialidades" || c.especialidade === especialidade;
      return matchEspecialidade;
    });
  }, [creators, especialidade]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />


      <PageHeader
        title="Materiais"
        highlight="Didáticos"
        subtitle="Acesse nossa biblioteca gratuita de recursos educacionais sobre inteligência artificial"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar materiais..."
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
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-[220px] bg-card border-border">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Button
            variant="default"
            size="default"
            onClick={() => document.getElementById('criadores')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Descubra Creators
            <ArrowDown className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Encontrados <span className="text-primary font-bold">{filtered.length}</span> materiais
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((m) => (
            <motion.div key={m.id} variants={itemVariants}>
              <MaterialCard material={m} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Seção de Creators */}
      <div id="criadores" className="bg-muted/30 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">
                Criadores de <span className="text-primary">Conteúdo</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Siga os principais criadores de conteúdo sobre IA e mantenha-se atualizado com as últimas tendências e descobertas
            </p>
          </div>

          {/* Filtro de Especialidade */}
          <div className="flex justify-center mb-8">
            <Select value={especialidade} onValueChange={setEspecialidade}>
              <SelectTrigger className="w-[280px] bg-card border-border">
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                {especialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            Exibindo <span className="text-primary font-bold">{filteredCreators.length}</span> criadores
          </p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredCreators.map((creator) => (
              <motion.div key={creator.id} variants={itemVariants}>
                <CreatorCard {...creator} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MateriaisPage;
