import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Users, GraduationCap, Wallet, CalendarCheck, TrendingUp, ArrowUpRight } from "lucide-react";
import { useTenant, getPeople, getFees, inr } from "@/components/tenant";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const tenant = useTenant();
  const isCollege = tenant.type === "college";

  const { students, staff, monthFees, attendancePct } = useMemo(() => {
    const people = getPeople();
    const fees = getFees();
    const students = people.filter((p) => p.role === "student").length;
    const staff = people.filter((p) => p.role === "staff").length;
    const monthFees = fees.reduce((a, b) => a + b.amount, 0);
    return { students, staff, monthFees, attendancePct: 92 };
  }, []);

  const metrics = [
    { label: "Total Students", value: students.toString(), icon: GraduationCap, delta: "+12 this week", tone: "primary" as const },
    { label: isCollege ? "Total Professors" : "Total Teachers", value: staff.toString(), icon: Users, delta: "Active faculty", tone: "indigo" as const },
    { label: "Fees Collected (Month)", value: inr(monthFees), icon: Wallet, delta: "+18% vs last month", tone: "emerald" as const },
    { label: "Today's Attendance", value: `${attendancePct}%`, icon: CalendarCheck, delta: "Above target 85%", tone: "emerald" as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Welcome back</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {tenant.name} · Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of {isCollege ? "college" : "school"} operations for today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="relative overflow-hidden bg-gradient-card p-5 shadow-soft transition-all hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                  <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">{m.value}</p>
                </div>
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${m.tone === "emerald" ? "bg-accent-emerald/15 text-accent-emerald" : "bg-primary/10 text-primary"}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-accent-emerald" />
                {m.delta}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Activity this week</h2>
              <p className="text-xs text-muted-foreground">Admissions, fees, and attendance trends</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-6 grid grid-cols-7 items-end gap-2">
            {[40, 65, 50, 80, 72, 90, 60].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-full rounded-t-md bg-gradient-hero" style={{ height: `${h * 1.2}px` }} />
                <span className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-gradient-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold">Quick actions</h2>
          <p className="text-xs text-muted-foreground">Jump into a module</p>
          <div className="mt-4 space-y-2">
            {[
              { label: isCollege ? "Add Professor / Student" : "Add Teacher / Student", to: "people" },
              { label: "Record Fee Payment", to: "fees" },
              { label: "Mark Today's Attendance", to: "attendance" },
            ].map((a) => (
              <div key={a.label} className="flex items-center justify-between rounded-lg border border-border/60 bg-background p-3 text-sm">
                <span className="font-medium">{a.label}</span>
                <span className="text-xs text-primary">Open →</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
