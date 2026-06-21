import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ModuleStub } from "@/components/module-stub";
import { FunctionalModule } from "@/components/functional-module";
import { MODULE_BY_SLUG } from "@/lib/modules-catalog";
import { getModuleSchema } from "@/lib/module-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/modules/$slug")({
  head: ({ params }) => {
    const mod = MODULE_BY_SLUG[params.slug];
    return { meta: [{ title: `${mod?.title ?? "Module"} · Prabandh Q` }] };
  },
  loader: ({ params }) => {
    const mod = MODULE_BY_SLUG[params.slug];
    if (!mod) throw notFound();
    return { mod };
  },
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Failed to load module: {String(error)}</div>
  ),
  notFoundComponent: () => (
    <div className="p-6 text-sm text-muted-foreground">Module not found.</div>
  ),
  component: ModulePage,
});

function ModulePage() {
  const { mod } = Route.useLoaderData();

  // Modules with dedicated full screens elsewhere — redirect cards
  const aliases: Record<string, { to: string; label: string }> = {
    "dashboard": { to: "/admin", label: "Open Dashboard" },
    "fees-mgmt": { to: "/admin/fees", label: "Open Fee Management" },
    "ai-command": { to: "/admin/ai", label: "Open AI Command Center" },
  };
  const alias = aliases[mod.slug];
  if (alias) {
    return (
      <div className="space-y-6">
        <Link to="/admin/modules" className="text-xs font-semibold text-primary hover:underline">← All Modules</Link>
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

  const schema = getModuleSchema(mod.slug);
  if (schema) {
    return <FunctionalModule icon={mod.icon} title={mod.title} subtitle={mod.subtitle} number={mod.number} schema={schema} />;
  }

  return (
    <ModuleStub icon={mod.icon} title={mod.title} subtitle={mod.subtitle} number={mod.number} features={mod.features} />
  );
}
