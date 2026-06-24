import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, UserCog, CalendarCheck, Wallet, Receipt, Cake,
  TrendingUp, TrendingDown, UserPlus, Briefcase, ClipboardCheck, IndianRupee,
  FileText, Send, BarChart3, Sparkles, Bell, Calendar, Brain,
} from "lucide-react";
import { MODULES } from "@/lib/modules-catalog";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const STATS = [
  { label: "Total Students", value: "2,568", delta: "+12.5%", trend: "up", note: "from last month", icon: Users, tint: "bg-blue-50 text-blue-600" },
  { label: "Total Staff", value: "342", delta: "+8.2%", trend: "up", note: "from last month", icon: UserCog, tint: "bg-indigo-50 text-indigo-600" },
  { label: "Attendance Today", value: "92.6%", delta: "+4.3%", trend: "up", note: "from yesterday", icon: CalendarCheck, tint: "bg-emerald-50 text-emerald-600" },
  { label: "Fee Collection (May)", value: "₹ 18,75,000", delta: "+15.8%", trend: "up", note: "from last month", icon: Wallet, tint: "bg-amber-50 text-amber-600" },
  { label: "Pending Fees", value: "₹ 6,45,000", delta: "-3.2%", trend: "down", note: "from last month", icon: Receipt, tint: "bg-rose-50 text-rose-600" },
  { label: "Today's Birthdays", value: "12", delta: "View All", trend: "neutral", note: "", icon: Cake, tint: "bg-fuchsia-50 text-fuchsia-600" },
] as const;

const QUICK_ACTIONS = [
  { label: "Add Student", icon: UserPlus, color: "text-blue-600" },
  { label: "Add Staff", icon: Briefcase, color: "text-indigo-600" },
  { label: "Mark Attendance", icon: ClipboardCheck, color: "text-emerald-600" },
  { label: "Collect Fee", icon: IndianRupee, color: "text-amber-600" },
  { label: "Create Notice", icon: FileText, color: "text-rose-600" },
  { label: "Send Message", icon: Send, color: "text-cyan-600" },
  { label: "Generate Report", icon: BarChart3, color: "text-purple-600" },
  { label: "AI Assistant", icon: Sparkles, color: "text-fuchsia-600" },
];

const AI_INSIGHTS = [
  { label: "Admission Forecast", value: "+18%", note: "Expected this year", tone: "text-blue-600" },
  { label: "At-Risk Students", value: "24", note: "Need attention", tone: "text-rose-600" },
  { label: "Fee Defaulters", value: "48", note: "High risk", tone: "text-amber-600" },
  { label: "Attendance Alert", value: "15", note: "Low attendance", tone: "text-orange-600" },
  { label: "Performance Trend", value: "Good", note: "Overall progress", tone: "text-emerald-600" },
  { label: "Syllabus Completion", value: "68%", note: "On track", tone: "text-indigo-600" },
];

const NOTICES = [
  { day: "21", month: "MAY", title: "Annual Sports Day", desc: "Sports event on 25th May 2024" },
  { day: "20", month: "MAY", title: "Fee Submission Reminder", desc: "Last date to pay fee is 31st May 2024" },
  { day: "19", month: "MAY", title: "Parent Teacher Meeting", desc: "PTM on 28th May 2024" },
  { day: "18", month: "MAY", title: "Summer Vacation Notice", desc: "Vacation from 1st June 2024" },
];

const EVENTS = [
  { day: "25", month: "MAY", title: "Annual Sports Day", desc: "8:00 AM - 5:00 PM" },
  { day: "28", month: "MAY", title: "Parent Teacher Meeting", desc: "10:00 AM - 2:00 PM" },
  { day: "01", month: "JUN", title: "Summer Vacation", desc: "All Day Event" },
  { day: "15", month: "JUN", title: "New Session Starts", desc: "2024-25 Academic Year" },
];

const ATTENDANCE_POINTS = [88, 91, 89, 93, 90, 94, 92.6];
const STRENGTH_BARS = [2100, 2250, 2400, 2350, 2500, 2700, 3100, 3300, 3500, 2900, 2700, 2600];
const TOP_CLASSES = [
  { rank: 1, name: "Class 10 - A", pct: "95.6%" },
  { rank: 2, name: "Class 9 - B", pct: "93.2%" },
  { rank: 3, name: "Class 8 - A", pct: "91.8%" },
  { rank: 4, name: "Class 7 - C", pct: "89.4%" },
  { rank: 5, name: "Class 6 - B", pct: "88.7%" },
];

