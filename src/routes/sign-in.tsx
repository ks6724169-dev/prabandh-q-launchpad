import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/site-nav";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in · Prabandh Q" },
      { name: "description", content: "Sign in to your Prabandh Q institute dashboard." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-accent-emerald/20 blur-3xl" />
        <Logo className="text-primary-foreground [&_span]:text-primary-foreground" />
        <div className="relative max-w-md">
          <h2 className="font-display text-3xl font-extrabold leading-tight">Welcome back to the calm side of administration.</h2>
          <p className="mt-3 text-sm text-primary-foreground/85">
            Attendance, fees, exams and parent communication — all in one tenant built just for your institute.
          </p>
        </div>
        <p className="relative text-xs text-primary-foreground/70">© {new Date().getFullYear()} Prabandh Q</p>
      </div>

      <div className="flex flex-col px-6 py-10 sm:px-10">
        <div className="lg:hidden"><Logo /></div>

        <div className="mx-auto my-auto w-full max-w-md">
          <Card className="bg-gradient-card p-8 shadow-soft">
            <h1 className="text-2xl font-bold">Sign in to Prabandh Q</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Use your institute admin credentials.</p>

            <form
              className="mt-7 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error || !data.user) {
                  setLoading(false);
                  toast.error(error?.message ?? "Could not sign in.");
                  return;
                }
                // Hydrate tenant info from profile + institute
                const { data: profile } = await supabase
                  .from("profiles")
                  .select("institute_id, full_name")
                  .eq("id", data.user.id)
                  .maybeSingle();
                if (profile?.institute_id) {
                  const { data: inst } = await supabase
                    .from("institutes")
                    .select("id, name, type")
                    .eq("id", profile.institute_id)
                    .maybeSingle();
                  if (inst && typeof window !== "undefined") {
                    window.localStorage.setItem("pq_institute_id", inst.id);
                    window.localStorage.setItem("pq_institute_type", inst.type);
                    window.localStorage.setItem("pq_institute_name", inst.name);
                  }
                }
                setLoading(false);
                toast.success("Welcome back to Prabandh Q.");
                navigate({ to: "/admin" });
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="principal@yourinstitute.edu.in" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95">
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New institute?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">Register here</Link>
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
