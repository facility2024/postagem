import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Shield, Users, Plus, Ban, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface UserWithLicense {
  user_id: string;
  email: string;
  name: string;
  license: {
    id: string;
    plan_type: string;
    max_accounts: number | null;
    max_scheduled_posts: number | null;
    max_stories_per_month: number | null;
    is_active: boolean | null;
    expires_at: string | null;
  } | null;
}

const AdminPanel = () => {
  const { isAdmin, loading: authLoading, metadataLoading } = useAuth();
  const [users, setUsers] = useState<UserWithLicense[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    plan_type: "basic",
    max_accounts: 1,
    max_scheduled_posts: 10,
    max_stories_per_month: 30,
    expires_at: "",
  });

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from("user_profiles")
        .select("user_id, email, name")
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        setUsersLoading(false);
        return;
      }

      const { data: licenses } = await supabase.from("licenses").select("*");

      const merged = (profiles || []).map((p) => {
        const lic = licenses?.find((l) => l.user_id === p.user_id) || null;
        return { ...p, license: lic };
      });

      setUsers(merged);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({ title: "Erro", description: "Falha ao carregar usuários", variant: "destructive" });
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const openLicenseDialog = (userId: string, existingLicense?: any) => {
    setSelectedUserId(userId);
    if (existingLicense) {
      setForm({
        plan_type: existingLicense.plan_type || "basic",
        max_accounts: existingLicense.max_accounts || 1,
        max_scheduled_posts: existingLicense.max_scheduled_posts || 10,
        max_stories_per_month: existingLicense.max_stories_per_month || 30,
        expires_at: existingLicense.expires_at
          ? new Date(existingLicense.expires_at).toISOString().split("T")[0]
          : "",
      });
    } else {
      setForm({ plan_type: "basic", max_accounts: 1, max_scheduled_posts: 10, max_stories_per_month: 30, expires_at: "" });
    }
    setDialogOpen(true);
  };

  const handleSaveLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    const existing = users.find((u) => u.user_id === selectedUserId)?.license;
    const payload = {
      user_id: selectedUserId,
      plan_type: form.plan_type,
      max_accounts: form.max_accounts,
      max_scheduled_posts: form.max_scheduled_posts,
      max_stories_per_month: form.max_stories_per_month,
      is_active: true,
      expires_at: form.expires_at || null,
    };

    let error;
    if (existing) {
      ({ error } = await supabase.from("licenses").update(payload).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("licenses").insert(payload));
    }

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: existing ? "Licença atualizada!" : "Licença criada!" });
      setDialogOpen(false);
      fetchUsers();
    }
  };

  const handleRevoke = async (userId: string) => {
    if (!confirm("Revogar licença deste usuário?")) return;
    const { error } = await supabase
      .from("licenses")
      .update({ is_active: false })
      .eq("user_id", userId);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Licença revogada" });
      fetchUsers();
    }
  };

  if (authLoading || metadataLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Acesso negado. Apenas administradores.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Shield className="h-6 w-6" /> Painel Admin
          </h1>
          <p className="text-muted-foreground">Gerencie licenças e usuários</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Usuários ({users.length})
            </CardTitle>
            <CardDescription>Gerencie licenças dos usuários</CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p className="py-8 text-center text-muted-foreground">Carregando...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Contas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expira</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.user_id}>
                        <TableCell className="font-medium">{u.email}</TableCell>
                        <TableCell>{u.name || "-"}</TableCell>
                        <TableCell>
                          {u.license ? (
                            <Badge variant="outline">{u.license.plan_type}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{u.license?.max_accounts || "-"}</TableCell>
                        <TableCell>
                          {u.license ? (
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={!!u.license.is_active}
                                onCheckedChange={async (checked) => {
                                  const { error } = await supabase
                                    .from("licenses")
                                    .update({ is_active: checked })
                                    .eq("id", u.license!.id);
                                  if (error) {
                                    toast({ title: "Erro", description: error.message, variant: "destructive" });
                                  } else {
                                    toast({ title: checked ? "Licença ativada" : "Licença desativada" });
                                    fetchUsers();
                                  }
                                }}
                              />
                              <Badge className={u.license.is_active ? "bg-primary text-primary-foreground" : ""} variant={u.license.is_active ? "default" : "destructive"}>
                                {u.license.is_active ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="destructive">Sem licença</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {u.license?.expires_at
                            ? new Date(u.license.expires_at).toLocaleDateString("pt-BR")
                            : "Sem limite"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openLicenseDialog(u.user_id, u.license)}
                            >
                              {u.license ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                            {u.license?.is_active && (
                              <Button variant="ghost" size="icon" onClick={() => handleRevoke(u.user_id)}>
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {users.find((u) => u.user_id === selectedUserId)?.license
                  ? "Editar Licença"
                  : "Criar Licença"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveLicense} className="space-y-4">
              <div className="space-y-2">
                <Label>Plano</Label>
                <Select value={form.plan_type} onValueChange={(v) => setForm((p) => ({ ...p, plan_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Máx Contas</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.max_accounts}
                    onChange={(e) => setForm((p) => ({ ...p, max_accounts: +e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Máx Posts</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.max_scheduled_posts}
                    onChange={(e) => setForm((p) => ({ ...p, max_scheduled_posts: +e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stories/mês</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.max_stories_per_month}
                    onChange={(e) => setForm((p) => ({ ...p, max_stories_per_month: +e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expira em (opcional)</Label>
                <Input
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full">Salvar Licença</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AdminPanel;
