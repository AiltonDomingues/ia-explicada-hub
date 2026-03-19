import { ExternalLink, Youtube, Twitter, Linkedin, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CreatorCardProps {
  nome: string;
  descricao: string;
  avatar: string;
  especialidade: string;
  plataforma: string;
  link: string;
  seguidores?: string;
  destaque: boolean;
}

const CreatorCard = ({
  nome,
  descricao,
  avatar,
  especialidade,
  plataforma,
  link,
  seguidores,
  destaque
}: CreatorCardProps) => {
  const getPlatformIcon = () => {
    const plataformaLower = plataforma.toLowerCase();
    const iconClass = "w-4 h-4";
    
    if (plataformaLower.includes("youtube")) return <Youtube className={iconClass} />;
    if (plataformaLower.includes("twitter")) return <Twitter className={iconClass} />;
    if (plataformaLower.includes("linkedin")) return <Linkedin className={iconClass} />;
    return <Globe className={iconClass} />;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
              <img
                src={avatar}
                alt={nome}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {destaque && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">★</span>
              </div>
            )}
          </div>

          {/* Nome e Badges */}
          <div className="space-y-2 w-full">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {nome}
            </h3>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {especialidade}
              </Badge>
              {seguidores && (
                <Badge variant="outline" className="text-xs">
                  {seguidores} seguidores
                </Badge>
              )}
            </div>
          </div>

          {/* Descrição */}
          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.6rem]">
            {descricao}
          </p>

          {/* CTA */}
          <Button
            asChild
            className="w-full gap-2 group-hover:gap-3 transition-all"
            variant="default"
          >
            <a href={link} target="_blank" rel="noopener noreferrer">
              {getPlatformIcon()}
              <span>Seguir no {plataforma}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
