import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileCheck2, GraduationCap, CalendarCheck, BookOpen, NotebookPen,
  CalendarRange, Wallet, Calculator, UserCog, Briefcase, BadgeDollarSign, HeartHandshake,
  MessagesSquare, Bus, BedDouble, Library, Boxes, HeartPulse, PartyPopper, ShieldCheck,
  Lock, BarChart3, FileText, Smartphone, Globe2, Brain, Plug, Building2, FolderKanban,
  LogOut, Menu, Search, Bell, MessageCircle, ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TenantProvider, useTenant } from "@/components/tenant";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "EduSmart ERP · Admin" }] }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean };

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/modules/admissions-mgmt", label: "Admission Management", icon: FileCheck2 },
  { to: "/admin/modules/students", label: "Student Management", icon: GraduationCap },
  { to: "/admin/modules/attendance-mgmt", label: "Attendance Management", icon: CalendarCheck },
  { to: "/admin/modules/academics", label: "Academic Management", icon: BookOpen },
  { to: "/admin/modules/exams", label: "Examination Management", icon: NotebookPen },
  { to: "/admin/modules/homework", label: "Homework & Assignment", icon: NotebookPen },
  { to: "/admin/modules/timetable", label: "Timetable Management", icon: CalendarRange },
  { to: "/admin/modules/fees-mgmt", label: "Fee Management", icon: Wallet },
  { to: "/admin/modules/accounting", label: "Accounting & Finance", icon: Calculator },
  { to: "/admin/modules/teachers", label: "Teacher Management", icon: UserCog },
  { to: "/admin/modules/staff-mgmt", label: "Staff Management", icon: Briefcase },
  { to: "/admin/modules/payroll", label: "Payroll Management", icon: BadgeDollarSign },
  { to: "/admin/modules/parents", label: "Parent Management", icon: HeartHandshake },
  { to: "/admin/modules/communication", label: "Communication Center", icon: MessagesSquare },
  { to: "/admin/modules/transport", label: "Transport Management", icon: Bus },
  { to: "/admin/modules/hostel", label: "Hostel Management", icon: BedDouble },
  { to: "/admin/modules/library", label: "Library Management", icon: Library },
  { to: "/admin/modules/inventory", label: "Inventory & Assets", icon: Boxes },
  { to: "/admin/modules/health", label: "Health & Medical", icon: HeartPulse },
  { to: "/admin/modules/events", label: "Event Management", icon: PartyPopper },
  { to: "/admin/modules/visitors", label: "Visitor Management", icon: ShieldCheck },
  { to: "/admin/modules/security", label: "Security & Compliance", icon: Lock },
  { to: "/admin/modules/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/admin/modules/documents", label: "Document Management", icon: FileText },
  { to: "/admin/modules/ai-command", label: "AI Command Center", icon: Brain },
  { to: "/admin/modules/integrations", label: "Integrations", icon: Plug },
  { to: "/admin/modules/multi-school", label: "Multi-School Control", icon: Building2 },
  { to: "/admin/modules/cms", label: "Website CMS", icon: Globe2 },
  { to: "/admin/modules/mobile-app", label: "Mobile App Control", icon: Smartphone },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-[#0B132B] text-slate-100">
      <Link to="/" className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-[#0B132B] font-black shadow">
          ES
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-extrabold">EduSmart ERP</p>
          <p className="text-[10px] text-slate-400">School Management System</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {NAV.map((item) => {
          const active = item.exact ? path === item.to : path === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNav}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
        <LogoutButton onNav={onNav} />
      </nav>
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
        toast.success("Signed out.");
        onNav?.();
        navigate({ to: "/" });
      }}
      className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:bg-red-500/15 hover:text-red-300 disabled:opacity-50"
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
      <div className="flex min-h-screen w-full bg-slate-50">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <SidebarContent />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
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

            <Button variant="ghost" size="icon" className="hidden lg:inline-flex text-slate-600">
              <Menu className="h-5 w-5" />
            </Button>

            <div className="relative max-w-xl flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search anything..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="hidden items-center gap-2 text-sm md:flex">
                <span className="text-slate-500">Academic Year</span>
                <button className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                  2024-25 <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <button className="relative text-slate-500 hover:text-slate-700">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
              </button>
              <button className="relative text-slate-500 hover:text-slate-700">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">8</span>
              </button>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">SA</div>
                <div className="hidden text-right text-xs leading-tight sm:block">
                  <p className="font-semibold text-slate-800">Super Admin</p>
                  <p className="text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>

          <div className="px-6 pb-4 text-center text-xs text-slate-400">{tenant}</div>
        </div>
      </div>
    </TenantProvider>
  );
}

function useTenantWrap() {
  const [name, setName] = useState<string>("Demo Institute");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("pq_institute_name");
    if (stored) setName(stored);
  }, []);
  return name;
}
