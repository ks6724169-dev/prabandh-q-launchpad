import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Wallet, CalendarCheck, LogOut, Menu, Sparkles, Brain, Building2, GraduationCap, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TenantProvider, useTenant } from "@/components/tenant";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard · Prabandh Q" }] }),
  component: AdminLayout,
});

type NavTo = "/admin" | "/admin/people" | "/admin/fees" | "/admin/attendance" | "/admin/ai" | "/admin/onboard" | "/admin/admissions" | "/admin/staff" | "/admin/modules";
type NavItem = { to: NavTo; label: string; icon: typeof LayoutDashboard; exact?: boolean; badge?: string; group?: string };
const NAV: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/people", label: "Students & Staff", icon: Users },
  { to: "/admin/fees", label: "Fees", icon: Wallet },
  { to: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/admin/ai", label: "Prabandh Q AI", icon: Brain, badge: "Premium" },
  { to: "/admin/modules", label: "All Modules", icon: Building2, badge: "30" },
  { to: "/admin/onboard", label: "Institute Onboarding", icon: Building2, group: "Forms" },
  { to: "/admin/admissions", label: "New Admission", icon: GraduationCap, group: "Forms" },
  { to: "/admin/staff", label: "Add Teacher / Staff", icon: UserPlus, group: "Forms" },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const tenant = useTenant();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 border-b border-border/60 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="font-display text-lg font-extrabold tracking-tight">
          Prabandh<span className="text-primary"> Q</span>
        </span>
      </Link>

      <div className="px-5 py-4">
        <div className="rounded-xl border border-border/60 bg-gradient-card p-3 shadow-soft">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active Tenant</p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">{tenant.name}</p>
          <p className="text-xs capitalize text-primary">{tenant.type} workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {NAV.map((item, idx) => {
          const active = item.exact ? path === item.to : path.startsWith(item.to);
          const Icon = item.icon;
          const showGroup = item.group && (idx === 0 || NAV[idx - 1].group !== item.group);
          return (
            <div key={item.to}>
              {showGroup && (
                <p className="mb-1 mt-3 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  {item.group}
                </p>
              )}
              <Link
                to={item.to}
                onClick={onNav}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-hero text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                    active ? "bg-white/20 text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>


      <div className="border-t border-border/60 p-3">
        <LogoutButton onNav={onNav} />
      </div>
    </div>
  );
}

function LogoutButton({ onNav }: { onNav?: () => void }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await supabase.auth.signOut();
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("pq_institute_id");
          window.localStorage.removeItem("pq_institute_type");
          window.localStorage.removeItem("pq_institute_name");
          window.localStorage.removeItem("pq_is_ai_premium");
        }
        toast.success("Signed out successfully.");
        onNav?.();
        navigate({ to: "/" });
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {busy ? "Signing out…" : "Log out"}
    </button>
  );
}

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const tenant = useTenantWrap();

  return (
    <TenantProvider>
      <div className="flex min-h-screen w-full bg-secondary/40">
        <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-background lg:block">
          <SidebarContent />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md lg:px-8">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SidebarContent onNav={() => setOpen(false)} />
                </SheetContent>
              </Sheet>
              <h1 className="text-sm font-semibold text-muted-foreground">
                Admin Console <span className="text-foreground">/ {tenant}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden h-2 w-2 rounded-full bg-accent-emerald sm:inline-block" />
              <span className="hidden sm:inline">All systems operational</span>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}

function useTenantWrap() {
  // Header needs tenant name but is rendered above TenantProvider's children.
  // Must return same value on SSR and first client render to avoid hydration
  // mismatch — only read localStorage after mount.
  const [name, setName] = useState<string>("Demo Institute");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("pq_institute_name");
    if (stored) setName(stored);
  }, []);
  return name;
}

