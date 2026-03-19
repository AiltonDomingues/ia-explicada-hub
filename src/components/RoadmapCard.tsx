import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import type { Roadmap } from "@/data/roadmaps";

interface RoadmapCardProps {
  roadmap: Roadmap;
}

const getNivelColor = (nivel: string) => {
  if (nivel === "Iniciante") return "bg-emerald-500";
  if (nivel === "Intermediário") return "bg-amber-500";
  return "bg-purple-500";
};

const RoadmapCard = ({ roadmap }: RoadmapCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className={`bg-gradient-to-r ${roadmap.cor} text-white p-6 cursor-pointer hover:opacity-90 transition-opacity`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{roadmap.icone}</span>
                <div>
                  <h3 className="text-2xl font-bold">{roadmap.area}</h3>
                  <p className="text-white/90 text-sm mt-1">{roadmap.descricao}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                      {roadmap.etapas.length} etapas
                    </Badge>
                  </div>
                </div>
              </div>
              <ChevronDown 
                className={`w-6 h-6 text-white transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6">
            {/* Roadmap Timeline */}
            <div className="relative">
              {/* Linha vertical central */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-border via-primary/20 to-border"></div>
              
              <div className="space-y-6">
                {roadmap.etapas.map((etapa, index) => (
                  <motion.div
                    key={etapa.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative flex items-start gap-4 group"
                  >
                    {/* Nó da estação */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full ${getNivelColor(etapa.nivel)} flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                        {etapa.id}
                      </div>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="flex-1 bg-muted/50 rounded-lg p-4 group-hover:bg-muted transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {etapa.titulo}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`
                            text-xs flex-shrink-0
                            ${etapa.nivel === "Iniciante" && "border-emerald-500 text-emerald-600 dark:text-emerald-400"}
                            ${etapa.nivel === "Intermediário" && "border-amber-500 text-amber-600 dark:text-amber-400"}
                            ${etapa.nivel === "Avançado" && "border-purple-500 text-purple-600 dark:text-purple-400"}
                          `}
                        >
                          {etapa.nivel}
                        </Badge>
                      </div>
                      {etapa.descricao && (
                        <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Legenda */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-center gap-6 flex-wrap text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-muted-foreground">Iniciante</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-muted-foreground">Intermediário</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-muted-foreground">Avançado</span>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default RoadmapCard;
