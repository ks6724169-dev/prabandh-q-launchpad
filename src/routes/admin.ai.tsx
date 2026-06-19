import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Lock, Sparkles, Send, CheckCircle2, Zap, MessageSquareText, BookOpen, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { aiChat } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/ai")({
  head: () => ({ meta: [{ title: "Prabandh Q AI · Premium" }] }),
  component: AIPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function AIPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPremium(window.localStorage.getItem("pq_is_ai_premium") === "true");
    }
  }, []);

  const activate = () => {
    setActivating(true);
    setTimeout(() => {
      window.localStorage.setItem("pq_is_ai_premium", "true");
      setIsPremium(true);
      setActivating(false);
      toast.success("AI Premium activated! Welcome to Prabandh Q AI.");
    }, 1100);
  };

  return isPremium ? <ChatPanel /> : <LockedPanel onActivate={activate} activating={activating} />;
}

function LockedPanel({ onActivate, activating }: { onActivate: () => void; activating: boolean }) {
  return (
    <div className="relative">
      {/* Blurred preview backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 select-none opacity-60 blur-md">
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-40 bg-gradient-card p-6" />
          ))}
        </div>
      </div>

      <Card className="relative overflow-hidden border-primary/20 bg-gradient-card p-8 shadow-soft sm:p-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent-emerald/15 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
            <Lock className="h-9 w-9" />
          </div>
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> Prabandh Q AI · Premium
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Supercharge your learning & planning
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Unlock <span className="font-semibold text-foreground">Prabandh Q AI Assistant</span> for just{" "}
            <span className="font-semibold text-primary">₹20–₹30/month</span>. Instant lesson planners,
            doubt-solving chat, and automated report insights — built for Indian classrooms.
          </p>

          <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">
            {[
              { icon: BookOpen, title: "Lesson Planner", desc: "Generate complete unit plans in seconds." },
              { icon: MessageSquareText, title: "Doubt Solving", desc: "24×7 AI tutor for every subject." },
              { icon: Zap, title: "Report Insights", desc: "Auto-summarised parent-ready reports." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border/60 bg-background/70 p-4">
                <f.icon className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={onActivate}
            disabled={activating}
            size="lg"
            className={cn(
              "mt-8 h-12 gap-2 bg-gradient-hero px-8 text-primary-foreground shadow-soft transition-all hover:opacity-95 hover:shadow-elegant",
              !activating && "animate-pulse",
            )}
          >
            <Sparkles className="h-4 w-4" />
            {activating ? "Processing payment…" : "Activate AI Premium"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald" /> Cancel anytime · UPI / Cards / Netbanking
          </p>
        </div>
      </Card>
    </div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm **Prabandh Q AI** ✨ — your in-app tutor and planner. Ask me to draft a lesson plan, solve a doubt, or summarise a student report.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const callAi = useServerFn(aiChat);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await callAi({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      toast.error(msg.includes("402") ? "AI credits exhausted. Please add credits." : msg);
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Draft a Class 9 Algebra lesson plan",
    "Explain photosynthesis simply",
    "Summarise weak areas for student Aarav",
  ];

  return (
    <Card className="flex h-[calc(100vh-10rem)] flex-col overflow-hidden border-primary/20 bg-gradient-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-sm font-bold">Prabandh Q AI</p>
            <p className="text-[11px] text-accent-emerald">● Premium active</p>
          </div>
        </div>
        <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline-block">
          Gemini Flash
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-hero text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            )}
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[75%]",
                m.role === "user"
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm border border-border/60 bg-background text-foreground",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-hero text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            </span>
            <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              </span>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 border-t border-border/60 px-4 py-3 sm:px-6">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); void send(); }}
        className="flex items-center gap-2 border-t border-border/60 bg-background/80 px-4 py-3 sm:px-6"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Prabandh Q AI anything…"
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !input.trim()} size="icon" className="bg-gradient-hero text-primary-foreground shadow-soft">
          {loading ? <ArrowUp className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  );
}
