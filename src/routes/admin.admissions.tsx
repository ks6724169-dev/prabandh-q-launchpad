import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  GraduationCap, User, BookOpen, Users2, PhoneCall, HeartPulse, FileUp,
  KeyRound, Copy, Check, Upload, X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/admissions")({
  head: () => ({ meta: [{ title: "Student Admissions · Prabandh Q" }] }),
  component: AdmissionsPage,
});

function AdmissionsPage() {
  const [name, setName] = useState("");
  const [admissionNo] = useState(() => "ADM-" + Math.floor(100000 + Math.random() * 900000));
  const [files, setFiles] = useState<Record<string, string>>({});

  const login = useMemo(() => {
    const u = name.trim() ? name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 10) || "student" : "student";
    return { username: `${u}.${admissionNo.slice(-4)}`, password: "Pq@" + admissionNo.slice(-4) + "!" };
  }, [name, admissionNo]);

  const submit = () => toast.success(`Admission saved for ${name || "student"} (${admissionNo}).`);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={GraduationCap}
        title="New Student Admission"
        subtitle="Capture complete student, academic, parent and medical details in one structured form."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <SectionHead n={1} icon={User} title="Student information" />
            <Grid>
              <Field label="Admission Number"><Input value={admissionNo} readOnly className="bg-secondary/40" /></Field>
              <Field label="Admission Date"><Input type="date" defaultValue={new Date().toISOString().slice(0,10)} /></Field>
              <Field label="Full Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Kumar Sharma" /></Field>
              <Field label="Date of Birth"><Input type="date" /></Field>
              <Field label="Gender">
                <Select defaultValue="male">
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </Select>
              </Field>
              <Field label="Blood Group">
                <Select defaultValue="">
                  <option value="">Select</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((b) => <option key={b} value={b}>{b}</option>)}
                </Select>
              </Field>
              <Field label="Religion"><Input placeholder="Hindu / Muslim / Christian…" /></Field>
              <Field label="Category">
                <Select defaultValue="general">
                  <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
                </Select>
              </Field>
              <Field label="Aadhaar Number" full><Input placeholder="XXXX-XXXX-XXXX" /></Field>
              <Field label="Residential Address" full>
                <textarea rows={2} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              </Field>
            </Grid>
          </Card>

          <Card>
            <SectionHead n={2} icon={BookOpen} title="Academic information" />
            <Grid>
              <Field label="Academic Session"><Input defaultValue="2026-2027" /></Field>
              <Field label="Class / Grade">
                <Select defaultValue="9">{Array.from({length:12}).map((_,i)=><option key={i} value={i+1}>{`Class ${i+1}`}</option>)}</Select>
              </Field>
              <Field label="Section">
                <Select defaultValue="A">{["A","B","C","D"].map((s)=><option key={s}>{s}</option>)}</Select>
              </Field>
              <Field label="Roll Number"><Input placeholder="Auto / 24" /></Field>
              <Field label="Previous School" full><Input placeholder="Last attended institute" /></Field>
              <Field label="TC Number"><Input placeholder="Transfer certificate no." /></Field>
              <Field label="Date of Joining"><Input type="date" /></Field>
            </Grid>
          </Card>

          <Card>
            <SectionHead n={3} icon={Users2} title="Parent / Guardian details" />
            <div className="space-y-5">
              <SubHead title="Father" />
              <Grid>
                <Field label="Father's Name"><Input /></Field>
                <Field label="Occupation"><Input /></Field>
                <Field label="Annual Income (₹)"><Input type="number" /></Field>
                <Field label="Mobile"><Input /></Field>
                <Field label="Email" full><Input type="email" /></Field>
              </Grid>
              <SubHead title="Mother" />
              <Grid>
                <Field label="Mother's Name"><Input /></Field>
                <Field label="Occupation"><Input /></Field>
                <Field label="Annual Income (₹)"><Input type="number" /></Field>
                <Field label="Mobile"><Input /></Field>
                <Field label="Email" full><Input type="email" /></Field>
              </Grid>
              <SubHead title="Guardian (if different)" />
              <Grid>
                <Field label="Guardian Name"><Input /></Field>
                <Field label="Relation"><Input placeholder="Uncle / Grandparent" /></Field>
              </Grid>
            </div>
          </Card>

          <Card>
            <SectionHead n={4} icon={PhoneCall} title="Emergency contacts" />
            <Grid>
              <Field label="Primary Contact Name"><Input /></Field>
              <Field label="Primary Mobile"><Input /></Field>
              <Field label="Alternate Contact Name"><Input /></Field>
              <Field label="Alternate Mobile"><Input /></Field>
              <Field label="Family Doctor"><Input /></Field>
              <Field label="Doctor's Phone"><Input /></Field>
            </Grid>
          </Card>

          <Card>
            <SectionHead n={5} icon={HeartPulse} title="Medical information" />
            <Grid>
              <Field label="Allergies" full><Input placeholder="Pollen, peanuts, etc." /></Field>
              <Field label="Chronic Conditions" full><Input placeholder="Asthma, diabetes, etc." /></Field>
              <Field label="Regular Medication" full><Input /></Field>
              <Field label="Vaccinated">
                <Select><option>Yes</option><option>No</option></Select>
              </Field>
              <Field label="Disability (if any)"><Input /></Field>
            </Grid>
          </Card>

          <Card>
            <SectionHead n={6} icon={FileUp} title="Documents upload" />
            <DocsGrid
              items={["Birth Certificate", "Aadhaar Card", "Previous Marksheet", "Transfer Certificate", "Passport Photo", "Caste Certificate"]}
              files={files}
              onChange={setFiles}
            />
          </Card>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={submit} className="bg-gradient-hero">
              <Check className="h-4 w-4" /> Submit Admission
            </Button>
          </div>
        </div>

        {/* Sidebar — Generated login */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-bold">System-generated login</h3>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Auto-credentials shared with parents on submit.
            </p>
            <div className="mt-3 space-y-2">
              <CredRow label="Username" value={login.username} />
              <CredRow label="Password" value={login.password} />
              <CredRow label="Portal" value="parent.prabandhq.in" />
            </div>
            <div className="mt-3 rounded-lg bg-accent/40 p-2.5 text-[11px] text-accent-foreground">
              Parent receives SMS + Email with these credentials.
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-sm font-bold">Admission summary</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <SumRow label="Admission No" value={admissionNo} />
              <SumRow label="Student" value={name || "—"} />
              <SumRow label="Class" value="9 · A" />
              <SumRow label="Session" value="2026-2027" />
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* ---------- shared building blocks (used by admin.staff too) ---------- */

export function PageHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-xl font-extrabold sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm opacity-85">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:p-6">{children}</section>;
}

