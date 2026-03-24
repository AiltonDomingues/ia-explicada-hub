import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import CategoriaCard from "@/components/CategoriaCard";
import { categorias } from "@/data/ferramentas";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useFerramentas } from "@/hooks/useSupabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

const FerramentasPage = () => {
  usePageTitle("Ferramentas de IA");
  
  const { data: ferramentasData = [], isLoading } = useFerramentas();
  const precos = ["Todos os Preços", "Gratuito", "Freemium", "Pago", "Trial Grátis"];
  
  const [search, setSearch] = useState("");
  const [preco, setPreco] = useState("Todos os Preços");
  const [apenasVerificadas, setApenasVerificadas] = useState(false);

  // Filtrar e agrupar ferramentas por categoria
  const categoriasComFerramentas = useMemo(() => {
    if (isLoading) return [];
    
    return categorias.map((categoria) => {
      // Pegar ferramentas dessa categoria
      let ferramentasCategoria = ferramentasData
        .filter((f) => f.categoria === categoria.nome)
        .sort((a, b) => {
          // Ordenar por destaque, verificada, ranking
          if (a.destaque !== b.destaque) return b.destaque ? 1 : -1;
          if (a.verificada !== b.verificada) return b.verificada ? 1 : -1;
          return (a.ranking || 999) - (b.ranking || 999);
        });
      
      // Aplicar filtros
      ferramentasCategoria = ferramentasCategoria.filter((f) => {
        const matchSearch = 
          f.nome.toLowerCase().includes(search.toLowerCase()) ||
          f.descricao.toLowerCase().includes(search.toLowerCase()) ||
          f.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
        const matchPreco = preco === "Todos os Preços" || f.preco === preco;
        const matchVerificada = !apenasVerificadas || f.verificada;
        
        return matchSearch && matchPreco && matchVerificada;
      });
      
      // Limitar a Top 10
      return {
        ...categoria,
        ferramentas: ferramentasCategoria.slice(0, 10),
        totalFiltradas: ferramentasCategoria.length
      };
    }).filter(cat => cat.ferramentas.length > 0); // Só mostrar categorias com ferramentas
  }, [search, preco, apenasVerificadas, ferramentasData, isLoading]);

  const totalFerramentas = categoriasComFerramentas.reduce(
    (acc, cat) => acc + cat.ferramentas.length,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageHeader
          title="Ferramentas de"
          highlight="IA"
          subtitle="Descubra as melhores ferramentas de inteligência artificial organizadas por categoria"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando ferramentas...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        title="Ferramentas de"
        highlight="IA"
        subtitle="Descubra as melhores ferramentas de inteligência artificial organizadas por categoria"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col gap-3">
          {/* Linha 1: Busca */}
          <div className="relative max-w-2xl mx-auto w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar ferramentas por nome, descrição ou tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Linha 2: Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto w-full justify-center">
            <Select value={preco} onValueChange={setPreco}>
              <SelectTrigger className="w-full sm:w-[200px] bg-card border-border">
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                {precos.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setApenasVerificadas(!apenasVerificadas)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                apenasVerificadas
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:bg-accent"
              }`}
            >
              Apenas Verificadas
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Encontradas <span className="text-primary font-bold">{totalFerramentas}</span> ferramentas em{" "}
          <span className="text-primary font-bold">{categoriasComFerramentas.length}</span> categorias
        </p>
      </div>

      {/* Grid de Categorias */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {totalFerramentas > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {categoriasComFerramentas.map((categoria) => (
              <motion.div key={categoria.nome} variants={itemVariants}>
                <CategoriaCard
                  nome={categoria.nome}
                  icone={categoria.icone}
                  ferramentas={categoria.ferramentas}
                  totalFerramentas={categoria.totalFerramentas}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nenhuma ferramenta encontrada com os filtros selecionados.
            </p>
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default FerramentasPage;
