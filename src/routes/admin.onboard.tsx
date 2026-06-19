import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Building2, UserCog, CreditCard, FileUp, Check, ChevronLeft, ChevronRight,
  GraduationCap, Globe, Users, BadgeCheck, Sparkles, ShieldCheck, Upload, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/onboard")({
  head: () => ({ meta: [{ title: "Institute Onboarding · Prabandh Q" }] }),
  component: OnboardPage,
});

const STEPS = [
  { id: 1, label: "School Info", icon: Building2 },
  { id: 2, label: "Admin Info", icon: UserCog },
  { id: 3, label: "Plan & Payment", icon: CreditCard },
  { id: 4, label: "Documents", icon: FileUp },
];

const PLANS = [
  { id: "basic", name: "Basic", price: 25000, perks: ["Up to 250 students", "Core modules", "Email support"] },
  { id: "standard", name: "Standard", price: 60000, perks: ["Up to 750 students", "Fees + Attendance", "Priority support"] },
  { id: "premium", name: "Premium", price: 120000, perks: ["Up to 2,000 students", "AI Assist included", "24×7 support"] },
  { id: "enterprise", name: "Enterprise", price: 250000, perks: ["Unlimited students", "Custom workflows", "Dedicated CSM"] },
];

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function OnboardPage() {
  const [step, setStep] = useState(1);
  const [planId, setPlanId] = useState("standard");
  const [files, setFiles] = useState<{ key: string; name: string }[]>([]);
  const [txnId, setTxnId] = useState("");
  const [verified, setVerified] = useState(false);

  const plan = useMemo(() => PLANS.find((p) => p.id === planId)!, [planId]);
  const advance = Math.round(plan.price * 0.2);
  const balance = plan.price - advance;

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    if (!verified) return toast.error("Please verify the advance transaction first.");
    toast.success("Institute onboarded successfully — welcome to Prabandh Q!");
  };

  return (
    <div className="space-y-6">
      <Header />

      {/* Stepper */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft sm:p-5">
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STEPS.map((s) => {
            const active = step === s.id;
            const done = step > s.id;
            const Icon = s.icon;
            return (
              <li key={s.id}>
                <button
                  onClick={() => setStep(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all",
                    active && "border-primary bg-gradient-hero text-primary-foreground shadow-soft",
                    done && !active && "border-accent-emerald/40 bg-accent/40 text-foreground",
                    !active && !done && "border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
                  )}
                >
                  <span className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                    active ? "bg-white/15" : done ? "bg-accent-emerald/15 text-accent-emerald" : "bg-background"
                  )}>
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Step {s.id}</p>
                    <p className="truncate text-sm font-semibold">{s.label}</p>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main form */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:p-7">
          {step === 1 && <StepSchool />}
          {step === 2 && <StepAdmin />}
          {step === 3 && (
            <StepPayment
              plan={plan}
              advance={advance}
              balance={balance}
              txnId={txnId}
              setTxnId={setTxnId}
              verified={verified}
              setVerified={setVerified}
            />
          )}
          {step === 4 && <StepDocs files={files} setFiles={setFiles} />}

          <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
            <Button variant="outline" onClick={prev} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button onClick={next} className="bg-gradient-hero">
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} className="bg-gradient-hero">
                <BadgeCheck className="h-4 w-4" /> Complete Onboarding
              </Button>
            )}
          </div>
        </div>

        {/* Plan sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-display text-base font-bold">Choose your plan</h3>
            </div>
            <div className="space-y-2">
              {PLANS.map((p) => {
                const sel = p.id === planId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left transition-all",
                      sel
                        ? "border-primary bg-gradient-hero text-primary-foreground shadow-soft"
                        : "border-border/60 bg-secondary/30 hover:bg-secondary/60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{p.name}</span>
                      <span className="text-sm font-extrabold">{inr(p.price)}</span>
                    </div>
                    <p className={cn("mt-1 text-[11px]", sel ? "opacity-80" : "text-muted-foreground")}>
                      {p.perks[0]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-gradient-card p-5 shadow-soft">
            <h3 className="font-display text-sm font-bold">Payment summary</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Plan total (yearly)" value={inr(plan.price)} />
              <Row label="20% Advance due" value={inr(advance)} highlight />
              <Row label="Balance on go-live" value={inr(balance)} />
            </dl>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent/50 p-2.5 text-[11px] text-accent-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Secure escrow • GST invoice issued post-payment
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
          <Building2 className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-xl font-extrabold sm:text-2xl">Detailed Institute Onboarding</h1>
          <p className="mt-1 text-sm opacity-85">
            A guided, 4-step setup to register your institute, configure billing, and upload compliance documents.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-semibold", highlight ? "text-primary" : "text-foreground")}>{value}</dd>
    </div>
  );
}

function Section({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <header className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-hero text-xs font-bold text-primary-foreground">
          {n}
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Select({ children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...p}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {children}
    </select>
  );
}

function Counter({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="icon" onClick={() => onChange(Math.max(0, value - 10))}>−</Button>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="text-center" />
      <Button type="button" variant="outline" size="icon" onClick={() => onChange(value + 10)}>+</Button>
    </div>
  );
}

function StepSchool() {
  const [students, setStudents] = useState(500);
  const [staff, setStaff] = useState(40);
  return (
    <Section n={1} title="School / Institute information" hint="Tell us about your institute. This appears on receipts and reports.">
      <Field label="Institute Name"><Input placeholder="St. Xavier's High School" /></Field>
      <Field label="Board / Affiliation">
        <Select defaultValue="cbse">
          <option value="cbse">CBSE</option>
          <option value="icse">ICSE / ISC</option>
          <option value="state">State Board</option>
          <option value="ib">IB / Cambridge</option>
          <option value="aicte">AICTE / UGC</option>
        </Select>
      </Field>
      <Field label="Institute Type">
        <Select defaultValue="school">
          <option value="pre">Pre-Primary</option>
          <option value="school">K-12 School</option>
          <option value="college">College / University</option>
          <option value="coaching">Coaching Institute</option>
        </Select>
      </Field>
      <Field label="Established Year"><Input type="number" placeholder="1998" /></Field>
      <Field label="Official Website">
        <div className="relative">
          <Globe className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-8" placeholder="https://stxaviers.edu.in" />
        </div>
      </Field>
      <Field label="GST / PAN (Optional)"><Input placeholder="29ABCDE1234F1Z5" /></Field>
      <Field label="Total Students" full>
        <Counter value={students} onChange={setStudents} />
      </Field>
      <Field label="Total Staff" full>
        <Counter value={staff} onChange={setStaff} />
      </Field>
      <Field label="Registered Address" full>
        <textarea
          rows={3}
          placeholder="Street, City, State, PIN"
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </Field>
    </Section>
  );
}

function StepAdmin() {
  return (
    <Section n={2} title="Administrator information" hint="The primary login that will manage your Prabandh Q workspace.">
      <Field label="Full Name"><Input placeholder="Anita Sharma" /></Field>
      <Field label="Designation">
        <Select defaultValue="principal">
          <option value="principal">Principal</option>
          <option value="director">Director</option>
          <option value="owner">Owner / Trustee</option>
          <option value="admin">Administrator</option>
        </Select>
      </Field>
      <Field label="Work Email"><Input type="email" placeholder="principal@stxaviers.edu.in" /></Field>
      <Field label="Mobile Number"><Input placeholder="+91 98xxxxxx" /></Field>
      <Field label="Create Password"><Input type="password" placeholder="••••••••" /></Field>
      <Field label="Confirm Password"><Input type="password" placeholder="••••••••" /></Field>
      <Field label="Government ID (Aadhaar / PAN)" full><Input placeholder="XXXX-XXXX-XXXX" /></Field>
    </Section>
  );
}

function StepPayment({
  plan, advance, balance, txnId, setTxnId, verified, setVerified,
}: {
  plan: typeof PLANS[number]; advance: number; balance: number;
  txnId: string; setTxnId: (v: string) => void; verified: boolean; setVerified: (v: boolean) => void;
}) {
  const verify = () => {
    if (txnId.trim().length < 8) {
      toast.error("Enter a valid transaction reference (min 8 chars).");
      return;
    }
    setVerified(true);
    toast.success("Advance payment verified successfully.");
  };

  return (
    <Section n={3} title="Plan & advance payment" hint="Pay 20% advance to activate your workspace. Balance is invoiced on go-live.">
      <div className="sm:col-span-2">
        <div className="rounded-xl border border-primary/30 bg-gradient-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Selected plan</p>
              <p className="font-display text-lg font-extrabold">{plan.name}</p>
            </div>
            <p className="font-display text-xl font-extrabold text-primary">{inr(plan.price)}</p>
          </div>
          <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-3">
            {plan.perks.map((p) => (
              <li key={p} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-accent-emerald" /> {p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sm:col-span-2 grid gap-3 sm:grid-cols-3">
        <Stat label="Plan total" value={inr(plan.price)} />
        <Stat label="20% Advance" value={inr(advance)} accent />
        <Stat label="Balance later" value={inr(balance)} />
      </div>

      <Field label="Payment Method">
        <Select defaultValue="upi">
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="netbanking">Net Banking</option>
          <option value="neft">NEFT / RTGS</option>
        </Select>
      </Field>
      <Field label="Payer Name"><Input placeholder="Name as per bank" /></Field>

      <Field label="Transaction Reference ID" full>
        <div className="flex gap-2">
          <Input value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="UPI / Bank txn id" />
          <Button type="button" onClick={verify} className={cn(verified && "bg-accent-emerald hover:bg-accent-emerald/90")}>
            {verified ? (<><Check className="h-4 w-4" /> Verified</>) : "Verify"}
          </Button>
        </div>
        {verified && (
          <p className="mt-1 text-[11px] font-medium text-accent-emerald">
            ✓ Advance of {inr(advance)} confirmed. You may proceed to documents.
          </p>
        )}
      </Field>
    </Section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-xl border p-3", accent ? "border-primary/30 bg-primary/5" : "border-border/60 bg-secondary/30")}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-lg font-extrabold", accent && "text-primary")}>{value}</p>
    </div>
  );
}

function StepDocs({ files, setFiles }: { files: { key: string; name: string }[]; setFiles: (f: { key: string; name: string }[]) => void }) {
  const REQUIRED = [
    "Registration Certificate",
    "PAN Card",
    "GST Certificate (if any)",
    "Board Affiliation Letter",
    "Principal's ID Proof",
    "Address Proof",
  ];
  const upload = (key: string) => {
    const name = `${key.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    setFiles([...files.filter((f) => f.key !== key), { key, name }]);
    toast.success(`${key} uploaded`);
  };
  const remove = (key: string) => setFiles(files.filter((f) => f.key !== key));
  return (
    <Section n={4} title="Documents upload" hint="Upload PDF/JPG (max 5 MB each). All documents are encrypted at rest.">
      <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
        {REQUIRED.map((doc) => {
          const f = files.find((x) => x.key === doc);
          return (
            <div key={doc} className="rounded-xl border border-dashed border-border bg-secondary/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{doc}</p>
                  <p className="text-[11px] text-muted-foreground">{f ? f.name : "PDF · JPG · PNG"}</p>
                </div>
                {f ? (
                  <Button size="sm" variant="ghost" onClick={() => remove(doc)} className="text-destructive">
                    <X className="h-3.5 w-3.5" /> Remove
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => upload(doc)}>
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </Button>
                )}
              </div>
              {f && (
                <div className="mt-2 flex items-center gap-2 rounded-md bg-accent-emerald/10 px-2 py-1 text-[11px] font-medium text-accent-emerald">
                  <Check className="h-3 w-3" /> Verified
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
