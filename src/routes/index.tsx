import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Sunrise,
  Command,
  PenLine,
  Database,
  Globe2,
  TrendingUp,
  ArrowRight,
  Lock,
  Twitter,
  Mail,
  Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);

const TICKERS = [
  { sym: "BTCUSD", chg: "+1.42%", up: true },
  { sym: "ES1!", chg: "-0.31%", up: false },
  { sym: "NQ1!", chg: "+0.84%", up: true },
  { sym: "TSLA", chg: "+2.07%", up: true },
  { sym: "AAPL", chg: "-0.46%", up: false },
  { sym: "EURUSD", chg: "+0.12%", up: true },
  { sym: "GOLD", chg: "+0.68%", up: true },
  { sym: "SPY", chg: "+0.21%", up: true },
  { sym: "NVDA", chg: "+3.15%", up: true },
  { sym: "DXY", chg: "-0.18%", up: false },
];

function Ticker() {
  const items = [...TICKERS, ...TICKERS];
  return (
    <div className="overflow-hidden border-y border-border/60 bg-background/60 backdrop-blur">
      <div className="flex animate-ticker whitespace-nowrap py-3">
        {items.map((t, i) => (
          <div key={i} className="mx-6 flex items-center gap-2 font-mono text-xs">
            <span className="text-muted-foreground">{t.sym}</span>
            <span className={t.up ? "text-primary" : "text-destructive"}>{t.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartGlyph() {
  // Decorative SVG line chart
  return (
    <svg
      viewBox="0 0 800 400"
      className="absolute inset-0 h-full w-full opacity-[0.35]"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.86 0.21 155)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.86 0.21 155)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.7 0.18 230)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.7 0.18 230)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 320 L60 290 L120 305 L180 250 L240 260 L300 200 L360 220 L420 160 L480 180 L540 130 L600 150 L660 100 L720 120 L800 70"
        fill="none"
        stroke="oklch(0.86 0.21 155)"
        strokeWidth="2"
      />
      <path
        d="M0 320 L60 290 L120 305 L180 250 L240 260 L300 200 L360 220 L420 160 L480 180 L540 130 L600 150 L660 100 L720 120 L800 70 L800 400 L0 400 Z"
        fill="url(#g1)"
      />
      <path
        d="M0 360 L80 340 L160 350 L240 310 L320 320 L400 280 L480 290 L560 240 L640 260 L720 210 L800 230"
        fill="none"
        stroke="oklch(0.7 0.18 230)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <path
        d="M0 360 L80 340 L160 350 L240 310 L320 320 L400 280 L480 290 L560 240 L640 260 L720 210 L800 230 L800 400 L0 400 Z"
        fill="url(#g2)"
      />
    </svg>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-primary">
            <span className="font-mono text-sm font-bold">C</span>
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">confluence</span>
        </a>
        <nav className="hidden items-center gap-8 font-mono text-xs text-muted-foreground md:flex">
          <a href="#problem" className="transition-colors hover:text-foreground">problem</a>
          <a href="#features" className="transition-colors hover:text-foreground">features</a>
          <a href="#how" className="transition-colors hover:text-foreground">how it works</a>
          <a href="#pricing" className="transition-colors hover:text-foreground">pricing</a>
        </nav>
        <a
          href="#waitlist"
          className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20"
        >
          Join waitlist
        </a>
      </div>
    </header>
  );
}

function WaitlistForm({ size = "lg" }: { size?: "lg" | "sm" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: parsed.data.toLowerCase() });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        setDone(true);
        toast.success("You're already on the list.");
        return;
      }
      toast.error("Something went wrong. Try again.");
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("You're in. We'll be in touch.");
  }

  const big = size === "lg";

  if (done) {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 ${
          big ? "px-5 py-4" : "px-4 py-3"
        } font-mono text-sm text-primary`}
      >
        <Check className="h-4 w-4" />
        <span>You're on the list. Welcome aboard.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full flex-col gap-2 sm:flex-row sm:items-stretch ${
        big ? "sm:gap-2" : ""
      }`}
    >
      <input
        type="email"
        required
        placeholder="you@trader.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        maxLength={255}
        className={`flex-1 rounded-xl border border-border bg-card/60 ${
          big ? "px-5 py-4 text-base" : "px-4 py-3 text-sm"
        } font-mono text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-primary ${
          big ? "px-6 py-4 text-base" : "px-5 py-3 text-sm"
        } font-mono font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60`}
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        {loading ? "Joining…" : "Join the waitlist"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2">
        <ChartGlyph />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Now in private beta
        </div>

        <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground animate-fade-up">
          Trade with
        </p>
        <h1
          className="mt-3 text-6xl font-black leading-[0.95] tracking-tight text-foreground sm:text-8xl md:text-[10rem] text-glow animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          Confluence<span className="text-primary">.</span>
        </h1>

        <p
          className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          Your personal trade intelligence copilot.
        </p>
        <p
          className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground/80 sm:text-base animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          Confluence sits on top of your trading workflow, briefs you every morning,
          and gets smarter every time you trade.
        </p>

        <div
          id="waitlist"
          className="mx-auto mt-10 max-w-xl animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <WaitlistForm />
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Free during beta · Mac &amp; Windows
          </p>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    "Your backtest results are sitting in folders you never open.",
    "You read the same research and forget it by next week.",
    "ChatGPT doesn't know your edge.",
  ];
  return (
    <section id="problem" className="relative border-t border-border/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          // the gap
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
          You have an edge.
          <br />
          <span className="text-muted-foreground">
            You just can&apos;t find it when it matters.
          </span>
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-3">
          {items.map((line, i) => (
            <div
              key={i}
              className="bg-card/60 p-8 transition-colors hover:bg-card"
            >
              <div className="font-mono text-xs text-primary">0{i + 1}</div>
              <p className="mt-4 text-lg font-medium leading-snug text-foreground">
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatItIs() {
  return (
    <section className="relative border-t border-border/40 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          // what it is
        </p>
        <p className="mt-6 text-2xl leading-relaxed text-foreground sm:text-3xl">
          Confluence is a desktop app and system-wide overlay that{" "}
          <span className="text-primary">knows your trading history</span>,
          watches the market, and helps you make better decisions{" "}
          <span className="text-foreground/60">
            without replacing any tool you already use.
          </span>
        </p>
      </div>
    </section>
  );
}

function Features() {
  const cards = [
    {
      icon: Sunrise,
      title: "Morning Debrief",
      body: "Every morning Confluence pulls today's economic calendar and cross references it with your personal trade history. You get a personalized game plan, not generic market news.",
    },
    {
      icon: Command,
      title: "System-Wide Overlay",
      body: "Press Ctrl+Space from anywhere on your screen. Ask a question, log a trade, pull research. Never leave your charts.",
    },
    {
      icon: PenLine,
      title: "Trade Logging",
      body: "One line captures everything. Confluence extracts ticker, direction, setup type and stores it automatically. No spreadsheets.",
    },
    {
      icon: Database,
      title: "Personal RAG Pipeline",
      body: "Every trade, note, and backtest is stored and searchable. Ask anything about your history and get a direct answer drawn from your own data.",
    },
    {
      icon: Globe2,
      title: "Live Research",
      body: "Ask Confluence to research anything. It searches the web, returns a cited summary, and saves it to your knowledge base for future reference.",
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      body: "The longer you use it the smarter it gets. Every trade logged makes your next debrief more accurate. Your edge compounds over time.",
    },
  ];
  return (
    <section id="features" className="relative border-t border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              // core features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Built for traders who keep records.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Every feature exists to compound your edge — not to replace your
            charts, your broker, or your judgment.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="group relative bg-card/60 p-8 transition-colors hover:bg-card"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-all group-hover:bg-primary/20">
                  <c.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Feed it your data",
      body: "Drop in backtests, paste research, log your trades. Takes minutes to set up.",
    },
    {
      n: "02",
      title: "It learns your edge",
      body: "Confluence reads everything, embeds it, and builds a picture of how you trade.",
    },
    {
      n: "03",
      title: "It briefs you every morning",
      body: "Wake up, open Confluence, get your personalized game plan before markets open.",
    },
  ];
  return (
    <section id="how" className="relative border-t border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          // how it works
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
          Three steps. Then it just runs.
        </h2>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute inset-x-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-border/60 bg-card/40 p-8"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-primary/40 bg-background font-mono text-sm font-bold text-primary">
                {s.n}
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const free = [
    "Morning debrief",
    "Trade logging",
    "Personal RAG pipeline",
    "Live research",
    "Mac and Windows",
  ];
  return (
    <section id="pricing" className="relative border-t border-border/40 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            // pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Free during beta.
          </h2>
          <p className="mt-4 text-muted-foreground">
            One plan today. More to come when it&apos;s ready.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div
            className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card/60 p-8"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <div
              className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--terminal-green)" }}
            />
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm uppercase tracking-wider text-primary">
                Free
              </h3>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                Available
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">
              Currently available
            </p>
            <ul className="mt-8 space-y-3">
              {free.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 font-mono text-sm text-foreground/90"
                >
                  <Check className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#waitlist"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-mono text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              Join the waitlist
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Pro */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/30 p-8 opacity-70">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="relative flex items-center justify-between">
              <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                Pro
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <Lock className="h-3 w-3" />
                Coming Soon
              </span>
            </div>
            <p className="relative mt-4 text-2xl font-semibold tracking-tight text-muted-foreground">
              Locked
            </p>
            <div className="relative mt-8 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-3 w-full max-w-[80%] rounded bg-muted/40"
                  style={{ width: `${80 - i * 10}%` }}
                />
              ))}
            </div>
            <p className="relative mt-10 font-mono text-xs text-muted-foreground">
              More powerful features on the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border/40 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-primary">
            <span className="font-mono text-sm font-bold">C</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Confluence © 2025
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Twitter className="h-4 w-4" />
            Twitter / X
          </a>
          <a
            href="mailto:hello@confluence.app"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            hello@confluence.app
          </a>
        </div>
      </div>
    </footer>
  );
}

function ScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("animate-fade-up");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return <div ref={ref} />;
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-center" />
      <Nav />
      <ScrollReveal />
      <Hero />
      <Ticker />
      <Problem />
      <WhatItIs />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}
