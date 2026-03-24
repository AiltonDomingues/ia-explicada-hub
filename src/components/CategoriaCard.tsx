import { useState } from "react";
import { ExternalLink } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { Ferramenta } from "@/lib/supabase";

interface CategoriaCardProps {
  nome: string;
  icone: string; // Nome do ícone do Lucide
  ferramentas: Ferramenta[];
  totalFerramentas: number;
}

const getCategoryColor = (categoria: string): string => {
  const colors: Record<string, string> = {
    // Criação de Conteúdo Visual
    "Geradores de Imagem": "bg-gradient-to-r from-pink-500 to-purple-500",
    "Geradores de Vídeo": "bg-gradient-to-r from-purple-500 to-indigo-500",
    "Edição de Imagem": "bg-gradient-to-r from-fuchsia-500 to-pink-500",
    "Edição de Vídeo": "bg-gradient-to-r from-violet-500 to-purple-500",
    "Face Swap & DeepFake": "bg-gradient-to-r from-rose-500 to-red-500",
    "Avatares": "bg-gradient-to-r from-pink-400 to-fuchsia-400",
    "Criação de Logos": "bg-gradient-to-r from-orange-500 to-amber-500",
    
    // Texto e Escrita
    "Escrita & SEO": "bg-gradient-to-r from-amber-500 to-orange-500",
    "Geradores de Texto": "bg-gradient-to-r from-yellow-500 to-amber-500",
    "E-mail": "bg-gradient-to-r from-orange-400 to-yellow-500",
    "Resumidor": "bg-gradient-to-r from-lime-500 to-yellow-500",
    "Detecção de IA": "bg-gradient-to-r from-amber-600 to-orange-600",
    
    // Áudio e Voz
    "Texto para Fala": "bg-gradient-to-r from-green-500 to-emerald-500",
    "Edição de Áudio": "bg-gradient-to-r from-emerald-500 to-teal-500",
    "Música": "bg-gradient-to-r from-teal-500 to-cyan-500",
    "Clonagem de Voz": "bg-gradient-to-r from-green-400 to-teal-400",
    
    // Chat e Assistentes
    "Chat & Assistentes IA": "bg-gradient-to-r from-blue-500 to-cyan-500",
    "ChatBots": "bg-gradient-to-r from-cyan-500 to-blue-500",
    "Assistentes de Vida": "bg-gradient-to-r from-sky-500 to-blue-500",
    "Memória": "bg-gradient-to-r from-indigo-400 to-blue-400",
    "Suporte ao Cliente": "bg-gradient-to-r from-blue-600 to-cyan-600",
    
    // Tecnologia e Desenvolvimento
    "Assistente de Código": "bg-gradient-to-r from-cyan-500 to-teal-500",
    "Ferramentas para Devs": "bg-gradient-to-r from-blue-500 to-indigo-500",
    "Sites & Design": "bg-gradient-to-r from-fuchsia-500 to-purple-500",
    "Apresentações": "bg-gradient-to-r from-violet-400 to-indigo-400",
    "SQL": "bg-gradient-to-r from-blue-600 to-indigo-600",
    
    // Negócios e Produtividade
    "Produtividade": "bg-gradient-to-r from-indigo-500 to-blue-500",
    "Marketing": "bg-gradient-to-r from-red-500 to-pink-500",
    "Redes Sociais": "bg-gradient-to-r from-pink-500 to-rose-500",
    "E-commerce": "bg-gradient-to-r from-emerald-500 to-green-500",
    "Vendas": "bg-gradient-to-r from-green-600 to-emerald-600",
    "Recursos Humanos": "bg-gradient-to-r from-blue-400 to-sky-400",
    "Finanças": "bg-gradient-to-r from-green-500 to-lime-500",
    "Imobiliário": "bg-gradient-to-r from-teal-600 to-cyan-600",
    
    // Dados e Análise
    "Analytics": "bg-gradient-to-r from-purple-500 to-pink-500",
    "Mecanismos de Busca": "bg-gradient-to-r from-cyan-600 to-blue-600",
    "Arquivos & Planilhas": "bg-gradient-to-r from-green-400 to-emerald-400",
    
    // Educação e Pesquisa
    "Educação": "bg-gradient-to-r from-yellow-500 to-orange-500",
    "Pesquisa": "bg-gradient-to-r from-indigo-500 to-purple-500",
    
    // Especialidades
    "Saúde": "bg-gradient-to-r from-red-400 to-rose-400",
    "Jurídico": "bg-gradient-to-r from-slate-600 to-gray-600",
    "Arquitetura": "bg-gradient-to-r from-stone-500 to-amber-500",
    "Moda": "bg-gradient-to-r from-fuchsia-400 to-pink-500",
    "Games": "bg-gradient-to-r from-violet-500 to-fuchsia-500",
    "Esporte": "bg-gradient-to-r from-orange-500 to-red-500",
    "Viagens": "bg-gradient-to-r from-sky-400 to-cyan-400",
    "Religião": "bg-gradient-to-r from-amber-400 to-yellow-400",
    
    // Extensões e Plugins
    "Extensões ChatGPT": "bg-gradient-to-r from-teal-400 to-cyan-500",
    
    // Outros
    "3D": "bg-gradient-to-r from-purple-600 to-indigo-600",
    "Prompt": "bg-gradient-to-r from-lime-400 to-green-500",
    "Deepfakes": "bg-gradient-to-r from-red-500 to-pink-600",
    "NFT": "bg-gradient-to-r from-purple-400 to-fuchsia-400",
    "NSFW": "bg-gradient-to-r from-rose-600 to-red-600",
  };
  return colors[categoria] || "bg-gradient-to-r from-slate-500 to-gray-500";
};

const CategoriaCard = ({ nome, icone, ferramentas, totalFerramentas }: CategoriaCardProps) => {
  const colorClasses = getCategoryColor(nome);
  
  // Obter o componente de ícone do Lucide dinamicamente
  const IconComponent = (LucideIcons as any)[icone] || LucideIcons.Sparkles;

  return (
    <div className="relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Linha colorida no topo */}
      <div className={`h-1 ${colorClasses}`} />
      
      {/* Cabeçalho da Categoria */}
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-3">
        <IconComponent className="w-5 h-5 text-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground leading-tight">{nome}</h3>
        </div>
      </div>

      {/* Lista de Ferramentas */}
      <div className="px-5 pb-3 space-y-1">
        {ferramentas.map((ferramenta, index) => {
          return <FerramentaItem key={ferramenta.id} ferramenta={ferramenta} index={index} />;
        })}
      </div>
    </div>
  );
};

// Componente auxiliar para cada ferramenta com estado próprio
const FerramentaItem = ({ ferramenta, index }: { ferramenta: Ferramenta; index: number }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href={ferramenta.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors group"
    >
            {/* Número */}
            <span className="flex-shrink-0 w-5 text-xs font-medium text-muted-foreground">
              {index + 1}.
            </span>

        {/* Logo/Ícone */}
        {ferramenta.logo && !imageError ? (
          <img
            src={ferramenta.logo}
            alt={ferramenta.nome}
            className="w-4 h-4 rounded object-cover flex-shrink-0"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-primary">
              {ferramenta.nome.charAt(0)}
            </span>
          </div>
        )}

            {/* Nome da Ferramenta */}
            <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
              {ferramenta.nome}
            </span>

            {/* Badge de Preço */}
            {ferramenta.preco === "Gratuito" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-400 text-yellow-900 font-bold flex-shrink-0">
                $
              </span>
            )}

        {/* Ícone de Link Externo */}
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0" />
    </a>
  );
};

export default CategoriaCard;