export function SectionHead({ n, icon: Icon, title }: { n: number; icon: any; title: string }) {
  return (
    <header className="mb-5 flex items-center gap-3 border-b border-border/60 pb-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-hero text-xs font-bold text-primary-foreground">{n}</span>
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="font-display text-base font-bold tracking-tight">{title}</h2>
    </header>
  );
}

export function SubHead({ title }: { title: string }) {
  return <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>;
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2 lg:col-span-3")}>
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function Select({ children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...p}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {children}
    </select>
  );
}

function CredRow({ label, value }: { label: string; value: string }) {
  const copy = () => { navigator.clipboard?.writeText(value); toast.success(`${label} copied`); };
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm font-semibold">{value}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={copy}><Copy className="h-3.5 w-3.5" /></Button>
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

export function DocsGrid({
  items, files, onChange,
}: { items: string[]; files: Record<string, string>; onChange: (f: Record<string, string>) => void }) {
  const upload = (k: string) => { onChange({ ...files, [k]: `${k.toLowerCase().replace(/\s+/g,"-")}.pdf` }); toast.success(`${k} uploaded`); };
  const remove = (k: string) => { const n = { ...files }; delete n[k]; onChange(n); };
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((d) => {
        const f = files[d];
        return (
          <div key={d} className="rounded-xl border border-dashed border-border bg-secondary/30 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{d}</p>
                <p className="truncate text-[11px] text-muted-foreground">{f ?? "PDF · JPG · PNG"}</p>
              </div>
              {f ? (
                <Button size="sm" variant="ghost" onClick={() => remove(d)} className="text-destructive"><X className="h-3.5 w-3.5" /></Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => upload(d)}><Upload className="h-3.5 w-3.5" /></Button>
              )}
            </div>
            {f && <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-accent-emerald"><Check className="h-3 w-3" /> Verified</div>}
          </div>
        );
      })}
    </div>
  );
}
