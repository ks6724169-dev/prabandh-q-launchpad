import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/site-nav";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left visual */}
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

      {/* Right form */}
      <div className="flex flex-col px-6 py-10 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="mx-auto my-auto w-full max-w-md">
          <Card className="bg-gradient-card p-8 shadow-soft">
            <h1 className="text-2xl font-bold">Sign in to Prabandh Q</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Use your institute admin credentials.</p>

            <form
              className="mt-7 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  toast.success("Signed in (demo). Auth backend coming next.");
                }, 700);
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" placeholder="principal@yourinstitute.edu.in" required />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a className="text-xs font-medium text-primary hover:underline" href="#">Forgot?</a>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required />
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
