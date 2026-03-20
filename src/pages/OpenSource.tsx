import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  ClipboardText,
  EnvelopeSimple,
  FolderSimple,
  GitBranch,
  GitCommit,
  GithubLogo,
  HandHeart,
  House,
  Lightbulb,
  ListChecks,
  MapPin,
  Phone,
  Prohibit,
  Rocket,
  Stack,
  TreeStructure,
} from "@phosphor-icons/react";

/* ─── Data ─── */

const quickStartSteps = [
  {
    step: "1",
    title: "Fork & Clone",
    description: "Fork the repository on GitHub, then clone your fork locally.",
    command: "git clone https://github.com/<you>/asiet-mca.github.io",
  },
  {
    step: "2",
    title: "Install & Run",
    description: "Install dependencies and start the dev server.",
    command: "npm install && npm run dev",
  },
  {
    step: "3",
    title: "Create Branch",
    description: "Create a feature branch from main before making changes.",
    command: "git checkout -b feat/your-feature",
  },
  {
    step: "4",
    title: "Push & PR",
    description: "Push to your fork and open a pull request against main.",
    command: "git push origin feat/your-feature",
  },
];

const branchConventions = [
  { prefix: "feat/", meaning: "New feature", example: "feat/dark-mode" },
  { prefix: "fix/", meaning: "Bug fix", example: "fix/sidebar-scroll" },
  { prefix: "docs/", meaning: "Documentation", example: "docs/api-readme" },
  { prefix: "style/", meaning: "UI/styling", example: "style/card-spacing" },
  { prefix: "refactor/", meaning: "Refactoring", example: "refactor/hooks" },
  { prefix: "perf/", meaning: "Performance", example: "perf/lazy-images" },
  { prefix: "chore/", meaning: "Build, deps", example: "chore/update-vite" },
];

const commitExamples = [
  "feat: add dark mode toggle to header",
  "fix: prevent sidebar overflow on mobile",
  "style: adjust card border radius",
  "refactor: extract file grid into component",
  "perf: lazy load faculty images",
];

const techStack = [
  { name: "React 19", detail: "TypeScript" },
  { name: "Vite 7", detail: "Build tool" },
  { name: "Tailwind CSS 4", detail: "Styling" },
  { name: "React Router 7", detail: "Routing" },
  { name: "React Query", detail: "Data fetching" },
  { name: "Phosphor Icons", detail: "Duotone" },
  { name: "Motion", detail: "Animation" },
  { name: "GitHub API", detail: "Content" },
];

const guidelines = [
  "Don't commit .env files or secrets",
  "Don't push directly to main — open a PR",
  "Don't add dependencies without discussing in an issue",
  "Match the existing design system (colors, fonts, spacing)",
  "Run npm run build before opening a PR",
];

/* ─── Animated helpers ─── */

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Component ─── */

