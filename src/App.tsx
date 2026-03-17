import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Noticias from "./pages/Noticias.tsx";
import Artigos from "./pages/Artigos.tsx";
import Cursos from "./pages/Cursos.tsx";
import Materiais from "./pages/Materiais.tsx";
import RedesSociais from "./pages/RedesSociais.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminLayout from "./pages/AdminLayout.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminNoticias from "./pages/AdminNoticias.tsx";
import AdminArtigos from "./pages/AdminArtigos.tsx";
import AdminCursos from "./pages/AdminCursos.tsx";
import AdminMateriais from "./pages/AdminMateriais.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/materiais" element={<Materiais />} />
          <Route path="/redes-sociais" element={<RedesSociais />} />
          
          {/* Admin Routes */}
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
            <Route path="artigos" element={<AdminArtigos />} />
            <Route path="cursos" element={<AdminCursos />} />
            <Route path="materiais" element={<AdminMateriais />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
