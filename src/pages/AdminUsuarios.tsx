import { useState } from "react";
import { Users, Search, Filter, Mail, Calendar, MapPin, TrendingUp, Award, Heart } from "lucide-react";
import { useAllUsers } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminUsuarios = () => {
  usePageTitle("Admin - Usuários");
  const { data: users, isLoading } = useAllUsers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [nivelFilter, setNivelFilter] = useState<string>("todos");
  const [situacaoFilter, setSituacaoFilter] = useState<string>("todos");

  // Filtrar usuários
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNivel = nivelFilter === "todos" || user.nivel_ia === nivelFilter;
    const matchesSituacao = situacaoFilter === "todos" || user.situacao === situacaoFilter;

    return matchesSearch && matchesNivel && matchesSituacao;
  });

  // Função para obter iniciais
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Função para formatar data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Labels para níveis
  const nivelLabels: Record<string, { label: string; color: string }> = {
    iniciante: { label: "Iniciante", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    explorador: { label: "Explorador", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    intermediario: { label: "Intermediário", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
    avancado: { label: "Avançado", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    especialista: { label: "Especialista", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  };

  // Labels para situações
  const situacaoLabels: Record<string, string> = {
    estudante: "Estudante",
    profissional: "Profissional",
    pesquisador: "Pesquisador",
    empreendedor: "Empreendedor",
    transicao: "Em Transição",
    explorando: "Explorando",
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">Gestão de Usuários</h1>
        </div>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os usuários cadastrados na plataforma
        </p>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{users?.length || 0}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Com Perfil</p>
              <p className="text-2xl font-bold">
                {users?.filter(u => u.nome_completo).length || 0}
              </p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <Award className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estudantes</p>
              <p className="text-2xl font-bold">
                {users?.filter(u => u.situacao === 'estudante').length || 0}
              </p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Profissionais</p>
              <p className="text-2xl font-bold">
                {users?.filter(u => u.situacao === 'profissional').length || 0}
              </p>
            </div>
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <Heart className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-card rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome, username ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={nivelFilter} onValueChange={setNivelFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os níveis</SelectItem>
              <SelectItem value="iniciante">Iniciante</SelectItem>
              <SelectItem value="explorador">Explorador</SelectItem>
              <SelectItem value="intermediario">Intermediário</SelectItem>
              <SelectItem value="avancado">Avançado</SelectItem>
              <SelectItem value="especialista">Especialista</SelectItem>
            </SelectContent>
          </Select>

          <Select value={situacaoFilter} onValueChange={setSituacaoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as situações</SelectItem>
              <SelectItem value="estudante">Estudante</SelectItem>
              <SelectItem value="profissional">Profissional</SelectItem>
              <SelectItem value="pesquisador">Pesquisador</SelectItem>
              <SelectItem value="empreendedor">Empreendedor</SelectItem>
              <SelectItem value="transicao">Em Transição</SelectItem>
              <SelectItem value="explorando">Explorando</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(searchTerm || nivelFilter !== "todos" || situacaoFilter !== "todos") && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredUsers?.length} {filteredUsers?.length === 1 ? 'resultado' : 'resultados'} encontrado(s)
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setNivelFilter("todos");
                setSituacaoFilter("todos");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Lista de Usuários */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || nivelFilter !== "todos" || situacaoFilter !== "todos"
                ? "Nenhum usuário encontrado com os filtros aplicados"
                : "Nenhum usuário cadastrado ainda"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Usuário</th>
                  <th className="text-left p-4 font-medium text-sm">Email</th>
                  <th className="text-left p-4 font-medium text-sm">Situação</th>
                  <th className="text-left p-4 font-medium text-sm">Nível IA</th>
                  <th className="text-left p-4 font-medium text-sm">Localização</th>
                  <th className="text-left p-4 font-medium text-sm">Cadastro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} alt={user.nome_completo || user.username || "User"} />
                          <AvatarFallback>
                            {getInitials(user.nome_completo || user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.nome_completo || user.username || "Sem nome"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {user.email || "—"}
                      </div>
                    </td>
                    <td className="p-4">
                      {user.situacao ? (
                        <Badge variant="secondary">
                          {situacaoLabels[user.situacao] || user.situacao}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.nivel_ia ? (
                        <Badge className={nivelLabels[user.nivel_ia]?.color || ""}>
                          {nivelLabels[user.nivel_ia]?.label || user.nivel_ia}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.localizacao ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {user.localizacao}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;
