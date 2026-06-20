import { createFileRoute, notFound } from "@tanstack/react-router";
import { ModuleStub } from "@/components/module-stub";
import { MODULE_BY_SLUG } from "@/lib/modules-catalog";

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
  return (
    <ModuleStub
      icon={mod.icon}
      title={mod.title}
      subtitle={mod.subtitle}
      number={mod.number}
      features={mod.features}
    />
  );
}
