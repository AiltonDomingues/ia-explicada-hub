import { Newspaper, FileText, GraduationCap, FolderOpen, Book, Database, GitBranch, CheckCircle2, XCircle, Clock, ExternalLink, Users, TrendingUp } from "lucide-react";
import { useNoticias, useBlogPosts, useCursos, useMateriais, useConceitos, useUserStats } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useGitHubWorkflows } from "@/hooks/useGitHub";

const AdminDashboard = () => {
  usePageTitle("Admin - Dashboard");
  const { data: noticias } = useNoticias();
  const { data: blogPosts } = useBlogPosts();
  const { data: cursos } = useCursos();
  const { data: materiais } = useMateriais();
  const { data: conceitos } = useConceitos();
  const { data: workflows, isLoading: workflowsLoading } = useGitHubWorkflows();
  const { data: userStats } = useUserStats();

  // Função para calcular tamanho estimado em KB
  const calculateSize = (data: any) => {
    if (!data) return 0;
    const jsonString = JSON.stringify(data);
    const bytes = new Blob([jsonString]).size;
    return Math.round(bytes / 1024); // Converter para KB
  };

  const sections = [
    {
      title: "Notícias",
      icon: Newspaper,
      color: "bg-blue-500",
      count: noticias?.length || 0,
      size: calculateSize(noticias),
    },
    {
      title: "Blog",
      icon: FileText,
      color: "bg-green-500",
      count: blogPosts?.length || 0,
      size: calculateSize(blogPosts),
    },
    {
      title: "Cursos",
      icon: GraduationCap,
      color: "bg-purple-500",
      count: cursos?.length || 0,
      size: calculateSize(cursos),
    },
    {
      title: "Materiais",
      icon: FolderOpen,
      color: "bg-orange-500",
      count: materiais?.length || 0,
      size: calculateSize(materiais),
    },
    {
      title: "Conceitos",
      icon: Book,
      color: "bg-teal-500",
      count: conceitos?.length || 0,
      size: calculateSize(conceitos),
    },
  ];

  const totalItems = sections.reduce((sum, section) => sum + section.count, 0);
  const totalSize = sections.reduce((sum, section) => sum + section.size, 0);

  // Função para obter ícone e cor do status do workflow
  const getWorkflowStatus = (status: string, conclusion: string | null) => {
    if (status === 'in_progress' || status === 'queued') {
      return {
        icon: Clock,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        label: 'Em Progresso',
      };
    }

    if (conclusion === 'success') {
      return {
        icon: CheckCircle2,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        label: 'Sucesso',
      };
    }

    if (conclusion === 'failure' || conclusion === 'cancelled') {
      return {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        label: 'Falhou',
      };
    }

    return {
      icon: Clock,
      color: 'text-gray-500',
      bg: 'bg-gray-500/10',
      label: status,
    };
  };

  // Formatar data relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do conteúdo e uso de memória
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Total de Itens</h3>
          </div>
          <p className="text-3xl font-bold">{totalItems}</p>
        </div>

        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Uso Total</h3>
          </div>
          <p className="text-3xl font-bold">{totalSize} kB</p>
        </div>

        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Disponível (500 MB)</h3>
          </div>
          <p className="text-3xl font-bold">{((totalSize / 1024 / 500) * 100).toFixed(2)}%</p>
        </div>
      </div>

      {/* Estatísticas de Usuários */}
      {userStats && (
        <div className="mb-8">
          <h2 className="text-xl mb-4">Usuários</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-6 bg-card rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Total de Usuários</h3>
              </div>
              <p className="text-3xl font-bold">{userStats.totalUsers}</p>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Novos (Hoje)</h3>
              </div>
              <p className="text-3xl font-bold">{userStats.todayUsers}</p>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Novos (7 dias)</h3>
              </div>
              <p className="text-3xl font-bold">{userStats.weekUsers}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Distribuição por Nível */}
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="font-medium mb-4">Por Nível de Experiência</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Iniciante</span>
                  <span className="text-sm font-medium">{userStats.nivelCounts.iniciante}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Explorador</span>
                  <span className="text-sm font-medium">{userStats.nivelCounts.explorador}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Intermediário</span>
                  <span className="text-sm font-medium">{userStats.nivelCounts.intermediario}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avançado</span>
                  <span className="text-sm font-medium">{userStats.nivelCounts.avancado}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Especialista</span>
                  <span className="text-sm font-medium">{userStats.nivelCounts.especialista}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-muted-foreground">Não informado</span>
                  <span className="text-sm font-medium">{userStats.nivelCounts.naoInformado}</span>
                </div>
              </div>
            </div>

            {/* Top 5 Interesses */}
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="font-medium mb-4">Top 5 Áreas de Interesse</h3>
              <div className="space-y-3">
                {userStats.topInteresses.map((item, index) => (
                  <div key={item.interesse} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground capitalize">
                        {item.interesse.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{item.count} usuários</span>
                  </div>
                ))}
                {userStats.topInteresses.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum interesse registrado ainda
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detalhamento por Área */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Detalhamento por Área</h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Área</th>
                  <th className="text-left p-4 font-medium text-sm">Itens</th>
                  <th className="text-left p-4 font-medium text-sm">Tamanho</th>
                  <th className="text-right p-4 font-medium text-sm">% do Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sections.map((section) => (
                  <tr key={section.title} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`${section.color} p-2 rounded-lg`}>
                          <section.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{section.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {section.count} {section.count === 1 ? 'item' : 'itens'}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {section.size} kB
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {totalSize > 0 ? ((section.size / totalSize) * 100).toFixed(1) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GitHub Workflows */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">GitHub Workflows</h2>
          <a
            href="https://github.com/AiltonDomingues/ia-explicada-hub/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Ver no GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {workflowsLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p>Carregando workflows...</p>
            </div>
          ) : !workflows || workflows.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <GitBranch className="w-8 h-8 mx-auto mb-2" />
              <p>Nenhum workflow encontrado</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {workflows.map((workflow) => {
                const statusInfo = getWorkflowStatus(workflow.status, workflow.conclusion);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={workflow.id}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`${statusInfo.bg} p-2 rounded-lg mt-0.5`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium mb-1 truncate">{workflow.name}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              {workflow.head_branch}
                            </span>
                            <span>•</span>
                            <span>{formatRelativeTime(workflow.created_at)}</span>
                            <span>•</span>
                            <span className={statusInfo.color}>{statusInfo.label}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={workflow.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1 whitespace-nowrap"
                      >
                        Detalhes
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
        <h2 className="text-lg mb-2">Informações</h2>
        <p className="text-sm text-muted-foreground">
          Use o menu lateral para gerenciar cada área. Os tamanhos são estimados com base no conteúdo atual.
          O plano gratuito do Supabase oferece 500 MB de armazenamento.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
