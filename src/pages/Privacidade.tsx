import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";

const Privacidade = () => {
  usePageTitle("Política de Privacidade");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Política de Privacidade</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Última atualização: 11 de abril de 2026
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Quem Somos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O <strong>IA Explicada HUB</strong> é uma plataforma educacional brasileira 
                dedicada à democratização do conhecimento sobre Inteligência Artificial.
              </p>
              <p>
                <strong>Controlador de Dados:</strong> IA Explicada HUB<br />
                <strong>Email para contato:</strong> admin.iaexplicada@gmail.com
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Dados que Coletamos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Coletamos os seguintes dados pessoais quando você cria uma conta:
              </p>

              <div className="ml-4 space-y-3">
                <div>
                  <strong className="text-primary">2.1 Dados de Cadastro (Obrigatórios)</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Nome completo</li>
                    <li>Nome de usuário (username)</li>
                    <li>Endereço de email</li>
                    <li>Senha (armazenada de forma criptografada)</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-primary">2.2 Dados de Perfil (Opcionais)</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Foto de perfil (avatar)</li>
                    <li>Biografia</li>
                    <li>Localização (cidade/estado)</li>
                    <li>Links de redes sociais (LinkedIn, GitHub, Portfolio)</li>
                    <li>Situação profissional/acadêmica</li>
                    <li>Instituição de ensino ou empresa</li>
                    <li>Área de atuação</li>
                    <li>Nível de experiência com IA</li>
                    <li>Objetivos de aprendizado</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-primary">2.3 Dados de Uso</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Áreas de interesse em IA selecionadas</li>
                    <li>Conteúdos favoritados</li>
                    <li>Histórico de visualização de conteúdo</li>
                    <li>Data e hora de acesso</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-primary">2.4 Dados Técnicos</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador</li>
                    <li>Sistema operacional</li>
                    <li>Cookies (quando necessário)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Como Usamos seus Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Utilizamos seus dados pessoais para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Criar e gerenciar sua conta</strong> - para autenticação e identificação</li>
                <li><strong>Personalizar conteúdo</strong> - recomendar cursos, ferramentas e materiais baseados em seus interesses</li>
                <li><strong>Salvar preferências</strong> - favoritos, histórico e configurações</li>
                <li><strong>Comunicação</strong> - enviar notificações importantes sobre o serviço (com seu consentimento)</li>
                <li><strong>Melhorar o serviço</strong> - análises agregadas e anônimas para aprimorar a plataforma</li>
                <li><strong>Segurança</strong> - prevenir fraudes e abusos</li>
                <li><strong>Cumprimento legal</strong> - atender obrigações legais quando necessário</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Base Legal (LGPD)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Processamos seus dados com base nas seguintes bases legais:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consentimento:</strong> Você concorda ao criar uma conta e aceitar esta política</li>
                <li><strong>Execução de contrato:</strong> Necessário para fornecer os serviços solicitados</li>
                <li><strong>Legítimo interesse:</strong> Melhoria do serviço e segurança da plataforma</li>
                <li><strong>Obrigação legal:</strong> Cumprimento de leis aplicáveis</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Compartilhamento de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>NÃO vendemos, alugamos ou comercializamos seus dados pessoais.</strong>
              </p>
              <p>Compartilhamos dados apenas nas seguintes situações:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Supabase (Provedor de Infraestrutura):</strong> Seus dados são armazenados 
                  de forma segura no Supabase, que atua como processador de dados sob nossas instruções.
                </li>
                <li>
                  <strong>Dados Públicos do Perfil:</strong> Nome de usuário, nome completo, biografia, 
                  localização e links sociais são visíveis para outros usuários (você controla o que preencher).
                </li>
                <li>
                  <strong>Obrigação Legal:</strong> Quando exigido por lei, ordem judicial ou autoridades competentes.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Segurança dos Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Implementamos medidas de segurança para proteger seus dados:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Criptografia:</strong> Senhas são armazenadas com hash criptográfico</li>
                <li><strong>HTTPS:</strong> Todas as comunicações são criptografadas em trânsito</li>
                <li><strong>RLS (Row Level Security):</strong> Controle de acesso a nível de linha no banco de dados</li>
                <li><strong>Autenticação segura:</strong> Tokens de sessão com expiração automática</li>
                <li><strong>Backups regulares:</strong> Para prevenir perda de dados</li>
              </ul>
              <p className="mt-4">
                Apesar de nossas medidas, nenhum sistema é 100% seguro. Você também é responsável 
                por manter sua senha segura e não compartilhá-la.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Seus Direitos (LGPD)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Você tem os seguintes direitos sobre seus dados pessoais:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acesso:</strong> Solicitar cópia dos seus dados</li>
                <li><strong>Correção:</strong> Atualizar dados incorretos ou incompletos (pode fazer direto no perfil)</li>
                <li><strong>Exclusão:</strong> Solicitar remoção dos seus dados</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Revogação do consentimento:</strong> Retirar autorização a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se a determinados processamentos</li>
                <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
              </ul>
              <p className="mt-4">
                Para exercer seus direitos, envie email para: <strong>admin.iaexplicada@gmail.com</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Retenção de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário 
                para fornecer serviços.
              </p>
              <p>
                <strong>Após exclusão da conta:</strong> Seus dados serão removidos em até 30 dias, 
                exceto informações que devemos reter por obrigação legal.
              </p>
              <p>
                <strong>Dados anônimos:</strong> Podemos reter dados agregados e anonimizados 
                indefinidamente para fins estatísticos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Cookies e Tecnologias Similares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Utilizamos cookies essenciais para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter você conectado (sessão de autenticação)</li>
                <li>Lembrar suas preferências</li>
                <li>Garantir segurança da plataforma</li>
              </ul>
              <p className="mt-4">
                Você pode desabilitar cookies nas configurações do navegador, mas isso pode 
                afetar a funcionalidade do site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Menores de Idade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nosso serviço é destinado a pessoas com 13 anos ou mais. Usuários entre 13 e 18 anos 
                devem ter autorização dos pais ou responsáveis.
              </p>
              <p>
                Não coletamos intencionalmente dados de crianças menores de 13 anos. Se descobrirmos 
                que coletamos dados de menores sem autorização, excluiremos imediatamente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Links para Sites Externos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nosso site contém links para sites externos (cursos, ferramentas, artigos). 
                Não somos responsáveis pelas práticas de privacidade desses sites.
              </p>
              <p>
                Recomendamos ler as políticas de privacidade de cada site que você visitar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Transferência Internacional de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Seus dados são armazenados em servidores do Supabase, que podem estar localizados 
                fora do Brasil.
              </p>
              <p>
                Garantimos que terceiros que processam dados em nosso nome mantêm níveis adequados 
                de proteção, em conformidade com a LGPD.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Alterações nesta Política</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Mudanças significativas 
                serão notificadas por email ou aviso no site.
              </p>
              <p>
                A data da "Última atualização" no topo indica quando a política foi modificada pela última vez.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Para dúvidas, exercício de direitos ou reclamações sobre privacidade:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li><strong>Email:</strong> admin.iaexplicada@gmail.com</li>
              </ul>
              <p className="mt-4">
                Você também pode registrar reclamações junto à Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
            </CardContent>
          </Card>

          <Alert className="mt-8">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Compromisso com sua Privacidade:</strong> Levamos a proteção dos seus dados 
              muito a sério e estamos comprometidos com transparência e conformidade com a LGPD. 
              Se tiver qualquer dúvida, entre em contato conosco.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacidade;
