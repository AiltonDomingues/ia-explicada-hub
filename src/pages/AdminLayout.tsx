import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Home, Newspaper, FileText, GraduationCap, FolderOpen, Book, Calendar, Users, LogOut } from "lucide-react";

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: Home },
    { to: "/admin/noticias", label: "Notícias", icon: Newspaper },
    { to: "/admin/artigos", label: "Artigos", icon: FileText },
    { to: "/admin/cursos", label: "Cursos", icon: GraduationCap },
    { to: "/admin/materiais", label: "Materiais", icon: FolderOpen },
    { to: "/admin/conceitos", label: "Conceitos", icon: Book },
    { to: "/admin/eventos", label: "Eventos", icon: Calendar },
    { to: "/admin/creators", label: "Creators", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <img src="/logo-2.png" alt="iA Explicada" className="h-8 mb-2" />
          <p className="text-sm text-muted-foreground">Painel Admin</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-3 bg-muted rounded-lg mb-3">
            <p className="text-xs text-muted-foreground mb-1">Logado como:</p>
            <p className="text-sm truncate">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
