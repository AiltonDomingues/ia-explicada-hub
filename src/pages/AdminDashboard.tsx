import { Link } from "react-router-dom";
import { Newspaper, FileText, GraduationCap, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const sections = [
    {
      title: "Notícias",
      icon: Newspaper,
      link: "/admin/noticias",
      color: "bg-blue-500",
    },
    {
      title: "Artigos",
      icon: FileText,
      link: "/admin/artigos",
      color: "bg-green-500",
    },
    {
      title: "Cursos",
      icon: GraduationCap,
      link: "/admin/cursos",
      color: "bg-purple-500",
    },
    {
      title: "Materiais",
      icon: FolderOpen,
      link: "/admin/materiais",
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Gerencie todo o conteúdo do seu site
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link
            key={section.link}
            to={section.link}
            className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${section.color} p-3 rounded-xl`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-xl mb-1">{section.title}</h3>
            <p className="text-sm text-muted-foreground">
              Gerenciar {section.title.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
        <h2 className="text-lg mb-2">🎉 Bem-vindo ao Painel Admin!</h2>
        <p className="text-sm text-muted-foreground">
          Use as seções acima para adicionar, editar ou remover conteúdo do seu
          site. Todas as mudanças são salvas automaticamente no Supabase.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
