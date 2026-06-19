import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/site-nav";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register your Institute · Prabandh Q" },
      { name: "description", content: "Register your school or college on Prabandh Q. Plans starting ₹8,000/year." },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<string>("");
  const [tier, setTier] = useState<string>("");

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-gradient-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-accent-emerald/20 blur-3xl" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <Logo className="text-primary-foreground [&_span]:text-primary-foreground" />
        <div className="relative max-w-md">
          <h2 className="font-display text-3xl font-extrabold leading-tight">Onboard your institute in minutes.</h2>
          <p className="mt-3 text-sm text-primary-foreground/85">
            Tell us a little about your school or college and pick a tier. Your tenant dashboard is configured instantly.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {[
              "Dedicated tenant with isolated data",
              "Free onboarding & data import",
              "Optional AI Premium at ₹20–₹30/month",
              "Cancel anytime — no lock-in",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent-emerald" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/70">© {new Date().getFullYear()} Prabandh Q</p>
      </div>

      <div className="flex flex-col px-6 py-10 sm:px-10">
        <div className="lg:hidden"><Logo /></div>

        <div className="mx-auto my-auto w-full max-w-xl">
          <Card className="bg-gradient-card p-8 shadow-soft">
            <h1 className="text-2xl font-bold">Register your Institute</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">It takes less than two minutes.</p>

            <form
              className="mt-7 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!type || !tier) {
                  toast.error("Please choose an institute type and preferred plan tier.");
                  return;
                }
                if (password.length < 8) {
                  toast.error("Password must be at least 8 characters.");
                  return;
                }
                setLoading(true);
                const { data: inst, error: instErr } = await supabase
                  .from("institutes")
                  .insert({
                    name,
                    type,
                    preferred_plan: tier,
                    contact_person: contactPerson,
                    contact_email: email,
                  })
                  .select("id, type, name")
                  .single();
                if (instErr || !inst) {
                  setLoading(false);
                  toast.error(instErr?.message ?? "Could not complete registration.");
                  return;
                }
                const { error: authErr } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    emailRedirectTo: `${window.location.origin}/admin`,
                    data: {
                      full_name: contactPerson,
                      institute_id: inst.id,
                      role: "admin",
                    },
                  },
                });
                setLoading(false);
                if (authErr) {
                  toast.error(authErr.message);
                  return;
                }
                if (typeof window !== "undefined") {
                  window.localStorage.setItem("pq_institute_id", inst.id);
                  window.localStorage.setItem("pq_institute_type", inst.type);
                  window.localStorage.setItem("pq_institute_name", inst.name);
                }
                toast.success("Registration successful! Your tenant dashboard is ready.");
                setTimeout(() => navigate({ to: "/admin" }), 700);
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="institute">Institute name</Label>
                <Input id="institute" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Saraswati Public School" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Institute type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Preferred plan</Label>
                  <Select value={tier} onValueChange={setTier}>
                    <SelectTrigger><SelectValue placeholder="Select tier" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact">Contact person</Label>
                <Input id="contact" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Full name" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@yourinstitute.edu.in" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95">
                {loading ? "Submitting…" : "Register Institute"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By registering you agree to our Terms and Privacy Policy.
              </p>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/sign-in" className="font-semibold text-primary hover:underline">Sign in</Link>
            </p>
          </Card>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
