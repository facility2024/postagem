import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LogIn, UserPlus } from "lucide-react";
import coconudiLogo from "@/assets/coconudi-logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ email: "", password: "", name: "" });

  const FALLBACK_AUTH_ORIGIN = "https://postagensfacilty.lovable.app";
  const getAuthOrigin = () => {
    const origin = window.location.origin;
    const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
    return isLocalhostOrigin ? FALLBACK_AUTH_ORIGIN : origin;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const nextFromQuery = new URLSearchParams(location.search).get("next");
    const redirectTarget = nextFromQuery || ((location.state as { from?: string } | null)?.from ?? "/dashboard");
    const safeRedirectTarget = redirectTarget.startsWith("/") && !redirectTarget.startsWith("/auth") ? redirectTarget : "/dashboard";

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate(safeRedirectTarget, { replace: true });
      toast({ title: "Login realizado com sucesso" });
    } catch (error) {
      console.error("Login error:", error);
      toast({ title: "Erro", description: "Falha inesperada no login", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
      options: {
        data: { name: signupForm.name },
        emailRedirectTo: getAuthOrigin(),
      },
    });
    if (error) {
      const msg = error.message.toLowerCase().includes("rate limit") || error.status === 429
        ? "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente."
        : error.message;
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } else {
      toast({ title: "Conta criada!", description: "Verifique seu email para confirmar." });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <img
            src={coconudiLogo}
            alt="Coconudi Logo"
            className="mx-auto h-20 w-auto drop-shadow-lg"
          />
          <h1
            className="mt-5 text-3xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(90deg, #ff0000, #ff8800, #ffdd00, #00cc44, #0088ff, #8800ff, #ff00cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PostaFácil
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agendamento de postagens para redes sociais
          </p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5 backdrop-blur-sm">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <LogIn className="h-5 w-5 text-primary" /> Login
                </CardTitle>
                <CardDescription>Entre com seu email e senha</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      required
                    />
                  </div>
                    <Button type="submit" disabled={loading} className="w-full font-semibold">
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                        onClick={async () => {
                          if (!loginForm.email) {
                            toast({ title: "Informe seu email", description: "Preencha o campo de email antes de solicitar a recuperação.", variant: "destructive" });
                            return;
                          }
                          const { error } = await supabase.auth.resetPasswordForEmail(loginForm.email, {
                            redirectTo: `${getAuthOrigin()}/reset-password`,
                          });
                          if (error) {
                            const msg = error.message.toLowerCase().includes("rate limit")
                              ? "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente."
                              : error.message;
                            toast({ title: "Erro", description: msg, variant: "destructive" });
                          } else {
                            toast({ title: "Email enviado!", description: "Verifique sua caixa de entrada para redefinir sua senha." });
                          }
                        }}
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <UserPlus className="h-5 w-5 text-primary" /> Cadastrar
                </CardTitle>
                <CardDescription>Crie sua conta gratuitamente</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome</Label>
                    <Input
                      id="signup-name"
                      placeholder="Seu nome"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full font-semibold">
                    {loading ? "Criando..." : "Criar Conta"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Coconudi. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Auth;
