import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Noticias from "./pages/Noticias.tsx";
import Explore from "./pages/Explore.tsx";
import Blog from "./pages/Blog.tsx";
import Cursos from "./pages/Cursos.tsx";
import Materiais from "./pages/Materiais.tsx";
import Conceitos from "./pages/Conceitos.tsx";
import Eventos from "./pages/Eventos.tsx";
import Ferramentas from "./pages/Ferramentas.tsx";
import FerramentaDetalhes from "./pages/FerramentaDetalhes.tsx";
import Sobre from "./pages/Sobre.tsx";
import Login from "./pages/Login.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Perfil from "./pages/Perfil.tsx";
import MeusSalvos from "./pages/MeusSalvos.tsx";
import Termos from "./pages/Termos.tsx";
import Privacidade from "./pages/Privacidade.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminLayout from "./pages/AdminLayout.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminNoticias from "./pages/AdminNoticias.tsx";
import AdminBlog from "./pages/AdminBlog.tsx";
import AdminCursos from "./pages/AdminCursos.tsx";
import AdminMateriais from "./pages/AdminMateriais.tsx";
import AdminConceitos from "./pages/AdminConceitos.tsx";
import AdminEventos from "./pages/AdminEventos.tsx";
import AdminCreators from "./pages/AdminCreators.tsx";
import AdminFerramentas from "./pages/AdminFerramentas.tsx";
import AdminUsuarios from "./pages/AdminUsuarios.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ScrollToTopOnMount from "./components/ScrollToTopOnMount.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTopOnMount />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/artigos" element={<Blog />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/materiais" element={<Materiais />} />
          <Route path="/conceitos" element={<Conceitos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/ferramentas" element={<Ferramentas />} />
          <Route path="/ferramentas/:id" element={<FerramentaDetalhes />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/meus-salvos" element={<MeusSalvos />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="noticias" element={<AdminNoticias />} />
            <Route path="artigos" element={<AdminBlog />} />
            <Route path="cursos" element={<AdminCursos />} />
            <Route path="materiais" element={<AdminMateriais />} />
            <Route path="conceitos" element={<AdminConceitos />} />
            <Route path="eventos" element={<AdminEventos />} />
            <Route path="creators" element={<AdminCreators />} />
            <Route path="ferramentas" element={<AdminFerramentas />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
