import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function LandingHero() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-88px)] max-w-6xl mx-auto w-full px-6 mt-15">
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-12 lg:gap-8">
        {/* Left: copy */}
        <div className="flex flex-col items-start text-left max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Now generating in seconds, not sprints
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Turn your ideas
            <br />
            into{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              websites.
            </span>
          </h1>

          <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed">
            Describe what you want to build in plain English. Sitelab writes,
            styles, and ships the site while you chat.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button
              asChild
              size="lg"
              className="px-8 group shadow-lg shadow-primary/25"
            >
              <Link href="/sign-up">
                Start building free
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="px-6">
              <Link href="/sign-in">Log in</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required · Live in under a minute
          </p>

          {/* Trust strip fills bottom-left space and adds credibility */}
          <div className="mt-10 pt-6 border-t border-border/60 flex items-center gap-6 text-xs text-muted-foreground w-full">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              2,000+ sites shipped
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by Claude
            </span>
          </div>
        </div>

        {/* Right: signature visual — prompt becoming a site */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute -inset-10 bg-primary/15 rounded-full blur-3xl" />

          {/* Floating chips for extra polish */}
          <div className="absolute -top-4 left-0 lg:left-4 z-10 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-lg animate-[float_6s_ease-in-out_infinite]">
            🎨 Auto-styled
          </div>
          <div className="absolute bottom-24 -right-2 lg:-right-6 z-10 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-lg animate-[float_7s_ease-in-out_infinite_1s]">
            ⚡ Live in 1 click
          </div>

          <svg
            viewBox="0 0 560 480"
            className="relative w-full max-w-md drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Glow ring around frame */}
            <rect
              x="36"
              y="36"
              width="488"
              height="368"
              rx="16"
              className="fill-none stroke-primary/20"
              strokeWidth="8"
            />

            {/* Browser frame */}
            <rect
              x="40"
              y="40"
              width="480"
              height="360"
              rx="14"
              className="fill-card stroke-border"
              strokeWidth="1.5"
            />
            {/* Browser top bar */}
            <rect
              x="40"
              y="40"
              width="480"
              height="36"
              rx="14"
              className="fill-muted"
            />
            <circle cx="62" cy="58" r="5" className="fill-border" />
            <circle cx="80" cy="58" r="5" className="fill-border" />
            <circle cx="98" cy="58" r="5" className="fill-border" />

            {/* --- Left half: built / solid UI --- */}
            <rect
              x="64"
              y="96"
              width="160"
              height="14"
              rx="4"
              className="fill-foreground"
              opacity="0.85"
            />
            <rect
              x="64"
              y="120"
              width="110"
              height="8"
              rx="4"
              className="fill-muted-foreground"
              opacity="0.6"
            />
            <rect
              x="64"
              y="148"
              width="90"
              height="28"
              rx="8"
              className="fill-primary"
            />
            <rect
              x="64"
              y="196"
              width="200"
              height="70"
              rx="10"
              className="fill-muted"
            />
            <rect
              x="64"
              y="284"
              width="94"
              height="60"
              rx="10"
              className="fill-muted"
            />
            <rect
              x="168"
              y="284"
              width="96"
              height="60"
              rx="10"
              className="fill-muted"
            />

            {/* Divider where "built" meets "unbuilt" */}
            <line
              x1="288"
              y1="88"
              x2="288"
              y2="368"
              strokeDasharray="5 6"
              className="stroke-border"
              strokeWidth="1.5"
            />

            {/* --- Right half: wireframe / being generated --- */}
            <g
              className="stroke-primary"
              fill="none"
              strokeWidth="1.5"
              strokeDasharray="4 5"
              opacity="0.6"
            >
              <rect x="312" y="96" width="150" height="14" rx="4" />
              <rect x="312" y="120" width="100" height="8" rx="4" />
              <rect x="312" y="148" width="80" height="28" rx="8" />
              <rect x="312" y="196" width="188" height="70" rx="10" />
              <rect x="312" y="284" width="88" height="60" rx="10" />
              <rect x="408" y="284" width="92" height="60" rx="10" />
            </g>

            {/* Chat bubble feeding the prompt in */}
            <g transform="translate(30, 392)">
              <rect
                x="0"
                y="0"
                width="230"
                height="58"
                rx="16"
                className="fill-primary"
              />
              <rect
                x="18"
                y="16"
                width="130"
                height="8"
                rx="4"
                className="fill-primary-foreground"
                opacity="0.9"
              />
              <rect
                x="18"
                y="32"
                width="90"
                height="8"
                rx="4"
                className="fill-primary-foreground"
                opacity="0.6"
              />
              <path d="M14 58 L4 74 L28 58 Z" className="fill-primary" />
            </g>

            {/* Spark at the seam */}
            <g className="fill-primary">
              <path
                d="M292 60 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z"
                opacity="0.9"
              />
            </g>
          </svg>
        </div>
      </section>
    </div>
  );
}
