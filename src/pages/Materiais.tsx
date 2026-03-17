import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import MaterialCard from "@/components/MaterialCard";
import { materiais as materiaisHardcoded } from "@/data/materiais";
import { useMateriais } from "@/hooks/useSupabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

const MateriaisPage = () => {
  const { data: materiaisData } = useMateriais();
  const materiais = materiaisData && materiaisData.length > 0 ? materiaisData : materiaisHardcoded;
  
  const categorias = ["Todas as Categorias", ...Array.from(new Set(materiais.map((m) => m.categoria)))];
  const tipos = ["Todos os Tipos", ...Array.from(new Set(materiais.map((m) => m.tipo)))];
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todas as Categorias");
  const [tipo, setTipo] = useState("Todos os Tipos");

  const filtered = useMemo(() => {
    return materiais.filter((m) => {
      const matchSearch = m.titulo.toLowerCase().includes(search.toLowerCase()) ||
        m.descricao.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoria === "Todas as Categorias" || m.categoria === categoria;
      const matchTipo = tipo === "Todos os Tipos" || m.tipo === tipo;
      return matchSearch && matchCat && matchTipo;
    });
  }, [search, categoria, tipo]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm">
        <Link to="/" className="text-primary hover:underline">Início</Link>
        <span className="text-muted-foreground mx-1">/</span>
        <span className="text-muted-foreground">Materiais</span>
      </div>

      <PageHeader
        title="Materiais"
        highlight="Didáticos"
        subtitle="Acesse nossa biblioteca gratuita de recursos educacionais sobre inteligência artificial"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar materiais..."
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
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="w-[180px] bg-card border-border">
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
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-[180px] bg-card border-border">
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
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-bold">{filtered.length}</span> materiais encontrados
          </p>
        </div>

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
    </div>
  );
};

export default MateriaisPage;
