import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getUserAvatarUrl, getUserDisplayName } from "@/lib/avatar";
import {
  LayoutDashboard,
  CalendarPlus,
  List,
  Link2,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import coconudiLogo from "@/assets/coconudi-logo.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Agendar", path: "/schedule-post", icon: CalendarPlus },
  { label: "Postagens", path: "/scheduled-posts", icon: List },
  { label: "Contas", path: "/connect-accounts", icon: Link2 },
];

const adminItems = [
  { label: "Admin", path: "/admin", icon: Shield },
];

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, signOut, license } = useAuth();
  const avatarUrl = getUserAvatarUrl(user);
  const displayName = getUserDisplayName(user);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allItems = [...navItems, ...(isAdmin ? adminItems : [])];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col bg-sidebar-background md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <img src={coconudiLogo} alt="Coconudi" className="h-8 w-auto" />
          <span className="text-lg font-bold text-sidebar-foreground">PostaFácil</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {allItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                location.pathname === item.path
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          {license && (
            <div className="mb-3 rounded-lg bg-sidebar-accent px-3 py-2 text-xs text-sidebar-foreground/70">
              <span className="font-semibold text-sidebar-foreground">
                Plano: {license.plan_type}
              </span>
              <br />
              Contas: {license.max_accounts} | Posts: {license.max_scheduled_posts}
            </div>
          )}
          <div className="mb-3 flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-sidebar-primary/30">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
              <p className="truncate text-xs text-sidebar-foreground/50">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 md:hidden">
          <div className="flex items-center gap-2">
            <img src={coconudiLogo} alt="Coconudi" className="h-7 w-auto" />
            <span className="font-bold text-foreground">PostaFácil</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-b border-border bg-card p-4 md:hidden">
            {allItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </nav>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};
