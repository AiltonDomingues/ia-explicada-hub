import { Link, useLocation, useNavigate } from "react-router-dom";
import { Newspaper, FileText, GraduationCap, FolderOpen, Book, Home, Menu, X, Info, Calendar, Wrench, Compass, User, LogOut, LogIn, Bookmark } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GlobalSearch from "@/components/GlobalSearch";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/noticias", label: "Notícias", icon: Newspaper },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/artigos", label: "Blog", icon: FileText },
  { to: "/cursos", label: "Cursos", icon: GraduationCap },
  { to: "/materiais", label: "Materiais", icon: FolderOpen },
  { to: "/conceitos", label: "Conceitos", icon: Book },
  { to: "/ferramentas", label: "Ferramentas", icon: Wrench },
  { to: "/eventos", label: "Eventos", icon: Calendar },
  { to: "/sobre", label: "Sobre", icon: Info },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-2.png" alt="iA Explicada" className="h-8 w-auto" />
              <Home className="w-5 h-5 text-primary" />
            </Link>

            {/* Desktop nav with search */}
            <div className="hidden md:flex items-center gap-2">
              <GlobalSearch />
              
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-4 h-4" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                );
              })}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Minha Conta</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/perfil")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/meus-salvos")}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Meus Salvos</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => navigate("/login")} size="sm" className="ml-2">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Entrar
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu content */}
          <div className="absolute top-0 left-0 right-0 flex flex-col bg-background shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <img src="/logo-2.png" alt="iA Explicada" className="h-8 w-auto" />
                <Home className="w-5 h-5 text-primary" />
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Menu items */}
            <div className="flex flex-col p-4">
              {/* Search button - Mobile */}
              <GlobalSearch variant="menu-item" />
              
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-lg text-base font-medium transition-colors border-b border-border/50 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                );
              })}

              {/* User Menu - Mobile */}
              <div className="mt-4 pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="px-4 py-2 mb-2">
                      <p className="text-sm text-muted-foreground">Logado como</p>
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/perfil"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <User className="w-5 h-5" strokeWidth={1.5} />
                      Meu Perfil
                    </Link>
                    <Link
                      to="/meus-salvos"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Bookmark className="w-5 h-5" strokeWidth={1.5} />
                      Meus Salvos
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="w-5 h-5" strokeWidth={1.5} />
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors bg-primary text-primary-foreground"
                  >
                    <LogIn className="w-5 h-5" strokeWidth={1.5} />
                    Entrar / Cadastrar
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
