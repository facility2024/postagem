import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { CalendarPlus, Trash2, RefreshCw } from "lucide-react";

interface ScheduledPost {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: string;
  post_type: string | null;
  account_ids: string[] | null;
  error_message: string | null;
  posted_at: string | null;
}

const ScheduledPosts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("scheduled_posts")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_at", { ascending: false });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setPosts((data as ScheduledPost[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const deletePost = async (id: string) => {
    if (!confirm("Deletar esta postagem?")) return;
    const { error } = await supabase.from("scheduled_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deletado" });
      fetchPosts();
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">⏱️ Agendado</Badge>;
      case "posted":
        return <Badge className="bg-green-600 hover:bg-green-700">✅ Postado</Badge>;
      case "failed":
        return <Badge variant="destructive">❌ Falhou</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const postTypeLabel = (t: string | null) => {
    switch (t) {
      case "story": return "📖 Story";
      case "reel": return "🎬 Reel";
      default: return "📸 Feed";
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Postagens Agendadas</h1>
            <p className="text-muted-foreground">Gerencie suas publicações</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchPosts}>
              <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
            </Button>
            <Button onClick={() => navigate("/schedule-post")}>
              <CalendarPlus className="mr-2 h-4 w-4" /> Nova
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <p className="py-8 text-center text-muted-foreground">Carregando...</p>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                <CalendarPlus className="h-12 w-12" />
                <p>Nenhuma postagem agendada</p>
                <Button onClick={() => navigate("/schedule-post")}>Criar primeira</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Agendado para</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contas</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{postTypeLabel(post.post_type)}</TableCell>
                        <TableCell>{new Date(post.scheduled_at).toLocaleString("pt-BR")}</TableCell>
                        <TableCell>{statusBadge(post.status)}</TableCell>
                        <TableCell>{post.account_ids?.length || 0}</TableCell>
                        <TableCell className="text-right">
                          {post.status === "scheduled" && (
                            <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
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

export default ScheduledPosts;
