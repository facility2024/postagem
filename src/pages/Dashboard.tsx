import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, CheckCircle, XCircle, Clock, Link2, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const { user, license } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ scheduled: 0, posted: 0, failed: 0, accounts: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [postsRes, accountsRes] = await Promise.all([
        supabase.from("scheduled_posts").select("status").eq("user_id", user.id),
        supabase.from("social_accounts").select("id").eq("user_id", user.id),
      ]);
      const posts = postsRes.data || [];
      setStats({
        scheduled: posts.filter((p) => p.status === "scheduled").length,
        posted: posts.filter((p) => p.status === "posted").length,
        failed: posts.filter((p) => p.status === "failed").length,
        accounts: accountsRes.data?.length || 0,
      });
    };
    fetchStats();
  }, [user]);

  const cards = [
    { title: "Agendadas", value: stats.scheduled, icon: Clock, color: "text-blue-500" },
    { title: "Publicadas", value: stats.posted, icon: CheckCircle, color: "text-green-500" },
    { title: "Falharam", value: stats.failed, icon: XCircle, color: "text-destructive" },
    { title: "Contas", value: stats.accounts, icon: Link2, color: "text-primary" },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao PostaFácil{license ? ` — Plano ${license.plan_type}` : ""}
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{c.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!license && (
          <Card className="mb-8 border-destructive">
            <CardContent className="flex items-center gap-4 py-6">
              <BarChart3 className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-semibold text-foreground">Sem licença ativa</p>
                <p className="text-sm text-muted-foreground">
                  Você ainda não possui uma licença. Entre em contato com o administrador.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => navigate("/schedule-post")}
          >
            <CardContent className="flex items-center gap-4 py-6">
              <CalendarPlus className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Nova Postagem</p>
                <p className="text-sm text-muted-foreground">Agendar uma nova publicação</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => navigate("/connect-accounts")}
          >
            <CardContent className="flex items-center gap-4 py-6">
              <Link2 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Conectar Contas</p>
                <p className="text-sm text-muted-foreground">Adicionar Facebook ou Instagram</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
