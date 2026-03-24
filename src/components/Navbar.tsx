import { Link, useLocation } from "react-router-dom";
import { Newspaper, FileText, GraduationCap, FolderOpen, Book, Home, Menu, X, Info, Calendar, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GlobalSearch from "@/components/GlobalSearch";

const navItems = [
  { to: "/noticias", label: "Notícias", icon: Newspaper },
  { to: "/artigos", label: "Artigos", icon: FileText },
  { to: "/cursos", label: "Cursos", icon: GraduationCap },
  { to: "/materiais", label: "Materiais", icon: FolderOpen },
  { to: "/conceitos", label: "Conceitos", icon: Book },
  { to: "/ferramentas", label: "Ferramentas", icon: Wrench },
  { to: "/eventos", label: "Eventos", icon: Calendar },
  { to: "/sobre", label: "Sobre", icon: Info },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
