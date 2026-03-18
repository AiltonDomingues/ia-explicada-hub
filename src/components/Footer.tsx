import { Link } from "react-router-dom";
import { Youtube, Linkedin, Instagram, Twitter, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { name: "Notícias", path: "/noticias" },
    { name: "Artigos", path: "/artigos" },
    { name: "Cursos", path: "/cursos" },
    { name: "Materiais", path: "/materiais" },
    { name: "Conceitos", path: "/conceitos" },
  ];

  const socialLinks = [
    { icon: Youtube, label: "YouTube", url: "#" },
    { icon: Linkedin, label: "LinkedIn", url: "#" },
    { icon: Instagram, label: "Instagram", url: "#" },
    { icon: Twitter, label: "Twitter", url: "#" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="IA Explicada HUB" 
                className="h-8 w-8 mr-2"
              />
              <h3 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                IA Explicada HUB
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Seu portal completo sobre Inteligência Artificial. 
              Notícias, artigos aprofundados, cursos e materiais didáticos 
              para você dominar o mundo da IA.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
            <p className="text-slate-400 text-sm mb-4">
              Acompanhe as últimas novidades sobre IA nas redes sociais
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-teal-600 p-2.5 rounded-lg transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>
              © {currentYear} IA Explicada HUB. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500" /> para a comunidade de IA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