const MODULE_COLORS = [
  "bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600", "bg-pink-100 text-pink-600", "bg-cyan-100 text-cyan-600",
  "bg-indigo-100 text-indigo-600", "bg-teal-100 text-teal-600", "bg-orange-100 text-orange-600",
  "bg-rose-100 text-rose-600", "bg-violet-100 text-violet-600", "bg-sky-100 text-sky-600",
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Welcome back, Super Admin! <span>👋</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here's what's happening in your school today.</p>
        </div>
        <p className="text-sm text-slate-500">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {STATS.map((s) => {
          const Icon = s.icon;
          const TrendIcon = s.trend === "down" ? TrendingDown : TrendingUp;
          return (
            <Card key={s.label}>
              <div className="flex items-start justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.tint}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-xs font-medium text-slate-500">{s.label}</p>
              <p className="mt-1 font-display text-xl font-extrabold text-slate-900">{s.value}</p>
              {s.trend === "neutral" ? (
                <button className="mt-2 text-xs font-semibold text-blue-600">{s.delta}</button>
              ) : (
                <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${s.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                  <TrendIcon className="h-3.5 w-3.5" />
                  <span>{s.delta}</span>
                  <span className="text-slate-400 font-normal">{s.note}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Middle: Quick Actions + AI Insights + Notices + Events */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Quick Actions */}
        <Card>
          <div className="flex items-center gap-2">
            <span className="text-amber-500">⚡</span>
            <h2 className="text-sm font-bold text-slate-800">Quick Actions</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <Icon className={`h-4 w-4 ${a.color}`} />
                  <span className="truncate">{a.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-100 text-blue-600">
                <Brain className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-800">AI Insights Dashboard</h2>
            </div>
            <button className="text-xs font-semibold text-blue-600">View Details</button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {AI_INSIGHTS.map((i) => (
              <div key={i.label} className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-medium text-slate-500">{i.label}</p>
                <p className={`mt-1 font-display text-lg font-extrabold ${i.tone}`}>{i.value}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{i.note}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Notices */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-800">Recent Notices</h2>
            </div>
            <button className="text-xs font-semibold text-blue-600">View All</button>
          </div>
          <div className="mt-3 space-y-3">
            {NOTICES.map((n) => (
              <div key={n.title} className="flex gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
                  <div className="text-center leading-none">
                    <p className="text-sm font-extrabold">{n.day}</p>
                    <p className="text-[9px] font-bold">{n.month}</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Events row (separate to balance) */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-800">Upcoming Events</h2>
          </div>
          <button className="text-xs font-semibold text-blue-600">View Calendar</button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENTS.map((e) => (
            <div key={e.title} className="flex gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <div className="text-center leading-none">
                  <p className="text-sm font-extrabold">{e.day}</p>
                  <p className="text-[9px] font-bold">{e.month}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{e.title}</p>
                <p className="text-[11px] text-slate-500">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-4">
        <Card>
          <Header title="Attendance Overview" right="This Week" />
          <LineChart data={ATTENDANCE_POINTS} />
          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </Card>

        <Card>
          <Header title="Fee Collection Overview" right="This Month" />
          <DonutChart />
          <div className="mt-3 space-y-1.5 text-xs">
            <Legend color="bg-emerald-500" label="Collected" value="₹ 18,75,000 (75%)" />
            <Legend color="bg-amber-400" label="Pending" value="₹ 6,45,000 (25%)" />
            <Legend color="bg-slate-300" label="Total" value="₹ 25,20,000 (100%)" />
          </div>
        </Card>

        <Card>
          <Header title="Student Strength" right="This Year" />
          <BarChart data={STRENGTH_BARS} />
          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => <span key={m}>{m}</span>)}
          </div>
        </Card>

        <Card>
          <Header title="Top Performing Classes" right="This Term" />
          <div className="mt-3 space-y-2">
            {TOP_CLASSES.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-blue-50 text-xs font-bold text-blue-600">{c.rank}</span>
                <span className="flex-1 text-xs font-medium text-slate-700">{c.name}</span>
                <span className="text-xs font-bold text-emerald-600">{c.pct}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* All Modules */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">All Modules</h2>
          <Link to="/admin/modules" className="text-xs font-semibold text-blue-600">View All Modules →</Link>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
          {MODULES.map((m, idx) => {
            const Icon = m.icon;
            const color = MODULE_COLORS[idx % MODULE_COLORS.length];
            return (
              <Link
                key={m.slug}
                to="/admin/modules/$slug"
                params={{ slug: m.slug }}
                className="group flex flex-col items-center text-center"
              >
                <span className={`grid h-14 w-14 place-items-center rounded-2xl ${color} transition group-hover:scale-105`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-2 text-[11px] font-medium leading-tight text-slate-700 line-clamp-2">{m.title}</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Header({ title, right }: { title: string; right: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <button className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600">
        {right} ▾
      </button>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-slate-600">{label}</span>
      <span className="ml-auto font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function LineChart({ data }: { data: number[] }) {
  const w = 240, h = 110, pad = 8;
  const min = 80, max = 100;
  const pts = data.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (data.length - 1);
    const y = pad + ((max - v) / (max - min)) * (h - pad * 2);
    return [x, y] as const;
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${d} L${pts[pts.length-1][0]},${h-pad} L${pts[0][0]},${h-pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-28 w-full">
      <defs>
        <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg)" />
      <path d={d} fill="none" stroke="#6366f1" strokeWidth="2" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#6366f1" />)}
      <text x={pts[pts.length-1][0] - 16} y={pts[pts.length-1][1] - 8} fontSize="9" fill="#6366f1" fontWeight="700">92.6%</text>
    </svg>
  );
}

function DonutChart() {
  const r = 42, c = 2 * Math.PI * r;
  const collected = 0.75;
  return (
    <div className="relative mt-3 grid place-items-center">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#fcd34d" strokeWidth="14" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke="#10b981" strokeWidth="14"
          strokeDasharray={`${c * collected} ${c}`}
          strokeLinecap="butt"
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-xl font-extrabold text-slate-800">75%</p>
        <p className="text-[10px] text-slate-500">Collected</p>
      </div>
    </div>
  );
}

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="mt-3 flex h-28 items-end gap-1.5">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t bg-indigo-400/80" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}
