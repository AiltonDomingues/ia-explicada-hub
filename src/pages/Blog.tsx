import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import BlogCard from "@/components/BlogCard";
import { useBlogPosts } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { containerVariants, itemVariants } from "@/lib/animations";

const BlogPage = () => {
  usePageTitle("Blog");
  const { data: blogPostsData = [] } = useBlogPosts();
  const posts = blogPostsData;
  
  const categorias = ["Todas as Categorias", ...Array.from(new Set(posts.map((p) => p.categoria)))];
  const niveis = ["Todos os Níveis", ...Array.from(new Set(posts.map((p) => p.nivel)))];
  
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todas as Categorias");
  const [nivel, setNivel] = useState("Todos os Níveis");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch = 
        p.titulo.toLowerCase().includes(search.toLowerCase()) ||
        p.descricao.toLowerCase().includes(search.toLowerCase()) ||
        p.autor_original.toLowerCase().includes(search.toLowerCase()) ||
        p.fonte.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchCat = categoria === "Todas as Categorias" || p.categoria === categoria;
      const matchNivel = nivel === "Todos os Níveis" || p.nivel === nivel;
      return matchSearch && matchCat && matchNivel;
    });
  }, [posts, search, categoria, nivel]);

  // Separar posts em destaque e regulares
  const featuredPosts = filtered.filter(p => p.destaque).slice(0, 2);
  const regularPosts = filtered.filter(p => !p.destaque);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Blog"
        highlight="& Guias"
        subtitle="Artigos explicativos, casos de uso reais e tutoriais práticos sobre inteligência artificial"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por título, autor, fonte ou tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
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
          <Select value={nivel} onValueChange={setNivel}>
            <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
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
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Encontrados <span className="text-primary font-bold">{filtered.length}</span> posts
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Posts em Destaque */}
          {featuredPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Em Destaque
                </span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <BlogCard post={post} featured={true} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Regulares */}
          {regularPosts.length > 0 && (
            <div>
              {featuredPosts.length > 0 && (
                <h2 className="text-2xl font-bold mb-6">Todos os Posts</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Estado vazio */}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Nenhum post encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogPage;
