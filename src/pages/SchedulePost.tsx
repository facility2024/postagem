import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CalendarPlus, Facebook, Instagram, Image, Video, AlertTriangle } from "lucide-react";

interface SocialAccount {
  id: string;
  account_name: string;
  account_type: string;
  account_username: string | null;
}

const SchedulePost = () => {
  const navigate = useNavigate();
  const { user, license } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    video_url: "",
    post_type: "feed",
    scheduled_at: "",
    account_ids: [] as string[],
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("social_accounts")
      .select("id, account_name, account_type, account_username")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .then(({ data }) => setAccounts(data || []));
  }, [user]);

  const toggleAccount = (id: string) => {
    setForm((p) => ({
      ...p,
      account_ids: p.account_ids.includes(id)
        ? p.account_ids.filter((a) => a !== id)
        : [...p.account_ids, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (form.account_ids.length === 0) {
      toast({ title: "Erro", description: "Selecione pelo menos uma conta.", variant: "destructive" });
      return;
    }
    if (new Date(form.scheduled_at) <= new Date()) {
      toast({ title: "Erro", description: "A data deve ser no futuro.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("scheduled_posts").insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      image_url: form.image_url || null,
      video_url: form.video_url || null,
      post_type: form.post_type,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
      account_ids: form.account_ids,
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Postagem agendada!" });
      navigate("/scheduled-posts");
    }
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarPlus className="h-6 w-6" /> Agendar Postagem
            </CardTitle>
            <CardDescription>Selecione tipo, contas e agende sua publicação</CardDescription>
          </CardHeader>
          <CardContent>
            {!license && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive bg-destructive/10 p-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-sm">Você precisa de uma licença ativa para agendar postagens.</p>
              </div>
            )}

            {accounts.length === 0 && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma conta conectada.{" "}
                  <Button variant="link" className="h-auto p-0" onClick={() => navigate("/connect-accounts")}>
                    Conecte uma conta
                  </Button>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Tipo de Postagem</Label>
                <Select value={form.post_type} onValueChange={(v) => setForm((p) => ({ ...p, post_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feed">📸 Feed</SelectItem>
                    <SelectItem value="story">📖 Story</SelectItem>
                    <SelectItem value="reel">🎬 Reel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  placeholder="Título da postagem"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição / Legenda</Label>
                <Textarea
                  placeholder="Texto que será publicado..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={5}
                  required
                />
              </div>

              {(form.post_type === "feed" || form.post_type === "story") && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Image className="h-4 w-4" /> URL da Imagem
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={form.image_url}
                    onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                  />
                </div>
              )}

              {form.post_type === "reel" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Video className="h-4 w-4" /> URL do Vídeo
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={form.video_url}
                    onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Data e Hora</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => setForm((p) => ({ ...p, scheduled_at: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Selecione as Contas</Label>
                {accounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma conta disponível</p>
                ) : (
                  <div className="space-y-2">
                    {accounts.map((acc) => (
                      <div key={acc.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={form.account_ids.includes(acc.id)}
                          onCheckedChange={() => toggleAccount(acc.id)}
                        />
                        <Label className="flex cursor-pointer items-center gap-1">
                          {acc.account_type === "instagram" ? (
                            <Instagram className="h-4 w-4 text-pink-500" />
                          ) : (
                            <Facebook className="h-4 w-4 text-blue-500" />
                          )}
                          {acc.account_name}
                          {acc.account_username && (
                            <span className="text-muted-foreground">@{acc.account_username}</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || accounts.length === 0 || !license}
                className="w-full"
              >
                {loading
                  ? "Agendando..."
                  : `Agendar para ${form.account_ids.length} conta(s)`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SchedulePost;
