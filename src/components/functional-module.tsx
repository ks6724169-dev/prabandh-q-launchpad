import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Sparkles, Trash2, CheckCircle2, ArrowLeft, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ModuleSchema } from "@/lib/module-data";

const toneClass = (t?: string) => {
  switch (t) {
    case "emerald": return "bg-accent-emerald/15 text-accent-emerald";
    case "amber": return "bg-amber-500/15 text-amber-600";
    case "rose": return "bg-rose-500/15 text-rose-600";
    default: return "bg-primary/10 text-primary";
  }
};

const statusBadge = (v: string) => {
  const s = String(v).toLowerCase();
  if (/(present|paid|approved|connected|published|active|sent|graded|enabled|checked-out)/.test(s)) return "bg-accent-emerald/15 text-accent-emerald";
  if (/(absent|rejected|error|overdue|disabled|high)/.test(s)) return "bg-rose-500/15 text-rose-600";
  if (/(late|scheduled|review|documents|interview|draft|beta|maintenance|delayed|medium|amber)/.test(s)) return "bg-amber-500/15 text-amber-600";
  return "bg-primary/10 text-primary";
};

export function FunctionalModule({
  icon: Icon, title, subtitle, number, schema,
}: {
  icon: LucideIcon; title: string; subtitle: string; number: number; schema: ModuleSchema;
}) {
  const [rows, setRows] = useState<Record<string, any>[]>(() => schema.seed.map((s, i) => ({ id: `r-${i}`, ...s })));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("__all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [aiOpen, setAiOpen] = useState(false);

  const filterOptions = useMemo(() => {
    if (!schema.filterKey) return [];
    return Array.from(new Set(rows.map((r) => String(r[schema.filterKey!] ?? "")))).filter(Boolean);
  }, [rows, schema.filterKey]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch = !search || String(r[schema.searchKey] ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "__all" || !schema.filterKey || String(r[schema.filterKey]) === filter;
      return matchesSearch && matchesFilter;
    });
  }, [rows, search, filter, schema]);

  const stats = useMemo(() => schema.stats.map((s) => ({ ...s, value: s.compute(rows) })), [rows, schema]);

  const submit = () => {
    for (const f of schema.fields) {
      if (f.required && !form[f.key]) { toast.error(`${f.label} is required`); return; }
    }
    setRows((prev) => [{ id: `r-${Date.now()}`, ...form }, ...prev]);
    setForm({}); setOpen(false);
    toast.success(`${schema.noun} added`);
  };

  const remove = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success(`${schema.noun} removed`);
  };

  const runAI = () => {
    setAiOpen(true);
  };

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
          <CheckCircle2 className="mr-1 h-3 w-3" /> Live · Demo Data
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-gradient-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <span className={`h-2 w-2 rounded-full ${toneClass(s.tone)}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <Card className="bg-gradient-card p-4 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search by ${schema.searchKey}…`} className="pl-9" />
            </div>
            {schema.filterKey && (
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder={`Filter by ${schema.filterKey}`} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All {schema.filterKey}</SelectItem>
                  {filterOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={runAI} className="gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95">
                  <Plus className="mr-1 h-4 w-4" /> New {schema.noun}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Add {schema.noun}</DialogTitle></DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  {schema.fields.map((f) => (
                    <div key={f.key} className={`space-y-1.5 ${f.type === "text" && schema.fields.length <= 4 ? "sm:col-span-2" : ""}`}>
                      <Label>{f.label}{f.required && <span className="text-rose-500"> *</span>}</Label>
                      {f.type === "select" ? (
                        <Select value={form[f.key] ?? ""} onValueChange={(v) => setForm({ ...form, [f.key]: v })}>
                          <SelectTrigger><SelectValue placeholder={`Select ${f.label}`} /></SelectTrigger>
                          <SelectContent>
                            {f.options?.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "email" ? "email" : f.type === "tel" ? "tel" : "text"}
                          value={form[f.key] ?? ""}
                          placeholder={f.placeholder}
                          onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={submit} className="bg-gradient-hero text-primary-foreground">Save {schema.noun}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-gradient-card p-0 shadow-soft">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {schema.columns.map((c) => <TableHead key={c} className="capitalize">{c.replace(/([A-Z])/g, " $1")}</TableHead>)}
                <TableHead className="w-12 text-right">·</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={schema.columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">No records match.</TableCell></TableRow>
              ) : filtered.map((row) => (
                <TableRow key={row.id}>
                  {schema.columns.map((c) => {
                    const v = row[c];
                    const isStatusLike = ["status","stage","state","severity","type"].includes(c);
                    return (
                      <TableCell key={c}>
                        {isStatusLike && v ? (
                          <Badge className={`${statusBadge(String(v))} hover:opacity-90`}>{String(v)}</Badge>
                        ) : typeof v === "number" && /amount|gross|deductions|budget|size|fee/i.test(c) ? (
                          <span className="font-medium">₹{Number(v).toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-sm">{v === undefined || v === "" ? "—" : String(v)}</span>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => remove(row.id)} aria-label="Remove">
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t border-border/60 p-3 text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {rows.length}</span>
          <span className="font-mono">{schema.noun} · Demo</span>
        </div>
      </Card>

      {/* AI Modal */}
      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI Insights</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">Based on {rows.length} {schema.noun.toLowerCase()} records:</p>
            <ul className="space-y-1.5 rounded-lg bg-muted/40 p-3">
              {stats.slice(0, 3).map((s) => (
                <li key={s.label} className="flex justify-between"><span>{s.label}</span><span className="font-semibold">{s.value}</span></li>
              ))}
              <li className="border-t border-border/60 pt-2 text-xs text-primary">💡 Trend looks healthy. Consider scheduling a review next week.</li>
            </ul>
            <Button asChild className="w-full bg-gradient-hero text-primary-foreground">
              <Link to="/admin/ai">Open AI Command Center</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
