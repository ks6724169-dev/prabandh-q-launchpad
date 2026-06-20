import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, CheckCircle2, type LucideIcon } from "lucide-react";

export type ModuleFeature = { label: string; ai?: boolean };

export function ModuleStub({
  icon: Icon,
  title,
  subtitle,
  number,
  features,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  number: number;
  features: ModuleFeature[];
}) {
  return (
    <div className="space-y-6">
      <Link to="/admin/modules" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> All Modules
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Module {number} / 30</p>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Badge className="bg-accent-emerald/15 text-accent-emerald hover:bg-accent-emerald/15">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Scaffold Ready
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold">Capabilities</h2>
          <p className="text-xs text-muted-foreground">Planned features for this module</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-lg border border-border/60 bg-background p-3 text-sm">
                <span className="font-medium">{f.label}</span>
                {f.ai && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" /> AI
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-gradient-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold">Next steps</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            This module is scaffolded and wired into the admin shell. Connect data sources, attach Lovable AI flows, and replace this stub with full UI.
          </p>
          <Button asChild className="mt-4 w-full bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95">
            <Link to="/admin/ai">Open AI Command Center</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
