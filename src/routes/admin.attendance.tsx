import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTenant, getPeople } from "@/components/tenant";

export const Route = createFileRoute("/admin/attendance")({
  component: Attendance,
});

function Attendance() {
  const tenant = useTenant();
  const isCollege = tenant.type === "college";
  const people = getPeople().filter((p) => p.role === "student");

  const groups = useMemo(() => {
    const set = new Set<string>();
    people.forEach((p) => set.add(isCollege ? `${p.course || "—"} · Sem ${p.semester || "—"}` : `Class ${p.klass || "—"} · ${p.section || "—"}`));
    return Array.from(set);
  }, [people, isCollege]);

  const [group, setGroup] = useState<string>(groups[0] ?? "");
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(people.map((p) => [p.id, true]))
  );

  const visible = people.filter((p) =>
    isCollege ? `${p.course || "—"} · Sem ${p.semester || "—"}` === group
              : `Class ${p.klass || "—"} · ${p.section || "—"}` === group
  );

  const presentCount = visible.filter((p) => attendance[p.id]).length;
  const pct = visible.length ? Math.round((presentCount / visible.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Quick Attendance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mark attendance for {isCollege ? "a course & semester" : "a class & section"} in seconds.
          </p>
        </div>
        <Button
          onClick={() => toast.success(`Attendance saved · ${presentCount}/${visible.length} present (${pct}%).`)}
          className="bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95"
        >
          <Save className="mr-1.5 h-4 w-4" /> Save Attendance
        </Button>
      </div>

      <Card className="bg-gradient-card p-5 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label>{isCollege ? "Course & Semester" : "Class & Section"}</Label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
              <SelectContent>
                {groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-accent-emerald/10 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
            <span className="text-sm font-semibold text-accent-emerald">{presentCount} Present</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{pct}% Attendance</span>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-card p-4 shadow-soft sm:p-6">
        <div className="space-y-2">
          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No students in this group.</p>
          ) : visible.map((p) => {
            const present = attendance[p.id];
            return (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-background p-3 transition-colors hover:bg-secondary/40">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-hero text-xs font-bold text-primary-foreground">
                    {p.name.split(" ").map((s) => s[0]).slice(0,2).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={present ? "default" : "secondary"} className={present ? "bg-accent-emerald text-white" : ""}>
                    {present ? "Present" : "Absent"}
                  </Badge>
                  <Switch
                    checked={present}
                    onCheckedChange={(v) => setAttendance({ ...attendance, [p.id]: v })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
