import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, Sparkles } from "lucide-react";
import { TEACHER_MODULES } from "@/lib/teacher-modules-catalog";

export const Route = createFileRoute("/teacher/modules/")({
  head: () => ({ meta: [{ title: "Teacher Modules · Prabandh Q" }] }),
  component: TeacherModulesIndex,
});

function TeacherModulesIndex() {
  const categories = Array.from(new Set(TEACHER_MODULES.map((m) => m.category)));
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Teacher Panel</p>
          <h1 className="mt-1 flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            <LayoutGrid className="h-7 w-7 text-primary" /> All 30 Teacher Modules
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every module ships fully functional with 25 demo students and Lovable AI hooks ready to use.
          </p>
        </div>
        <Badge className="bg-gradient-hero text-primary-foreground">
          <Sparkles className="mr-1 h-3 w-3" /> AI Ready
        </Badge>
      </div>

      {categories.map((cat) => (
        <section key={cat} className="space-y-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEACHER_MODULES.filter((m) => m.category === cat).map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.slug} to="/teacher/modules/$slug" params={{ slug: m.slug }} className="group">
                  <Card className="h-full bg-gradient-card p-4 shadow-soft transition-all hover:shadow-elegant group-hover:-translate-y-0.5">
                    <div className="flex items-start justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-hero group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground">#{m.number.toString().padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-3 font-display text-sm font-bold leading-tight">{m.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.subtitle}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
