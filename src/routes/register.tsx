import { createFileRoute, Link } from "@tanstack/react-router";
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
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string>("");
  const [tier, setTier] = useState<string>("");

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* Left visual */}
      <div className="relative hidden overflow-hidden bg-gradient-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-accent-emerald/20 blur-3xl" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <Logo className="text-primary-foreground [&_span]:text-primary-foreground" />
        <div className="relative max-w-md">
          <h2 className="font-display text-3xl font-extrabold leading-tight">Onboard your institute in minutes.</h2>
          <p className="mt-3 text-sm text-primary-foreground/85">
            Tell us a little about your school or college and pick a tier. Our team configures your secure tenant within 24 hours.
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

      {/* Right form */}
      <div className="flex flex-col px-6 py-10 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="mx-auto my-auto w-full max-w-xl">
          <Card className="bg-gradient-card p-8 shadow-soft">
            <h1 className="text-2xl font-bold">Register your Institute</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">It takes less than two minutes.</p>

            <form
              className="mt-7 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!type || !tier) {
                  toast.error("Please choose an institute type and preferred plan tier.");
                  return;
                }
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  toast.success("Request received! Our team will reach out shortly.");
                }, 800);
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="institute">Institute name</Label>
                <Input id="institute" placeholder="e.g. Saraswati Public School" required />
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
                <Input id="contact" placeholder="Full name" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" placeholder="admin@yourinstitute.edu.in" required />
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
