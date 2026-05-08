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
  X,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import heroImage from "@/assets/hero-app.jpg";

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

const EVENT_LINES = [
  { text: "CPI data at 8:30am", chars: 18, delay: "460ms", tone: "body" },
  { text: "You lose 68% of trades on CPI days", chars: 36, delay: "880ms", tone: "muted" },
  { text: "Reduce size this morning", chars: 25, delay: "1280ms", tone: "muted" },
];

const DATA_LINES = [
  { text: "NVDA matches your breakout setup", chars: 33, delay: "1760ms", tone: "body" },
  { text: "Win rate on this pattern: 71%", chars: 30, delay: "2200ms", tone: "body" },
];

const OVERLAY_DRAG_LIMIT = { x: 38, y: 28 };

function Ticker() {
  const items = [...TICKERS, ...TICKERS];
  return (
    <div className="overflow-hidden border-y border-border/60 bg-background">
      <div className="flex animate-ticker whitespace-nowrap py-3">
        {items.map((t, i) => (
          <div key={i} className="mx-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
            <span className="text-muted-foreground">{t.sym}</span>
            <span className={t.up ? "text-foreground" : "text-muted-foreground/70"}>{t.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-sm border border-foreground/20 bg-background/60 text-foreground backdrop-blur">
            <span className="font-mono text-xs font-bold">C</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Confluence</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-foreground/70 md:flex">
          <a href="#problem" className="transition-colors hover:text-foreground">Problem</a>
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
        </nav>
        <a
          href="#waitlist"
          className="rounded-sm bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Get early access
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
        className={`flex items-center gap-3 rounded-sm border border-border bg-card/60 ${
          big ? "px-5 py-4" : "px-4 py-3"
        } text-sm text-foreground`}
      >
        <Check className="h-4 w-4 text-foreground/80" />
        <span>You&apos;re on the list. We&apos;ll be in touch.</span>
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
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        maxLength={255}
        className={`flex-1 rounded-sm border border-border bg-background/60 backdrop-blur ${
          big ? "px-5 py-4 text-base" : "px-4 py-3 text-sm"
        } text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-foreground/60`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`group inline-flex items-center justify-center gap-2 rounded-sm bg-foreground ${
          big ? "px-6 py-4 text-base" : "px-5 py-3 text-sm"
        } font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-60`}
      >
        {loading ? "Joining…" : "Get early access"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

function Hero() {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayOffset, setOverlayOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOverlayOpen(true);
    }, 320);

    return () => window.clearTimeout(timer);
  }, []);

  function clampOffset(nextX: number, nextY: number) {
    return {
      x: Math.max(-OVERLAY_DRAG_LIMIT.x, Math.min(OVERLAY_DRAG_LIMIT.x, nextX)),
      y: Math.max(-OVERLAY_DRAG_LIMIT.y, Math.min(OVERLAY_DRAG_LIMIT.y, nextY)),
    };
  }

  function handleDragStart(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: overlayOffset.x,
      originY: overlayOffset.y,
    };
    setIsDragging(true);
    setDragMoved(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleDragMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const nextX = drag.originX + (e.clientX - drag.startX);
    const nextY = drag.originY + (e.clientY - drag.startY);
    if (!dragMoved && (Math.abs(e.clientX - drag.startX) > 3 || Math.abs(e.clientY - drag.startY) > 3)) {
      setDragMoved(true);
    }
    setOverlayOffset(clampOffset(nextX, nextY));
  }

  function handleDragEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  }

  function toggleOverlay() {
    setOverlayOpen((open) => !open);
  }

  function handlePillClick() {
    if (!dragMoved) toggleOverlay();
  }

  return (
    <section id="top" className="relative h-screen min-h-[680px] w-full overflow-hidden">
      <img
        src={heroImage}
        alt="A trader standing before a wall of market terminals"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-background/30" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex-1" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-end lg:gap-12 xl:grid-cols-[minmax(0,1fr)_34rem]">
          <div>
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground/80 backdrop-blur animate-fade-up"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/80" />
              Now in private beta
            </div>
            <h1
              className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-7xl md:text-[5.5rem] text-glow animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              Trade with
              <br />
              <span className="text-foreground">Confluence.</span>
            </h1>
            <p
              className="mt-6 max-w-xl text-base text-foreground/75 sm:text-lg animate-fade-up"
              style={{ animationDelay: "160ms" }}
            >
              Confluence sits on top of your workflow, briefs you every morning, and
              gets smarter every time you trade.
            </p>
            <div
              id="waitlist"
              className="mt-10 max-w-xl animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              <WaitlistForm />
              <p className="mt-3 text-xs text-foreground/50">
                Free during beta · Mac &amp; Windows
              </p>
            </div>
          </div>

          <div className="animate-fade-up lg:justify-self-end" style={{ animationDelay: "220ms" }}>
            <div className="relative mx-auto w-full max-w-[30rem] min-h-[23rem] lg:mx-0">
              <div
                className="relative min-h-[19rem]"
                style={{
                  transform: `translate(${overlayOffset.x}px, ${overlayOffset.y}px)`,
                  transition: isDragging ? "none" : "transform 220ms ease-out",
                }}
              >
                <div className="mb-3 flex justify-center lg:justify-start">
                  <div
                    className={`pointer-events-auto inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/26 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/68 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.75)] backdrop-blur-md ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    onPointerDown={handleDragStart}
                    onPointerMove={handleDragMove}
                    onPointerUp={handleDragEnd}
                    onPointerCancel={handleDragEnd}
                    onClick={handlePillClick}
                    style={{ touchAction: "none" }}
                  >
                    <span className="flex items-center gap-2 text-white/86">
                      <span className="grid h-5 w-5 place-items-center rounded-full border border-white/12 bg-white/6 text-[10px]">
                        C
                      </span>
                      Confluence
                    </span>
                    <span className="h-3 w-px bg-white/12" />
                    <button
                      type="button"
                      onClick={toggleOverlay}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClickCapture={(e) => e.stopPropagation()}
                      className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-white/72 transition-colors hover:bg-white/[0.08]"
                      aria-expanded={overlayOpen}
                      aria-controls="hero-overlay"
                    >
                      {overlayOpen ? "Hide" : "Open"}
                    </button>
                  </div>
                </div>

                {overlayOpen ? (
                  <div
                    id="hero-overlay"
                    className="demo-panel-enter pointer-events-auto rounded-[1.35rem] border border-white/10 bg-[#0b121d]/44 p-3.5 shadow-[0_18px_42px_-30px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.025)] backdrop-blur-xl sm:p-4"
                  >
                    <div
                      className={`flex items-center justify-between gap-3 border-b border-white/7 pb-2.5 ${
                        isDragging ? "cursor-grabbing" : "cursor-grab"
                      }`}
                      onPointerDown={handleDragStart}
                      onPointerMove={handleDragMove}
                      onPointerUp={handleDragEnd}
                      onPointerCancel={handleDragEnd}
                      style={{ touchAction: "none" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/84">
                          <Zap className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-medium tracking-tight text-white/92">
                            Confluence
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/48">
                        <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-1 text-white/70">
                          Ctrl+Space
                        </span>
                        <button
                          type="button"
                          onClick={() => setOverlayOpen(false)}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="grid h-7 w-7 place-items-center rounded-full border border-white/8 bg-white/[0.04] text-white/54 transition-colors hover:bg-white/[0.08]"
                          aria-label="Close overlay preview"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 font-mono text-[11px] sm:text-[12px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-white/90">MORNING DEBRIEF</span>
                        <span className="text-white/40">Thu May 8</span>
                      </div>

                      <div className="mt-3 border-t border-white/7 pt-3">
                        <div className="mb-2.5 flex items-center justify-between gap-3">
                          <span className="text-white/40">EVENTS</span>
                          <span className="inline-flex items-center rounded-full bg-rose-500/92 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white sm:text-[11px]">
                            HIGH IMPACT
                          </span>
                        </div>
                        <div className="space-y-2 leading-[1.35rem]">
                          {EVENT_LINES.map((line) => (
                            <div key={line.text} className="overflow-hidden whitespace-nowrap">
                              <span
                                className={`inline-block overflow-hidden whitespace-nowrap align-top typing-line ${
                                  line.tone === "muted" ? "text-white/56" : "text-white/82"
                                }`}
                                style={
                                  {
                                    "--chars": line.chars,
                                    "--delay": line.delay,
                                  } as React.CSSProperties
                                }
                              >
                                {line.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 border-t border-white/7 pt-3">
                        <div className="mb-2.5 text-white/40">YOUR DATA</div>
                        <div className="space-y-2 leading-[1.35rem]">
                          {DATA_LINES.map((line) => (
                            <div key={line.text} className="overflow-hidden whitespace-nowrap">
                              <span
                                className={`inline-block overflow-hidden whitespace-nowrap align-top typing-line ${
                                  line.tone === "muted" ? "text-white/56" : "text-white/82"
                                }`}
                                style={
                                  {
                                    "--chars": line.chars,
                                    "--delay": line.delay,
                                  } as React.CSSProperties
                                }
                              >
                                {line.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-[1rem] border border-white/7 bg-white/[0.02] px-3.5 py-2.5">
                      <span className="font-mono text-[11px] text-white/46 sm:text-[12px]">
                        Ask anything...
                      </span>
                      <button
                        type="button"
                        className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/80"
                        aria-label="Send prompt"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="mt-3.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/36 sm:text-[11px]">
                      Press Ctrl+Space anywhere on your screen
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
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
    <section id="problem" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          The gap
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
          You have an edge.
          <br />
          <span className="text-muted-foreground">
            You just can&apos;t find it when it matters.
          </span>
        </h2>
        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {items.map((line, i) => (
            <div
              key={i}
              className="bg-background p-10 transition-colors hover:bg-card/40"
            >
              <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                0{i + 1}
              </div>
              <p className="mt-6 text-lg font-medium leading-snug text-foreground">
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
    <section className="relative border-t border-border py-28">
      <div className="mx-auto max-w-4xl px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          What it is
        </p>
        <p className="mt-6 text-2xl leading-relaxed text-foreground/80 sm:text-3xl">
          Confluence is a desktop app and system-wide overlay that{" "}
          <span className="text-foreground">knows your trading history</span>,
          watches the market, and helps you make better decisions{" "}
          <span className="text-muted-foreground">
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
    <section id="features" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Core features
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Built for traders who keep records.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Every feature exists to compound your edge — not to replace your
            charts, your broker, or your judgment.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="group relative bg-background p-8 transition-colors hover:bg-card/40"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-card/40 text-foreground/80 transition-colors group-hover:text-foreground">
                  <c.icon className="h-4 w-4" />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-8 text-lg font-semibold tracking-tight text-foreground">
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
  return _HowItWorks();
}

function Brokers() {
  const assets = [
    { label: "Futures", detail: "ES, NQ, CL, GC and the rest of the CME complex." },
    { label: "Forex", detail: "Majors, minors, and exotics across your FX broker." },
    { label: "Options", detail: "Single legs and multi-leg structures, fills and Greeks." },
    { label: "Stocks & Equities", detail: "US equities and ETFs across cash and margin accounts." },
  ];
  const brokers = [
    { name: "Tradovate", logo: "/brokers/tradovate.png" },
    { name: "NinjaTrader", logo: "/brokers/ninjatrader.png" },
    { name: "Webull", logo: "/brokers/webull.png" },
    { name: "Rithmic", logo: "/brokers/rithmic.png" },
    { name: "Interactive Brokers", logo: "/brokers/interactivebrokers.png" },
  ];
  return (
    <section id="brokers" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Auto trade logging
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Connect your broker.
              <br />
              <span className="text-muted-foreground">Every fill logs itself.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Confluence ingests fills directly from your broker and normalizes them
            into a single trade journal — no spreadsheets, no manual entry.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {assets.map((a, i) => (
            <div key={a.label} className="bg-background p-8">
              <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                0{i + 1}
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                {a.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {a.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Supported brokers
          </p>
          <div className="mt-5 grid gap-px overflow-hidden rounded-sm border border-border bg-border grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {brokers.map((b) => (
              <div
                key={b.name}
                className="group flex items-center gap-3 bg-background px-5 py-5 transition-colors hover:bg-card/40"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-sm border border-border bg-white/95">
                  <img
                    src={b.logo}
                    alt={`${b.name} logo`}
                    width={32}
                    height={32}
                    loading="lazy"
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <span className="text-sm font-medium tracking-tight text-foreground/90">
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function _HowItWorks() {
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
    <section id="how" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          How it works
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          Three steps. Then it just runs.
        </h2>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute inset-x-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-sm border border-border bg-background p-8"
            >
              <div className="grid h-12 w-12 place-items-center rounded-sm border border-border bg-card font-mono text-sm font-semibold text-foreground">
                {s.n}
              </div>
              <h3 className="mt-8 text-xl font-semibold tracking-tight">
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
    <section id="pricing" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Free during beta.
          </h2>
          <p className="mt-4 text-muted-foreground">
            One plan today. More to come when it&apos;s ready.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="relative overflow-hidden rounded-sm border border-foreground/30 bg-card/40 p-8">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
                Free
              </h3>
              <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground">
                Available
              </span>
            </div>
            <p className="mt-6 text-2xl font-semibold tracking-tight">
              Everything, while we build.
            </p>
            <ul className="mt-8 space-y-3">
              {free.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm text-foreground/90"
                >
                  <Check className="h-4 w-4 text-foreground/70" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#waitlist"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Get early access
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Pro */}
          <div className="relative overflow-hidden rounded-sm border border-border bg-background p-8">
            <div className="relative flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Pro
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <Lock className="h-3 w-3" />
                Coming Soon
              </span>
            </div>
            <p className="relative mt-6 text-2xl font-semibold tracking-tight text-muted-foreground">
              In development.
            </p>
            <div className="relative mt-8 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-3 w-full max-w-[80%] rounded-sm bg-muted/40"
                  style={{ width: `${80 - i * 10}%` }}
                />
              ))}
            </div>
            <p className="relative mt-10 text-xs text-muted-foreground">
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
    <footer className="relative border-t border-border py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-sm border border-border bg-card text-foreground">
            <span className="font-mono text-xs font-bold">C</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Confluence © 2025
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
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
      <Brokers />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}
