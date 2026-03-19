import { User, Target, Heart, Mail, Linkedin, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { usePageTitle } from "@/hooks/usePageTitle";
import PageHeader from "@/components/PageHeader";

const Sobre = () => {
  usePageTitle("Sobre");
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader 
        title="Sobre" 
        highlight="Nós"
        subtitle="Conheça a missão, valores e a equipe por trás do IA Explicada Hub"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* O que é o IA Explicada */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">O que é o IA Explicada?</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              O <span className="text-primary font-semibold">IA Explicada Hub</span> é uma plataforma centralizada 
              dedicada a democratizar o conhecimento sobre Inteligência Artificial e suas aplicações práticas.
            </p>
            <p>
              Nosso objetivo é reunir, curar e organizar os melhores recursos de aprendizado sobre IA, 
              Machine Learning, Deep Learning e tecnologias relacionadas, tornando esse conhecimento 
              acessível para estudantes, profissionais e entusiastas.
            </p>
          </div>
        </section>

        {/* Nosso Propósito */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Nosso Propósito</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-semibold mb-3 text-lg">Democratização do Conhecimento</h3>
              <p className="text-muted-foreground">
                Tornar o aprendizado de IA acessível a todos, independente do nível de experiência, 
                através de conteúdo curado e organizado.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-semibold mb-3 text-lg">Comunidade Brasileira</h3>
              <p className="text-muted-foreground">
                Fortalecer a comunidade brasileira de IA, reunindo recursos em português e 
                facilitando o networking entre profissionais da área.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-semibold mb-3 text-lg">Curadoria de Qualidade</h3>
              <p className="text-muted-foreground">
                Selecionar e filtrar apenas os melhores artigos, cursos e materiais, 
                economizando seu tempo na busca por conhecimento relevante.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-semibold mb-3 text-lg">Atualização Constante</h3>
              <p className="text-muted-foreground">
                Manter o conteúdo sempre atualizado com as últimas novidades, pesquisas e 
                tendências do mundo da Inteligência Artificial.
              </p>
            </div>
          </div>
        </section>

        {/* Quem Criou */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Quem Criou</h2>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-3xl border border-primary/20">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <img 
                  src="/foto-ailton.jfif" 
                  alt="Ailton Domingues" 
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-primary/20"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Ailton Domingues</h3>
                <p className="text-primary font-medium mb-4">Data Scientist & ML Engineer</p>

                <div className="space-y-3 text-muted-foreground mb-6">
                  <p>
                    Especialista em Ciência de Dados e Machine Learning com vasta experiência em projetos 
                    de análise de dados, modelagem preditiva e implementação de soluções de IA em ambientes 
                    corporativos.
                  </p>
                  <p>
                    Formado em Sistemas de Informação pela USP, Ailton tem trabalhado na interseção entre 
                    dados e negócios, transformando informações complexas em insights acionáveis e soluções práticas.
                  </p>
                  <p>
                    Apaixonado por educação e compartilhamento de conhecimento, criou o IA Explicada Hub 
                    para ajudar outros profissionais e estudantes a navegarem pelo vasto universo da 
                    Inteligência Artificial de forma estruturada e eficiente.
                  </p>
                </div>

                {/* Links de Contato */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:tomdominguesp@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted rounded-xl border border-border transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ailton-domingues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted rounded-xl border border-border transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/AiltonDomingues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted rounded-xl border border-border transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">GitHub</span>
                  </a>
                </div>

                {/* Destaques Profissionais */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold mb-3">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Machine Learning</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Python</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Data Science</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Deep Learning</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">NLP</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Computer Vision</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">MLOps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-card rounded-2xl border border-border">
          <h3 className="text-xl font-bold mb-3">Tem sugestões ou feedback?</h3>
          <p className="text-muted-foreground mb-4">
            Estamos sempre buscando melhorar. Entre em contato para sugestões de conteúdo, 
            parcerias ou colaborações.
          </p>
          <a
            href="mailto:tomdominguesp@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Entrar em Contato
          </a>
        </section>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Sobre;
