import { createFileRoute, Link } from "@tanstack/react-router";
import { FunctionalModule } from "@/components/functional-module";
import { TEACHER_MODULE_BY_SLUG } from "@/lib/teacher-modules-catalog";
import { getTeacherModuleSchema } from "@/lib/teacher-module-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/teacher/modules/$slug")({
  head: ({ params }) => {
    const mod = TEACHER_MODULE_BY_SLUG[params.slug];
    return { meta: [{ title: `${mod?.title ?? "Module"} · Teacher · Prabandh Q` }] };
  },
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Failed to load module: {String(error)}</div>
  ),
  notFoundComponent: () => (
    <div className="p-6 text-sm text-muted-foreground">Module not found.</div>
  ),
  component: TeacherModulePage,
});

function TeacherModulePage() {
  const { slug } = Route.useParams();
  const mod = TEACHER_MODULE_BY_SLUG[slug];

  if (!mod) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/teacher/modules" className="text-xs font-semibold text-primary hover:underline">← All Teacher Modules</Link>
        <Card className="bg-gradient-card p-8 text-center shadow-soft">
          <h1 className="font-display text-xl font-extrabold">Module not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">The module "{slug}" does not exist.</p>
        </Card>
      </div>
    );
  }

  // Bespoke modules with dedicated workspaces
  const aliases: Record<string, { to: string; label: string }> = {
    "dashboard": { to: "/teacher", label: "Open Teacher Dashboard" },
    "ai-assistant": { to: "/student/ai", label: "Open AI Teaching Assistant" },
    "attendance": { to: "/teacher/attendance", label: "Open Attendance Workspace" },
    "classes": { to: "/teacher/classes", label: "Open Class Workspace" },
  };

  // For 'classes' and 'attendance', still show full functional module below the alias card
  const showAlias = ["dashboard", "ai-assistant"].includes(mod.slug);
  const alias = aliases[mod.slug];
  if (showAlias && alias) {
    return (
      <div className="space-y-6 p-6">
        <Link to="/teacher/modules" className="text-xs font-semibold text-primary hover:underline">← All Teacher Modules</Link>
        <Card className="bg-gradient-card p-8 text-center shadow-soft">
          <h1 className="font-display text-2xl font-extrabold">{mod.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">This module has a dedicated workspace.</p>
          <Button asChild className="mt-5 bg-gradient-hero text-primary-foreground">
            <Link to={alias.to as any}>{alias.label} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </Card>
      </div>
    );
  }

  const schema = getTeacherModuleSchema(mod.slug);
  if (schema) {
    return (
      <div className="p-6">
        <FunctionalModule
          icon={mod.icon} title={mod.title} subtitle={mod.subtitle} number={mod.number} schema={schema}
          backTo="/teacher/modules" backLabel="All Teacher Modules" totalModules={30} aiHref="/student/ai"
        />
      </div>
    );
  }

  // Profile module — render a simple personal info card
  if (mod.slug === "profile") {
    return (
      <div className="space-y-6 p-6">
        <Link to="/teacher/modules" className="text-xs font-semibold text-primary hover:underline">← All Teacher Modules</Link>
        <Card className="bg-gradient-card p-8 shadow-soft">
          <div className="flex items-start gap-6">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Sharma" alt="" className="h-24 w-24 rounded-2xl bg-primary/10" />
            <div>
              <h1 className="font-display text-2xl font-extrabold">Mrs. Priya Sharma</h1>
              <p className="text-sm text-muted-foreground">Senior Teacher · Physics & Mathematics</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Employee ID:</span> <b>TCH-1042</b></div>
                <div><span className="text-muted-foreground">Qualification:</span> <b>M.Sc, B.Ed</b></div>
                <div><span className="text-muted-foreground">Experience:</span> <b>12 years</b></div>
                <div><span className="text-muted-foreground">Phone:</span> <b>+91 98xxxx1042</b></div>
                <div><span className="text-muted-foreground">Email:</span> <b>priya.sharma@prabandhq.in</b></div>
                <div><span className="text-muted-foreground">Bank:</span> <b>HDFC ****1234</b></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 text-sm text-muted-foreground">No schema configured for "{mod.slug}".</div>
  );
}