export default function OpenSource() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg">
      <Helmet>
        <title>Open Source — Contribute Code to ASIET MCA Platform</title>
        <meta
          name="description"
          content="Developer guide for contributing to the ASIET MCA open source platform — fork, clone, build features, fix bugs, and submit pull requests. Built with React, TypeScript, Vite, and Tailwind CSS."
        />
        <meta
          name="keywords"
          content="ASIET MCA open source, contribute code ASIET MCA, ASIET MCA GitHub, MCA platform developer guide, React TypeScript project, ASIET Kalady MCA, open source MCA Kerala"
        />
        <link rel="canonical" href="https://asiet-mca.github.io/open-source" />
        <meta property="og:title" content="Open Source — Contribute Code | ASIET MCA" />
        <meta property="og:description" content="Developer guide for contributing to the ASIET MCA open source platform. Fork, build, and submit pull requests." />
        <meta property="og:url" content="https://asiet-mca.github.io/open-source" />
        <meta name="twitter:title" content="Open Source — Contribute Code | ASIET MCA" />
        <meta name="twitter:description" content="Developer guide for contributing to the ASIET MCA open source platform. Fork, build, and submit pull requests." />
      </Helmet>

      {/* ─── Top bar ─── */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/images/logos/asiet-logo.webp" alt="ASIET" className="h-6 w-auto sm:h-7" />
            <div className="h-4 w-px bg-border" />
            <span className="text-[11px] font-medium tracking-wide text-accent uppercase sm:text-[12px]">
              MCA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              aria-label="Home"
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:bg-hover sm:px-3 sm:text-[12px]"
            >
              <House size={13} weight="duotone" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={() => navigate("/explorer")}
              className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-accent-light sm:px-3.5 sm:text-[12px]"
            >
              <FolderSimple size={14} weight="duotone" />
              File Explorer
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ─── Hero ─── */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-11">
            <div
              className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-accent/15 bg-accent-muted px-3 py-1 text-[10px] font-medium text-accent sm:text-[11px]"
              style={{ animationDelay: "0ms" }}
            >
              <GithubLogo size={13} weight="duotone" />
              Open Source
            </div>
            <h1
              className="animate-fade-up mt-4 max-w-lg font-display text-[1.6rem] font-medium leading-[1.2] tracking-tight text-text-primary sm:text-[2.25rem] sm:leading-[1.15]"
              style={{ animationDelay: "80ms" }}
            >
              Contribute to ASIET MCA
            </h1>
            <p
              className="animate-fade-up mt-3 max-w-lg text-[13px] leading-relaxed text-text-secondary sm:mt-4 sm:text-[15px]"
              style={{ animationDelay: "160ms" }}
            >
              This platform is open source. Help us build better tools for MCA
              students — fix bugs, add features, improve the UI, or contribute
              study materials.
            </p>
            <div
              className="animate-fade-up mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <a
                href="https://github.com/asiet-mca/asiet-mca.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-[12px] font-medium text-text-secondary transition-colors hover:border-accent/30 hover:bg-hover sm:px-5 sm:py-2.5 sm:text-[13px]"
              >
                <GithubLogo size={15} weight="duotone" />
                View on GitHub
                <ArrowUpRight size={13} weight="bold" />
              </a>
              <a
                href="https://github.com/asiet-mca/asiet-mca.github.io/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-accent-light sm:px-5 sm:py-2.5 sm:text-[13px]"
              >
                Browse Issues
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </section>

        {/* ─── Quick Start ─── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <FadeIn>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                <Rocket size={13} weight="duotone" className="text-accent" />
                Quick Start
              </div>
            </FadeIn>
            <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
              {quickStartSteps.map((s, i) => (
                <FadeIn key={s.step} delay={i * 0.06}>
                  <div className="rounded-lg border border-border bg-surface p-3.5 sm:p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-muted font-mono text-[11px] font-semibold text-accent">
                        {s.step}
                      </div>
                      <div className="text-[13px] font-medium text-text-primary">{s.title}</div>
                    </div>
                    <div className="mt-2 text-[12px] leading-relaxed text-text-tertiary">
                      {s.description}
                    </div>
                    <div className="mt-2.5 overflow-x-auto rounded bg-bg px-2.5 py-1.5 scrollbar-none">
                      <code className="whitespace-nowrap font-mono text-[10.5px] text-accent sm:text-[11px]">
                        {s.command}
                      </code>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Branch Naming + Commit Convention (two-column) ─── */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              {/* Branch naming */}
              <div>
                <FadeIn>
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                    <GitBranch size={13} weight="duotone" className="text-accent" />
                    Branch Naming
                  </div>
                </FadeIn>
                <div className="mt-4 overflow-hidden rounded-lg border border-border sm:mt-5">
                  {branchConventions.map((b, i) => (
                    <FadeIn key={b.prefix} delay={i * 0.03}>
                      <div className={`flex items-center gap-3 px-3 py-2 ${i > 0 ? "border-t border-border" : ""}`}>
                        <code className="w-[68px] shrink-0 rounded bg-accent-muted px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold text-accent sm:text-[11px]">
                          {b.prefix}
                        </code>
                        <span className="min-w-0 flex-1 text-[12px] text-text-secondary">
                          {b.meaning}
                        </span>
                        <code className="hidden font-mono text-[10px] text-text-quaternary sm:block">
                          {b.example}
                        </code>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>

              {/* Commit convention */}
              <div>
                <FadeIn>
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                    <GitCommit size={13} weight="duotone" className="text-accent" />
                    Commit Convention
                  </div>
                </FadeIn>
                <FadeIn delay={0.05}>
                  <div className="mt-4 rounded-lg border border-border p-3.5 sm:mt-5 sm:p-4">
                    <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide">Format</div>
                    <code className="mt-1.5 block rounded bg-bg px-2.5 py-1.5 font-mono text-[11px] text-accent sm:text-[12px]">
                      type: short description
                    </code>
                    <div className="mt-3.5 text-[11px] font-medium text-text-tertiary uppercase tracking-wide">Examples</div>
                    <div className="mt-1.5 space-y-1">
                      {commitExamples.map((ex, i) => (
                        <code key={i} className="block rounded bg-bg px-2.5 py-1 font-mono text-[10px] text-text-secondary sm:text-[11px]">
                          {ex}
                        </code>
                      ))}
                    </div>
                    <div className="mt-3.5 space-y-1 text-[11px] leading-relaxed text-text-quaternary">
                      <div>Lowercase, no period, under 72 chars, imperative mood</div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Tech Stack + Project Structure (two-column) ─── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-8">
              {/* Tech Stack */}
              <div>
                <FadeIn>
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                    <Stack size={13} weight="duotone" className="text-accent" />
                    Tech Stack
                  </div>
                </FadeIn>
                <div className="mt-4 grid grid-cols-2 gap-1.5 sm:mt-5 sm:grid-cols-4 sm:gap-2">
                  {techStack.map((t, i) => (
                    <FadeIn key={t.name} delay={i * 0.04}>
                      <div className="rounded-md border border-border bg-surface px-2.5 py-2 sm:px-3 sm:py-2.5">
                        <div className="text-[12px] font-medium text-text-primary">{t.name}</div>
                        <div className="text-[10px] text-text-quaternary">{t.detail}</div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>

              {/* Project Structure */}
              <div className="md:w-[280px]">
                <FadeIn>
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                    <TreeStructure size={13} weight="duotone" className="text-accent" />
                    Project Structure
                  </div>
                </FadeIn>
                <FadeIn delay={0.06}>
                  <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface p-3.5 scrollbar-none sm:mt-5 sm:p-4">
                    <pre className="font-mono text-[10px] leading-[1.9] text-text-secondary sm:text-[11px]">
{`src/
├── pages/       `}<span className="text-text-quaternary"># Route pages</span>{`
├── components/  `}<span className="text-text-quaternary"># Reusable UI</span>{`
├── hooks/       `}<span className="text-text-quaternary"># Custom hooks</span>{`
├── services/    `}<span className="text-text-quaternary"># GitHub API</span>{`
├── lib/         `}<span className="text-text-quaternary"># Utilities</span>{`
├── data/        `}<span className="text-text-quaternary"># Static data</span>{`
└── index.css    `}<span className="text-text-quaternary"># Theme</span>
                    </pre>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Open Issues + Guidelines (two-column) ─── */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-8">
              {/* Open Issues */}
              <div>
                <FadeIn>
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                    <Bug size={13} weight="duotone" className="text-accent" />
                    Find Something to Work On
                  </div>
                  <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-text-secondary">
                    Check the GitHub issues for bugs, feature requests, and tasks
                    labeled{" "}
                    <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-[10px]">good first issue</code>{" "}
                    if you're just getting started.
                  </p>
                </FadeIn>
                <FadeIn delay={0.08}>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="https://github.com/asiet-mca/asiet-mca.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[11px] font-medium text-white transition-colors hover:bg-accent-light sm:text-[12px]"
                    >
                      <Lightbulb size={13} weight="duotone" />
                      Good First Issues
                      <ArrowUpRight size={12} weight="bold" />
                    </a>
                    <a
                      href="https://github.com/asiet-mca/asiet-mca.github.io/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[11px] font-medium text-text-secondary transition-colors hover:bg-hover sm:text-[12px]"
                    >
                      <ClipboardText size={13} weight="duotone" />
                      All Issues
                    </a>
                    <a
                      href="https://github.com/asiet-mca/asiet-mca.github.io/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[11px] font-medium text-text-secondary transition-colors hover:bg-hover sm:text-[12px]"
                    >
                      <Rocket size={13} weight="duotone" />
                      Features
                    </a>
                  </div>
                </FadeIn>
              </div>

              {/* Guidelines */}
              <div className="md:w-[260px]">
                <FadeIn>
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                    <ListChecks size={13} weight="duotone" className="text-accent" />
                    Guidelines
                  </div>
                </FadeIn>
                <FadeIn delay={0.06}>
                  <div className="mt-4 rounded-lg border border-border p-3.5 sm:mt-5 sm:p-4">
                    <ul className="space-y-2">
                      {guidelines.map((rule, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-text-secondary sm:text-[12px]">
                          <Prohibit size={12} weight="duotone" className="mt-[3px] shrink-0 text-text-quaternary" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:justify-between">
              <FadeIn>
                <div className="text-[13px] font-medium text-text-primary sm:text-[14px]">
                  Want to share study materials instead?
                </div>
                <div className="mt-0.5 text-[12px] text-text-tertiary">
                  Contribute notes, question papers, and resources without writing code.
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => navigate("/contribute")}
                    className="group flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-accent-light sm:text-[13px]"
                  >
                    <HandHeart size={14} weight="duotone" />
                    Contribute Materials
                    <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <button
                    onClick={() => navigate("/explorer")}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-[12px] font-medium text-text-secondary transition-colors hover:bg-hover sm:text-[13px]"
                  >
                    <FolderSimple size={14} weight="duotone" />
                    Browse Materials
                  </button>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-surface border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col justify-between gap-5 sm:gap-6 md:flex-row md:items-start">
            <div className="flex items-center gap-3">
              <img src="/logo.webp" alt="ASIET" className="h-9 w-9 shrink-0 object-contain md:hidden" />
              <img src="/images/logos/asiet-footer-logo.webp" alt="ASIET" className="hidden h-10 w-auto opacity-80 md:block" />
              <div className="min-w-0">
                <div className="font-display text-[13px] font-semibold text-text-primary">
                  Adi Shankara Institute of Engineering & Technology
                </div>
                <div className="mt-0.5 text-[11px] text-text-tertiary sm:mt-1 sm:text-[12px]">
                  Department of Computer Applications (MCA)
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-[11px] text-text-tertiary sm:gap-2 sm:text-[12px] md:items-end">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} weight="bold" className="shrink-0 text-text-quaternary" />
                Vidya Bharathi Nagar, Kalady, Ernakulam, Kerala 683574
              </div>
              <div className="flex items-center gap-1.5">
                <Phone size={12} weight="bold" className="shrink-0 text-text-quaternary" />
                0484-2463825
              </div>
              <div className="flex items-center gap-1.5">
                <EnvelopeSimple size={12} weight="bold" className="shrink-0 text-text-quaternary" />
                info@adishankara.ac.in
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-3 text-[10px] text-text-quaternary sm:mt-6 sm:pt-4 sm:text-[11px]">
            <span>Open Source — Built for ASIET MCA students</span>
            <button
              onClick={() => navigate("/")}
              className="text-text-quaternary transition-colors hover:text-accent"
            >
              Back to Home
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
