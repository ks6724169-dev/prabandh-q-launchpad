import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import {
  Check, GraduationCap, School, Sparkles, Smartphone, ShieldCheck,
  Brain, BarChart3, Users, BookOpen, ArrowRight, Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prabandh Q — Affordable Smart School & College Management" },
      { name: "description", content: "AI-powered, multi-tenant management for schools and colleges. Plans starting ₹8,000/year with optional ₹20–₹30/month AI Premium." },
    ],
  }),
  component: LandingPage,
});

type Sector = "school" | "college";
type Tier = "Silver" | "Gold" | "Platinum";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

const priceMatrix: Record<Sector, { capacities: number[]; prices: Record<number, Record<Tier, number>> }> = {
  school: {
    capacities: [100, 200, 500, 1000],
    prices: {
      100: { Silver: 8000, Gold: 12000, Platinum: 18000 },
      200: { Silver: 14000, Gold: 20000, Platinum: 28000 },
      500: { Silver: 25000, Gold: 35000, Platinum: 45000 },
      1000: { Silver: 40000, Gold: 55000, Platinum: 70000 },
    },
  },
  college: {
    capacities: [100, 200, 300, 500, 1000],
    prices: {
      100: { Silver: 25000, Gold: 35000, Platinum: 50000 },
      200: { Silver: 40000, Gold: 55000, Platinum: 75000 },
      300: { Silver: 55000, Gold: 75000, Platinum: 100000 },
      500: { Silver: 80000, Gold: 110000, Platinum: 150000 },
      1000: { Silver: 150000, Gold: 200000, Platinum: 280000 },
    },
  },
};

const tierPerks: Record<Sector, Record<Tier, string[]>> = {
  school: {
    Silver: ["Core admin tools", "Attendance & timetable", "Parent SMS alerts", "Mobile app access"],
    Gold: ["Everything in Silver", "Fees & accounting", "Exam & report cards", "Teacher app", "Priority support"],
    Platinum: ["Everything in Gold", "Multi-branch dashboards", "Transport & hostel", "Custom integrations", "Dedicated manager"],
  },
  college: {
    Silver: ["Admissions CRM", "Course & batch mgmt", "Attendance & ID cards", "Mobile app"],
    Gold: ["Everything in Silver", "Examination engine", "Fees, scholarships, refunds", "Placement cell", "Faculty workload"],
    Platinum: ["Everything in Gold", "Research & grants", "NAAC/NIRF reports", "API access", "On-site onboarding"],
  },
};

const tierOrder: Tier[] = ["Silver", "Gold", "Platinum"];

const features = [
  { icon: ShieldCheck, title: "Core Admin Suite", desc: "Admissions, attendance, fees, exams, timetable, and HR — beautifully unified." },
  { icon: Smartphone, title: "Mobile App Access", desc: "Native-feeling apps for staff, students and parents. Updates flow instantly." },
  { icon: Brain, title: "AI Premium (Optional)", desc: "Inside-app monthly AI add-on for just ₹20–₹30/month per user — learning, planning, insights." },
  { icon: BarChart3, title: "Live Dashboards", desc: "Principal-grade analytics: enrolment, fees collected, performance, attendance trends." },
  { icon: Users, title: "Multi-Tenant Ready", desc: "Run one branch or fifty. Roles, permissions and data isolation built-in." },
  { icon: BookOpen, title: "Built for India", desc: "Designed around CBSE, ICSE, State Boards, AICTE & UGC workflows. Hindi-friendly." },
];

function LandingPage() {
  const [sector, setSector] = useState<Sector>("school");

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-[0.07]" />
        <div className="absolute -left-32 top-20 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 top-40 -z-10 h-72 w-72 rounded-full bg-accent-emerald/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Affordable. Smart. Built for institutes.
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Run your{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">school or college</span>{" "}
              on one calm platform.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Prabandh Q is a multi-tenant management software built for Indian institutes — with the lowest plans starting at <span className="font-semibold text-foreground">₹8,000/year</span> and an optional <span className="font-semibold text-foreground">₹20–₹30/month AI Premium</span> inside the app.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground shadow-elegant hover:opacity-95">
                <Link to="/register">Register your Institute <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#pricing">View Pricing</a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Trusted by growing institutes</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" /> Data isolated per tenant</span>
              <span className="flex items-center gap-1"><Brain className="h-3.5 w-3.5 text-primary" /> Optional AI Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything an institute actually needs</h2>
          <p className="mt-3 text-muted-foreground">Core admin tools, mobile apps for everyone, and an optional AI Premium that pays for itself.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="bg-gradient-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* AI BANNER */}
      <section id="ai" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 text-primary-foreground sm:p-12">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Badge className="rounded-full bg-white/15 text-primary-foreground hover:bg-white/20">Option A · Inside-App Add-on</Badge>
              <h3 className="mt-4 text-2xl font-bold sm:text-3xl">AI Premium — ₹20 to ₹30 per month, per user</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
                Lesson planners, auto-graded quizzes, doubt-solving chat, attendance summaries, parent-update drafts and exam analytics — all built right inside Prabandh Q.
              </p>
            </div>
            <ul className="grid gap-2 text-sm">
              {["AI lesson planner & worksheets", "Smart doubt-solving for students", "Auto report card insights", "Multilingual parent messages"].map((p) => (
                <li key={p} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                  <Check className="h-4 w-4 text-accent-emerald" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Honest, affordable pricing</h2>
          <p className="mt-3 text-muted-foreground">Pick your sector — plans and capacities update automatically.</p>
        </div>

        {/* Sector toggle */}
        <div className="mx-auto mt-8 inline-flex w-full max-w-sm items-center rounded-full border border-border bg-secondary/60 p-1 sm:mx-auto sm:flex sm:w-fit">
          {(["school", "college"] as const).map((s) => {
            const active = sector === s;
            const Icon = s === "school" ? School : GraduationCap;
            return (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:flex-none ${
                  active
                    ? "bg-gradient-hero text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {s === "school" ? "School Management" : "College Management"}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {sector === "school"
            ? "Starting from ₹8,000/year · capacity tiers from 100 to 1000 students"
            : "Starting from ₹25,000/year · capacity tiers from 100 to 1000 students"}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans[sector].map((p) => (
            <Card
              key={p.tier}
              className={`relative flex flex-col p-7 transition-all ${
                p.highlight
                  ? "border-primary/40 bg-gradient-card shadow-elegant ring-1 ring-primary/20"
                  : "bg-gradient-card hover:shadow-soft"
              }`}
            >
              {p.highlight && (
                <Badge className="absolute -top-3 left-7 bg-gradient-emerald text-primary-foreground">Most Popular</Badge>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">{p.tier}</h3>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{sector}</span>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight">{p.price}</span>
                <span className="ml-1 text-sm text-muted-foreground">/ year onwards</span>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student capacity tiers</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.capacity.map((c) => (
                    <span key={c} className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{c}</span>
                  ))}
                </div>
              </div>

              <ul className="mt-6 space-y-2.5 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" />
                    <span className="text-foreground/90">{perk}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`mt-7 w-full ${p.highlight ? "bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95" : ""}`}
                variant={p.highlight ? "default" : "outline"}
              >
                <Link to="/register">Choose {p.tier}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Card className="bg-gradient-card p-10 text-center shadow-soft">
          <h3 className="text-2xl font-bold sm:text-3xl">Ready to modernise your institute?</h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Register in under two minutes. Our team will configure your tenant and onboard your staff.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground shadow-elegant">
              <Link to="/register">Register Institute</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </div>
        </Card>
      </section>

      <SiteFooter />
    </div>
  );
}
