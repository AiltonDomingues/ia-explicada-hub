import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, GraduationCap, FolderOpen, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritos, useMateriais, useCursos, useBlogPosts } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import MaterialCard from "@/components/MaterialCard";
import CursoCard from "@/components/CursoCard";
import BlogCard from "@/components/BlogCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { containerVariants, itemVariants } from "@/lib/animations";

const MeusSalvos = () => {
  usePageTitle("Meus Salvos");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("materiais");

  // Buscar favoritos do usuário
  const { data: favoritosMateriais = [] } = useFavoritos(user?.id, 'material');
  const { data: favoritosCursos = [] } = useFavoritos(user?.id, 'curso');
  const { data: favoritosBlog = [] } = useFavoritos(user?.id, 'blog');

  // Buscar todos os conteúdos
  const { data: todosMateriais = [] } = useMateriais();
  const { data: todosCursos = [] } = useCursos();
  const { data: todosArtigos = [] } = useBlogPosts();

  // Filtrar apenas os conteúdos salvos
  const materiaisSalvos = todosMateriais.filter(m => 
    favoritosMateriais.some(f => f.item_id === m.id)
  );

  const cursosSalvos = todosCursos.filter(c => 
    favoritosCursos.some(f => f.item_id === c.id)
  );

  const artigosSalvos = todosArtigos.filter(a => 
    favoritosBlog.some(f => f.item_id === a.id)
  );

  // Redirecionar se não estiver logado
  if (!user) {
    navigate("/login");
    return null;
  }

  const totalSalvos = materiaisSalvos.length + cursosSalvos.length + artigosSalvos.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        title="Meus"
        highlight="Salvos"
        subtitle={`${totalSalvos} ${totalSalvos === 1 ? 'conteúdo salvo' : 'conteúdos salvos'} para consulta rápida`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="materiais" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Materiais ({materiaisSalvos.length})</span>
              <span className="sm:hidden">({materiaisSalvos.length})</span>
            </TabsTrigger>
            <TabsTrigger value="cursos" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Cursos ({cursosSalvos.length})</span>
              <span className="sm:hidden">({cursosSalvos.length})</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Blog ({artigosSalvos.length})</span>
              <span className="sm:hidden">({artigosSalvos.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba Materiais */}
          <TabsContent value="materiais">
            {materiaisSalvos.length === 0 ? (
              <Alert className="max-w-2xl mx-auto">
                <Bookmark className="h-4 w-4" />
                <AlertDescription>
                  Você ainda não salvou nenhum material. Explore a{" "}
                  <a href="/materiais" className="text-primary hover:underline font-medium">
                    biblioteca de materiais
                  </a>{" "}
                  e salve seus favoritos!
                </AlertDescription>
              </Alert>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {materiaisSalvos.map((material, index) => (
                  <motion.div key={material.id} variants={itemVariants} custom={index}>
                    <MaterialCard material={material} showSaveButton />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          {/* Aba Cursos */}
          <TabsContent value="cursos">
            {cursosSalvos.length === 0 ? (
              <Alert className="max-w-2xl mx-auto">
                <Bookmark className="h-4 w-4" />
                <AlertDescription>
                  Você ainda não salvou nenhum curso. Explore a{" "}
                  <a href="/cursos" className="text-primary hover:underline font-medium">
                    biblioteca de cursos
                  </a>{" "}
                  e salve seus favoritos!
                </AlertDescription>
              </Alert>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {cursosSalvos.map((curso, index) => (
                  <motion.div key={curso.id} variants={itemVariants} custom={index}>
                    <CursoCard curso={curso} showSaveButton />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          {/* Aba Blog */}
          <TabsContent value="blog">
            {artigosSalvos.length === 0 ? (
              <Alert className="max-w-2xl mx-auto">
                <Bookmark className="h-4 w-4" />
                <AlertDescription>
                  Você ainda não salvou nenhum artigo. Explore o{" "}
                  <a href="/artigos" className="text-primary hover:underline font-medium">
                    blog
                  </a>{" "}
                  e salve seus favoritos!
                </AlertDescription>
              </Alert>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {artigosSalvos.map((artigo, index) => (
                  <motion.div key={artigo.id} variants={itemVariants} custom={index}>
                    <BlogCard post={artigo} showSaveButton />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default MeusSalvos;
