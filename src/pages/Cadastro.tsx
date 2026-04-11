import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, UserPlus, User, AtSign, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCheckUsername } from "@/hooks/useSupabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Cadastro = () => {
  usePageTitle("Cadastro");
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Verificar disponibilidade do username
  const { data: usernameCheck, isLoading: checkingUsername } = useCheckUsername(debouncedUsername);

  // Debounce do username (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(formData.username);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }

    if (formData.username.length < 3) {
      setError("O nome de usuário deve ter pelo menos 3 caracteres");
      return false;
    }

    // Validar username (apenas letras, números, underscore e hífen)
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      setError("Nome de usuário pode conter apenas letras, números, _ e -");
      return false;
    }

    // Verificar se username está disponível
    if (usernameCheck?.available === false) {
      setError(`O nome de usuário "${formData.username}" já está em uso. Escolha outro.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        nome_completo: formData.nomeCompleto,
        username: formData.username,
      });
      
      if (error) {
        // Detectar tipo de erro e mostrar mensagem amigável
        const errorMsg = error.message.toLowerCase();
        const errorCode = (error as any).code;
        
        if (errorMsg.includes("already registered") || errorMsg.includes("user already registered")) {
          setError("Este email já está cadastrado. Tente fazer login.");
        } else if (errorCode === '23505' || errorMsg.includes("duplicate key") || errorMsg.includes("unique constraint")) {
          // Erro de chave duplicada (username ou email)
          if (errorMsg.includes("username") || errorMsg.includes("profiles_username_key")) {
            setError(`O nome de usuário "${formData.username}" já está em uso. Tente outro.`);
          } else if (errorMsg.includes("email") || errorMsg.includes("profiles_email_key")) {
            setError("Este email já está cadastrado. Tente fazer login.");
          } else {
            setError("Nome de usuário ou email já está em uso. Tente outros valores.");
          }
        } else if (errorMsg.includes("invalid email")) {
          setError("Email inválido. Verifique o formato.");
        } else if (errorMsg.includes("password")) {
          setError("Senha muito fraca. Use pelo menos 6 caracteres com letras e números.");
        } else if (errorMsg.includes("rate limit")) {
          setError("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
        } else {
          // Mostrar mensagem genérica mas informativa
          setError(`Erro ao criar conta: ${error.message}`);
        }
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      setError("Erro inesperado ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
              <CardDescription>
                Junte-se à comunidade IA Explicada Hub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>
                    Conta criada com sucesso! Redirecionando...
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nomeCompleto"
                      name="nomeCompleto"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      className="pl-10"
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="nomedeusuario"
                      value={formData.username}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${
                        formData.username.length >= 3 && usernameCheck?.available === false
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : formData.username.length >= 3 && usernameCheck?.available === true
                          ? 'border-green-500 focus-visible:ring-green-500'
                          : ''
                      }`}
                      required
                      disabled={loading || success}
                      minLength={3}
                      pattern="[a-zA-Z0-9_-]+"
                    />
                    {/* Indicador de disponibilidade */}
                    {formData.username.length >= 3 && (
                      <div className="absolute right-3 top-3">
                        {checkingUsername ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : usernameCheck?.available === true ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : usernameCheck?.available === false ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {/* Mensagem de disponibilidade */}
                  {formData.username.length >= 3 && usernameCheck && (
                    <p className={`text-xs ${
                      usernameCheck.available === true
                        ? 'text-green-600'
                        : usernameCheck.available === false
                        ? 'text-red-600'
                        : 'text-muted-foreground'
                    }`}>
                      {usernameCheck.message}
                    </p>
                  )}
                  {formData.username.length < 3 && (
                    <p className="text-xs text-muted-foreground">
                      Apenas letras, números, _ e - (sem espaços)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                      required
                      disabled={loading || success}
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10"
                      required
                      disabled={loading || success}
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    loading || 
                    success || 
                    checkingUsername || 
                    (formData.username.length >= 3 && usernameCheck?.available === false)
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : checkingUsername ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm mt-4">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Faça login
                </Link>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link to="/termos" className="underline hover:text-foreground">
                  Termos de Serviço
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cadastro;
