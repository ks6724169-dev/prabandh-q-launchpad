import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/site-nav";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in · Prabandh Q" },
      { name: "description", content: "Sign in to your Prabandh Q institute dashboard." },
    ],
  }),
  component: SignIn,
});

type UserRole = "admin" | "teacher" | "staff" | "student";

function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("admin");

  const getRolePath = (role: UserRole): string => {
    const paths: Record<UserRole, string> = {
      admin: "/admin",
      teacher: "/teacher",
      staff: "/staff",
      student: "/student",
    };
    return paths[role];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error("Please select your role");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error || !data.user) {
      setLoading(false);
      toast.error(error?.message ?? "Could not sign in.");
      return;
    }

    // Hydrate user data with role
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
        window.localStorage.setItem("pq_user_role", selectedRole);
      }
    }

    setLoading(false);
    toast.success(`Welcome to ${selectedRole} dashboard.`);
    navigate({ to: getRolePath(selectedRole as UserRole) });
  };

  const handleGoogle = async () => {
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pq_pending_role", selectedRole);
    }
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/sign-in",
    });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    // Tokens already set — finish locally
    await finishGoogleSignIn();
  };

  const finishGoogleSignIn = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const pendingRole =
      (typeof window !== "undefined" && (window.localStorage.getItem("pq_pending_role") as UserRole)) ||
      "admin";
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pq_user_role", pendingRole);
      window.localStorage.removeItem("pq_pending_role");
    }
    setLoading(false);
    toast.success(`Welcome to ${pendingRole} dashboard.`);
    navigate({ to: getRolePath(pendingRole) });
  };

  useEffect(() => {
    // Handle returning from Google OAuth redirect
    if (typeof window === "undefined") return;
    const pending = window.localStorage.getItem("pq_pending_role");
    if (!pending) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finishGoogleSignIn();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <p className="mt-1.5 text-sm text-muted-foreground">Select your role and enter your credentials.</p>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="role">Select Your Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@institute.edu.in"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !selectedRole}
                className="w-full bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95"
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={loading || !selectedRole}
              className="w-full gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 7 29.3 4.9 24 4.9c-7.7 0-14.4 4.4-17.7 10.8z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.9 35.8 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z"/>
              </svg>
              Continue with Google (Free)
            </Button>

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
