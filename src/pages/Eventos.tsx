import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import EventoCard from "@/components/EventoCard";
import { eventos as eventosHardcoded } from "@/data/eventos";
import { useEventos } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

const EventosPage = () => {
  usePageTitle("Eventos");
  const { data: eventosData } = useEventos();
  const eventos = eventosData && eventosData.length > 0 ? eventosData : eventosHardcoded;
  
  const tipos = ["Todos os Tipos", ...Array.from(new Set(eventos.map((e) => e.tipo)))];
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("Todos os Tipos");
  const [sortBy, setSortBy] = useState("Data");

  const filtered = useMemo(() => {
    let result = eventos.filter((e) => {
      const matchSearch = e.titulo.toLowerCase().includes(search.toLowerCase()) ||
        e.descricao.toLowerCase().includes(search.toLowerCase()) ||
        e.local.toLowerCase().includes(search.toLowerCase());
      const matchTipo = tipo === "Todos os Tipos" || e.tipo === tipo;
      return matchSearch && matchTipo;
    });
    
    if (sortBy === "Data") {
      result = [...result].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    } else if (sortBy === "Título") {
      result = [...result].sort((a, b) => a.titulo.localeCompare(b.titulo));
    }
    
    return result;
  }, [search, tipo, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />


      <PageHeader
        title="Eventos de"
        highlight="IA"
        subtitle="Descubra conferências, workshops, hackathons e meetups sobre Inteligência Artificial"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="w-[220px] bg-card border-border">
              <SelectValue placeholder="Tipo de Evento" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[220px] bg-card border-border">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Data">Data</SelectItem>
              <SelectItem value="Título">Título</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Encontrados <span className="text-primary font-bold">{filtered.length}</span> eventos
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Events Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filtered.length > 0 ? (
            filtered.map((evento) => (
              <motion.div key={evento.id} variants={itemVariants}>
                <EventoCard evento={evento} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Nenhum evento encontrado.</p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default EventosPage;
