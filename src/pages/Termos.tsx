import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Termos = () => {
  usePageTitle("Termos de Serviço");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Termos de Serviço</h1>
          <p className="text-muted-foreground text-sm">
            Última atualização: 11 de abril de 2026
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Aceitação dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Ao acessar e usar o <strong>IA Explicada HUB</strong>, você concorda com estes 
                Termos de Serviço. Se você não concordar com qualquer parte destes termos, 
                não deve usar nosso site.
              </p>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                Alterações entrarão em vigor imediatamente após a publicação.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Descrição do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O IA Explicada HUB é uma plataforma educacional gratuita que oferece:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Curadoria de conteúdo sobre Inteligência Artificial</li>
                <li>Recomendações de cursos, ferramentas e materiais educacionais</li>
                <li>Artigos e guias sobre conceitos de IA</li>
                <li>Agregação de notícias e novidades da área</li>
                <li>Sistema de perfil para personalização de conteúdo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Cadastro e Conta de Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>3.1 Idade Mínima:</strong> Você deve ter pelo menos 13 anos de idade 
                para criar uma conta. Usuários menores de 18 anos devem ter autorização dos 
                pais ou responsáveis.
              </p>
              <p>
                <strong>3.2 Veracidade:</strong> Você concorda em fornecer informações verdadeiras, 
                precisas e atualizadas durante o cadastro.
              </p>
              <p>
                <strong>3.3 Segurança:</strong> Você é responsável por manter a confidencialidade 
                da sua senha e por todas as atividades realizadas em sua conta.
              </p>
              <p>
                <strong>3.4 Cancelamento:</strong> Podemos suspender ou encerrar sua conta se 
                houver violação destes termos ou uso indevido da plataforma.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Conteúdo de Terceiros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>4.1 Curadoria:</strong> Grande parte do conteúdo apresentado consiste 
                em links e referências a recursos externos (cursos, artigos, ferramentas).
              </p>
              <p>
                <strong>4.2 Não Endossamos:</strong> A inclusão de um link ou recurso não 
                constitui endosso ou garantia de qualidade, adequação ou veracidade.
              </p>
              <p>
                <strong>4.3 Responsabilidade:</strong> Não somos responsáveis pelo conteúdo, 
                políticas de privacidade ou práticas de sites e serviços de terceiros.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>5.1 Nosso Conteúdo:</strong> Todo conteúdo original criado pelo 
                IA Explicada HUB (artigos, guias, estrutura do site) é protegido por direitos 
                autorais.
              </p>
              <p>
                <strong>5.2 Uso Permitido:</strong> Você pode visualizar, baixar e imprimir 
                conteúdo para uso pessoal e educacional, desde que mantenha os créditos.
              </p>
              <p>
                <strong>5.3 Uso Proibido:</strong> É proibido copiar, modificar, distribuir 
                ou usar comercialmente nosso conteúdo sem autorização prévia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Uso Aceitável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Você concorda em NÃO usar o IA Explicada HUB para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violar leis locais, estaduais, nacionais ou internacionais</li>
                <li>Publicar ou transmitir conteúdo ofensivo, difamatório ou ilegal</li>
                <li>Fazer spam ou enviar comunicações não solicitadas</li>
                <li>Interferir no funcionamento do site ou servidores</li>
                <li>Coletar dados de outros usuários sem consentimento</li>
                <li>Fazer engenharia reversa ou tentar acessar áreas restritas</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>7.1 Conteúdo Educacional:</strong> Todo conteúdo é fornecido apenas 
                para fins educacionais e informativos. Não oferecemos garantias sobre 
                precisão, atualidade ou completude.
              </p>
              <p>
                <strong>7.2 "Como Está":</strong> O serviço é fornecido "no estado em que se 
                encontra", sem garantias de qualquer tipo, expressas ou implícitas.
              </p>
              <p>
                <strong>7.3 Sem Garantias Profissionais:</strong> Não somos responsáveis por 
                decisões profissionais ou acadêmicas tomadas com base em nosso conteúdo.
              </p>
              <p>
                <strong>7.4 Danos:</strong> Em nenhuma hipótese seremos responsáveis por danos 
                diretos, indiretos, incidentais ou consequenciais resultantes do uso ou 
                impossibilidade de uso do site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Privacidade e Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O uso de seus dados pessoais está descrito em nossa{" "}
                <a href="/privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </a>
                , que faz parte integrante destes Termos de Serviço.
              </p>
              <p>
                Estamos comprometidos com a proteção da sua privacidade e cumprimento da 
                LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Modificações do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer 
                parte do serviço a qualquer momento, com ou sem aviso prévio.
              </p>
              <p>
                Não seremos responsáveis por você ou terceiros por qualquer modificação, 
                suspensão ou descontinuação do serviço.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Lei Aplicável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Estes Termos de Serviço são regidos pelas leis da República Federativa do 
                Brasil.
              </p>
              <p>
                Qualquer disputa relacionada a estes termos será submetida ao foro da 
                comarca de [Sua Cidade], Estado de [Seu Estado], com exclusão de qualquer outro.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Para questões sobre estes Termos de Serviço, entre em contato conosco:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li><strong>Email:</strong> admin.iaexplicada@gmail.com</li>
                <li><strong>Site:</strong> iaexplicada.ia.br</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Termos;
