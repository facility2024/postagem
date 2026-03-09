import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Facebook, Instagram, Plus, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface SocialAccount {
  id: string;
  account_name: string;
  account_type: string;
  account_username: string | null;
  account_id: string;
  is_active: boolean | null;
  connected_at: string | null;
}

// Função para obter o redirect URI dinâmico
const getOAuthRedirectUri = (): string => {
  const origin = window.location.origin;
  // Valida se a origem é válida (não localhost em produção)
  return `${origin}/connect-accounts`;
};

const ConnectAccounts = () => {
  const { user, license } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchAccounts = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("social_accounts")
      .select("id, account_name, account_type, account_username, account_id, is_active, connected_at")
      .eq("user_id", user.id)
      .order("connected_at", { ascending: false });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  };

  // Handle OAuth callback code
  const handleOAuthCallback = useCallback(async (code: string) => {
    if (!user || connecting) return;
    setConnecting(true);

    // Clear code from URL
    setSearchParams({}, { replace: true });

    try {
      const redirectUri = getOAuthRedirectUri();
      
      const { data, error } = await supabase.functions.invoke("instagram-oauth", {
        body: {
          action: "exchange_code",
          code,
          redirect_uri: redirectUri,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const fetchedAccounts = data.accounts || [];
      if (fetchedAccounts.length === 0) {
        toast({
          title: "Nenhuma conta encontrada",
          description: "Nenhuma Página do Facebook ou conta Instagram Business foi encontrada. Verifique se sua conta tem uma Página vinculada.",
          variant: "destructive",
        });
        setConnecting(false);
        return;
      }

      // Save accounts to database
      let saved = 0;
      for (const acc of fetchedAccounts) {
        const { error: insertError } = await supabase.from("social_accounts").upsert(
          {
            user_id: user.id,
            account_name: acc.account_name,
            account_type: acc.account_type,
            account_username: acc.account_username,
            account_id: acc.account_id,
            access_token: acc.access_token,
          },
          { onConflict: "user_id,account_id" as any }
        );
        if (!insertError) saved++;
      }

      toast({
        title: "Contas conectadas!",
        description: `${saved} conta(s) foram conectadas com sucesso.`,
      });
      fetchAccounts();
    } catch (err: any) {
      console.error("OAuth exchange error:", err);
      toast({
        title: "Erro ao conectar",
        description: err.message || "Falha ao processar autorização do Facebook",
        variant: "destructive",
      });
    }

    setConnecting(false);
  }, [user, connecting]);

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    if (error) {
      toast({
        title: "Erro na autorização",
        description: errorDescription || error,
        variant: "destructive",
      });
      setSearchParams({}, { replace: true });
      return;
    }
    
    if (code && user) {
      handleOAuthCallback(code);
    }
  }, [searchParams, user]);

  const maxAccounts = license?.max_accounts || 0;
  const canAdd = accounts.length < maxAccounts;

  const handleConnectOAuth = async () => {
    try {
      const redirectUri = getOAuthRedirectUri();
      
      const { data, error } = await supabase.functions.invoke("instagram-oauth", {
        body: {
          action: "get_login_url",
          redirect_uri: redirectUri,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Redirect to Facebook OAuth
      window.location.href = data.login_url;
    } catch (err: any) {
      console.error("OAuth connection error:", err);
      toast({
        title: "Erro",
        description: err.message || "Falha ao iniciar conexão com Facebook",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta conta?")) return;
    const { error } = await supabase.from("social_accounts").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Conta removida" });
      fetchAccounts();
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contas Conectadas</h1>
            <p className="text-muted-foreground">
              {accounts.length}/{maxAccounts} conta(s) conectadas
            </p>
          </div>

          <Button
            onClick={handleConnectOAuth}
            disabled={!canAdd || !license || connecting}
          >
            {connecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {connecting ? "Conectando..." : "Conectar com Facebook"}
          </Button>
        </div>

        {connecting && (
          <Card className="mb-6 border-primary">
            <CardContent className="flex items-center gap-3 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm text-foreground">
                Processando autorização... Aguarde enquanto conectamos suas contas.
              </p>
            </CardContent>
          </Card>
        )}

        {!license && (
          <Card className="mb-6 border-destructive">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-foreground">
                Você não possui licença ativa. Fale com o administrador para liberar acesso.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Suas Contas</CardTitle>
            <CardDescription>
              Clique em "Conectar com Facebook" para vincular automaticamente suas contas do Instagram e Facebook
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-muted-foreground">Carregando...</p>
            ) : accounts.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                <Plus className="h-12 w-12" />
                <p>Nenhuma conta conectada</p>
                <p className="text-sm text-center max-w-md">
                  Clique no botão acima para fazer login com sua conta do Facebook/Instagram e conectar automaticamente.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rede</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Conectado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((acc) => (
                      <TableRow key={acc.id}>
                        <TableCell>
                          {acc.account_type === "instagram" ? (
                            <Instagram className="h-5 w-5 text-pink-600" />
                          ) : (
                            <Facebook className="h-5 w-5 text-blue-600" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{acc.account_name}</TableCell>
                        <TableCell>{acc.account_username ? `@${acc.account_username}` : "-"}</TableCell>
                        <TableCell>
                          {acc.connected_at ? new Date(acc.connected_at).toLocaleDateString("pt-BR") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(acc.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ConnectAccounts;
