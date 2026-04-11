import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Save, User, Briefcase, Target, Settings, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile, useUserInteresses, useAddInteresse, useRemoveInteresse, useFavoritos } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const INTERESSES_OPTIONS = {
  machine_learning: 'Machine Learning',
  deep_learning: 'Deep Learning',
  nlp: 'NLP / LLMs',
  visao_computacional: 'Visão Computacional',
  ia_generativa: 'IA Generativa',
  mlops: 'MLOps',
  ia_etica: 'IA Ética',
  robotica: 'Robótica',
  data_science: 'Data Science',
  big_data: 'Big Data',
} as const;

const Perfil = () => {
  usePageTitle("Meu Perfil");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, deleteAccount } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: interesses = [] } = useUserInteresses(user?.id);
  const { data: favoritos = [] } = useFavoritos(user?.id);
  const updateProfile = useUpdateProfile();
  const addInteresse = useAddInteresse();
  const removeInteresse = useRemoveInteresse();
  
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: formData,
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const toggleInteresse = async (interesse: keyof typeof INTERESSES_OPTIONS) => {
    if (!user) return;
    
    const jaTemInteresse = interesses.some(i => i.interesse === interesse);
    
    try {
      if (jaTemInteresse) {
        await removeInteresse.mutateAsync({ userId: user.id, interesse });
      } else {
        await addInteresse.mutateAsync({ userId: user.id, interesse });
      }
    } catch (err: any) {
      // Tratar erro de duplicata de forma amigável
      if (err.code === '23505' || err.message?.includes('duplicate')) {
        setError("Este interesse já está selecionado.");
      } else {
        setError("Erro ao atualizar interesses. Tente novamente.");
      }
      console.error('Erro ao atualizar interesse:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setDeleting(true);
    setError(null);
    
    console.log('[DELETE ACCOUNT] Iniciando exclusão da conta...');
    
    try {
      const { error } = await deleteAccount();
      
      console.log('[DELETE ACCOUNT] Resposta:', { error });
      
      if (error) {
        console.error('[DELETE ACCOUNT] Erro:', error);
        
        // Mensagens de erro mais específicas
        let errorMessage = "Erro ao excluir conta";
        
        if (error.message?.includes('delete_user_account')) {
          errorMessage = "Erro: Função de exclusão não encontrada no banco de dados. Entre em contato com o suporte.";
        } else if (error.message?.includes('permission')) {
          errorMessage = "Erro: Permissão negada. Tente fazer logout e login novamente.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setDeleting(false);
        
        toast({
          variant: "destructive",
          title: "Erro ao excluir conta",
          description: errorMessage,
        });
      } else {
        console.log('[DELETE ACCOUNT] Conta excluída com sucesso!');
        
        toast({
          title: "Conta excluída com sucesso",
          description: "Sua conta e todos os dados foram removidos permanentemente.",
        });
        
        // Aguardar 1 segundo para o usuário ver a mensagem de sucesso
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }
    } catch (err: any) {
      console.error('[DELETE ACCOUNT] Exceção capturada:', err);
      const errorMsg = "Erro inesperado ao excluir conta. Tente novamente ou entre em contato com o suporte.";
      setError(errorMsg);
      setDeleting(false);
      
      toast({
        variant: "destructive",
        title: "Erro ao excluir conta",
        description: err.message || errorMsg,
      });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 px-4 py-12 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações profil e preferências
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertDescription>Perfil atualizado com sucesso!</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="dados" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados">
                <User className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Dados</span>
              </TabsTrigger>
              <TabsTrigger value="profissional">
                <Briefcase className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Profissional</span>
              </TabsTrigger>
              <TabsTrigger value="interesses">
                <Target className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Interesses</span>
              </TabsTrigger>
              <TabsTrigger value="config">
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Conta</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              {/* Tab: Dados Básicos */}
              <TabsContent value="dados" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                    <CardDescription>
                      Atualize seus dados pessoais e informações de contato
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome_completo">Nome Completo</Label>
                        <Input
                          id="nome_completo"
                          value={formData.nome_completo || ""}
                          onChange={(e) => handleChange("nome_completo", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Nome de Usuário</Label>
                        <Input
                          id="username"
                          value={formData.username || ""}
                          onChange={(e) => handleChange("username", e.target.value)}
                          required
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          O nome de usuário não pode ser alterado
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Conte um pouco sobre você..."
                        value={formData.bio || ""}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        maxLength={200}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {(formData.bio || "").length}/200
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        placeholder="Cidade, Estado"
                        value={formData.localizacao || ""}
                        onChange={(e) => handleChange("localizacao", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin_url">LinkedIn</Label>
                        <Input
                          id="linkedin_url"
                          type="text"
                          placeholder="linkedin.com/in/seu-perfil"
                          value={formData.linkedin_url || ""}
                          onChange={(e) => handleChange("linkedin_url", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github_url">GitHub</Label>
                        <Input
                          id="github_url"
                          type="text"
                          placeholder="github.com/seu-usuario"
                          value={formData.github_url || ""}
                          onChange={(e) => handleChange("github_url", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="portfolio_url">Portfólio</Label>
                        <Input
                          id="portfolio_url"
                          type="text"
                          placeholder="seu-site.com"
                          value={formData.portfolio_url || ""}
                          onChange={(e) => handleChange("portfolio_url", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Profissional/Acadêmico */}
              <TabsContent value="profissional" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Situação Profissional/Acadêmica</CardTitle>
                    <CardDescription>
                      Ajude-nos a personalizar seu conteúdo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="situacao">Situação Atual</Label>
                      <Select
                        value={formData.situacao || ""}
                        onValueChange={(value) => handleChange("situacao", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua situação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estudante">Estudante</SelectItem>
                          <SelectItem value="profissional">Profissional</SelectItem>
                          <SelectItem value="pesquisador">Pesquisador/Acadêmico</SelectItem>
                          <SelectItem value="empreendedor">Empreendedor</SelectItem>
                          <SelectItem value="transicao">Em transição de carreira</SelectItem>
                          <SelectItem value="explorando">Apenas explorando</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Campos para Estudante */}
                    {formData.situacao === "estudante" && (
                      <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="instituicao">Instituição</Label>
                          <Input
                            id="instituicao"
                            placeholder="Nome da universidade"
                            value={formData.instituicao || ""}
                            onChange={(e) => handleChange("instituicao", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="curso">Curso</Label>
                          <Input
                            id="curso"
                            placeholder="Nome do curso"
                            value={formData.curso || ""}
                            onChange={(e) => handleChange("curso", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="semestre">Semestre/Ano</Label>
                          <Input
                            id="semestre"
                            placeholder="Ex: 5º semestre"
                            value={formData.semestre || ""}
                            onChange={(e) => handleChange("semestre", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Campos para Profissional */}
                    {(formData.situacao === "profissional" || formData.situacao === "empreendedor") && (
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="empresa">Empresa (opcional)</Label>
                          <Input
                            id="empresa"
                            placeholder="Nome da empresa"
                            value={formData.empresa || ""}
                            onChange={(e) => handleChange("empresa", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cargo">Cargo</Label>
                          <Input
                            id="cargo"
                            placeholder="Seu cargo atual"
                            value={formData.cargo || ""}
                            onChange={(e) => handleChange("cargo", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="area_atuacao">Área de Atuação</Label>
                          <Select
                            value={formData.area_atuacao || ""}
                            onValueChange={(value) => handleChange("area_atuacao", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a área" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ti">TI / Tecnologia</SelectItem>
                              <SelectItem value="saude">Saúde</SelectItem>
                              <SelectItem value="financas">Finanças</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="educacao">Educação</SelectItem>
                              <SelectItem value="engenharia">Engenharia</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="vendas">Vendas</SelectItem>
                              <SelectItem value="juridico">Jurídico</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Experiência com IA */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="nivel_ia">Nível de Conhecimento em IA</Label>
                        <Select
                          value={formData.nivel_ia || ""}
                          onValueChange={(value) => handleChange("nivel_ia", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iniciante">Iniciante (nunca usei)</SelectItem>
                            <SelectItem value="explorador">Explorador (uso ferramentas prontas)</SelectItem>
                            <SelectItem value="intermediario">Intermediário (cursos/projetos)</SelectItem>
                            <SelectItem value="avancado">Avançado (trabalho profissionalmente)</SelectItem>
                            <SelectItem value="especialista">Especialista (pesquisa/desenvolvimento)</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {/* Checkbox para filtro automático */}
                        <div className="flex items-center space-x-2 mt-3 pt-2">
                          <Checkbox 
                            id="auto_filtrar"
                            checked={formData.auto_filtrar_por_nivel ?? true}
                            onCheckedChange={(checked) => handleChange("auto_filtrar_por_nivel", checked)}
                          />
                          <Label 
                            htmlFor="auto_filtrar" 
                            className="text-sm font-normal cursor-pointer"
                          >
                            Filtrar conteúdos por nível
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="trabalha_com_ia">Trabalha com IA?</Label>
                        <Select
                          value={formData.trabalha_com_ia || ""}
                          onValueChange={(value) => handleChange("trabalha_com_ia", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="funcao_principal">Sim, é minha função principal</SelectItem>
                            <SelectItem value="dia_a_dia">Sim, uso no dia a dia</SelectItem>
                            <SelectItem value="quer_trabalhar">Não, mas quero trabalhar</SelectItem>
                            <SelectItem value="interesse_pessoal">Não, só interesse pessoal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="objetivo">Seu Principal Objetivo</Label>
                      <Select
                        value={formData.objetivo || ""}
                        onValueChange={(value) => handleChange("objetivo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="O que você busca?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aprender_zero">Aprender do zero</SelectItem>
                          <SelectItem value="desenvolver_carreira">Desenvolver carreira em IA</SelectItem>
                          <SelectItem value="aplicar_trabalho">Aplicar IA no meu trabalho atual</SelectItem>
                          <SelectItem value="transicao_carreira">Fazer transição de carreira</SelectItem>
                          <SelectItem value="manter_atualizado">Me manter atualizado</SelectItem>
                          <SelectItem value="pesquisa_academica">Pesquisa acadêmica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Interesses */}
              <TabsContent value="interesses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Áreas de Interesse</CardTitle>
                    <CardDescription>
                      Selecione as áreas de IA que mais te interessam
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(INTERESSES_OPTIONS).map(([key, label]) => {
                        const isSelected = interesses.some(i => i.interesse === key);
                        return (
                          <Badge
                            key={key}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2 text-sm"
                            onClick={() => toggleInteresse(key as keyof typeof INTERESSES_OPTIONS)}
                          >
                            {label}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Configurações da Conta */}
              <TabsContent value="config" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações da Conta</CardTitle>
                    <CardDescription>
                      Gerencie sua conta e privacidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Informações da Conta */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Membro desde</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          }) : '—'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium mb-4">Zona de Perigo</h3>
                      
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          A exclusão da conta é permanente e não pode ser desfeita. Todos os seus dados, incluindo favoritos, interesses e histórico serão perdidos.
                        </AlertDescription>
                      </Alert>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={deleting}>
                            {deleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Excluindo...
                              </>
                            ) : (
                              <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir Conta Permanentemente
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                              <p>
                                Esta ação <strong>não pode ser desfeita</strong>. Isso irá excluir permanentemente sua conta e remover todos os seus dados dos nossos servidores.
                              </p>
                              <p className="text-destructive font-medium">
                                ⚠️ Você perderá:
                              </p>
                              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                                <li>Todos os seus favoritos ({favoritos.length} itens)</li>
                                <li>Suas áreas de interesse ({interesses.length} selecionadas)</li>
                                <li>Seu histórico de navegação</li>
                                <li>Todas as informações do seu perfil</li>
                              </ul>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sim, excluir permanentemente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Botão de Salvar (exceto na tab de configurações) */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData(profile)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Perfil;
