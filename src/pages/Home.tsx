import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  FolderSimple,
  BookOpenText,
  Flask,
  Users,
  Certificate,
  EnvelopeSimple,
  Phone,
  MapPin,
  ArrowUpRight,
  Images,
  GearSix,
  GraduationCap,
  Brain,
  MathOperations,
  Translate,
  ChartBar,
  Newspaper,
  Timer,
  CheckCircle,
} from "@phosphor-icons/react";

const faculty = [
  { name: "Dr. Vincy Devi V K", role: "Associate Professor & HOD", img: "/images/faculty/vincy.webp" },
  { name: "Dr. Sneha Prakash", role: "Associate Professor", img: "/images/faculty/sneha.webp" },
  { name: "Anjali Sankar", role: "Assistant Professor", img: "/images/faculty/anjali.webp" },
  { name: "Rintu Augustine", role: "Assistant Professor", img: "/images/faculty/rintu.webp" },
  { name: "Sukrith Lal P S", role: "Assistant Professor", img: "/images/faculty/sukrith.webp" },
  { name: "Sumathy M V", role: "Lab Instructor", img: "/images/faculty/sumathy.webp" },
];

const galleryImages = [
  { src: "/images/gallery/department.webp", alt: "MCA Department" },
  { src: "/images/gallery/lab.webp", alt: "Computer Lab" },
  { src: "/images/gallery/research.webp", alt: "Research Activities" },
];

const researchAreas = [
  "Artificial Intelligence & Machine Learning",
  "Deep Learning & IoT",
  "Image Processing",
  "Augmented / Virtual Reality",
  "Big Data Analytics",
  "Network Security",
  "Nature-Inspired Algorithms",
  "Distributed Algorithms",
];

const recentActivity = [
  { label: "Git & GitHub Workshop", date: "Feb 2026" },
  { label: "3D Printing Technology", date: "Feb 2026" },
  { label: "Full-Stack MERN Course", date: "Jan 2026" },
  { label: "PRAGYAN Tech Fest", date: "Oct 2025" },
  { label: "Google Gemini AI Training", date: "Oct 2025" },
  { label: "Django Full Stack Training", date: "Sep 2025" },
];

const stats = [
  { value: "6", label: "Faculty" },
  { value: "3", label: "Research Labs" },
  { value: "8+", label: "Research Areas" },
  { value: "90%", label: "Pass Rate" },
];

const examQuickFacts = [
  { icon: Brain, label: "Computer Science", value: "50 Qs", color: "#047857" },
  { icon: MathOperations, label: "Maths & Stats", value: "25 Qs", color: "#0369A1" },
  { icon: ChartBar, label: "Aptitude & Logic", value: "25 Qs", color: "#7C3AED" },
  { icon: Translate, label: "English", value: "15 Qs", color: "#B45309" },
  { icon: Newspaper, label: "General Knowledge", value: "5 Qs", color: "#6D28D9" },
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

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg">
      <Helmet>
        <title>ASIET MCA — Course Materials & LBS Entrance Resources | Adi Shankara Institute Kalady</title>
        <meta name="description" content="Official portal for ASIET MCA (Adi Shankara Institute, Kalady) — access course materials, notes, question papers, lab records, and LBS MCA entrance exam preparation resources including syllabus, exam pattern, and study materials for Kerala MCA admission 2026." />
        <meta name="keywords" content="ASIET MCA, ASIET, Adi Shankara MCA, ASIET Kalady MCA, ASIET MCA department, ASIET MCA course materials, MCA Kalady, Adi Shankara Institute MCA, ASIET computer applications, MCA Kerala, ASIET MCA notes, ASIET MCA question papers, ASIET MCA assignments, ASIET MCA lab records, LBS MCA entrance exam Kerala, LBS MCA entrance exam 2026, MCA entrance preparation Kerala, Kerala MCA admission 2026, LBS Centre MCA exam, MCA entrance syllabus Kerala, LBS MCA exam pattern, MCA colleges Kerala, KTU MCA, ASIET MCA admission, MCA entrance study materials, ASIET Kalady admission, best MCA college Kerala, MCA entrance coaching Kerala, LBS entrance rank, MCA Ernakulam" />
        <link rel="canonical" href="https://asiet-mca.github.io/" />
        <meta property="og:title" content="ASIET MCA — Course Materials & LBS Entrance Exam Resources" />
        <meta property="og:description" content="Access MCA course materials, notes, question papers & LBS entrance exam preparation resources — syllabus, exam pattern, study materials for Kerala MCA admission. ASIET Kalady." />
        <meta property="og:url" content="https://asiet-mca.github.io/" />
        <meta name="twitter:title" content="ASIET MCA — Course Materials & LBS Entrance Exam Resources" />
        <meta name="twitter:description" content="Access MCA course materials, notes, question papers & LBS entrance exam preparation resources — syllabus, exam pattern, study materials for Kerala MCA admission. ASIET Kalady." />
      </Helmet>

      {/* ─── Top bar ─── */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/images/logos/asiet-logo.webp"
              alt="ASIET"
              className="h-6 w-auto sm:h-7"
            />
            <div className="h-4 w-px bg-border" />
            <span className="text-[11px] font-medium tracking-wide text-accent uppercase sm:text-[12px]">
              MCA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/entrance")}
              aria-label="Entrance Exam Prep"
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 sm:px-3 sm:text-[12px]"
            >
              <GraduationCap size={13} weight="duotone" />
              <span className="hidden sm:inline">Entrance Prep</span>
            </button>
            <button
              onClick={() => navigate("/admin")}
              aria-label="Faculty Portal"
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 sm:px-3 sm:text-[12px]"
            >
              <GearSix size={13} weight="duotone" />
              <span className="hidden sm:inline">Faculty</span>
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
      {/* ─── Hero Banner ─── */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/banner15.webp"
            alt="ASIET Campus Life"
            fetchPriority="high"
            className="h-full w-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C4A6E]/92 via-[#0C4A6E]/75 to-[#0C4A6E]/50 sm:bg-gradient-to-r sm:from-[#0C4A6E]/90 sm:via-[#0C4A6E]/75 sm:to-[#0C4A6E]/40" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-8 sm:px-6 sm:pt-20 sm:pb-18">
          <p
            className="animate-fade-up text-[10px] font-medium tracking-[0.15em] text-sky-200 uppercase sm:text-[11px]"
            style={{ animationDelay: "0ms" }}
          >
            Department of Computer Applications
          </p>
          <h1
            className="animate-fade-up mt-3 max-w-xl font-display text-[1.75rem] font-medium leading-[1.2] tracking-tight text-white sm:mt-4 sm:text-[2.75rem] sm:leading-[1.15]"
            style={{ animationDelay: "80ms" }}
          >
            Master of Computer Applications
          </h1>
          <p
            className="animate-fade-up mt-3 max-w-lg text-[13px] leading-relaxed text-sky-100 sm:mt-5 sm:text-[15px]"
            style={{ animationDelay: "160ms" }}
          >
            Nurturing globally competent computing professionals with innovation,
            research, entrepreneurship skills and social commitment.
          </p>
          <div
            className="animate-fade-up mt-5 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <button
              onClick={() => navigate("/explorer")}
              className="group flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[12px] font-medium text-accent transition-colors hover:bg-sky-50 sm:px-5 sm:py-2.5 sm:text-[13px]"
            >
              Browse Course Materials
              <ArrowRight
                size={14}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
            <a
              href="https://www.adishankara.ac.in/department/computer-applications"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-white/30 px-4 py-2 text-[12px] font-medium text-white/90 transition-colors hover:border-white/60 hover:text-white sm:px-5 sm:py-2.5 sm:text-[13px]"
            >
              Department Website
              <ArrowUpRight size={13} weight="bold" />
            </a>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-up mt-8 grid grid-cols-4 gap-3 sm:mt-14 sm:flex sm:gap-10"
            style={{ animationDelay: "320ms" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {s.value}
                </div>
                <div className="text-[10px] text-sky-200 sm:text-[12px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LBS Entrance Exam — Prominent section ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Top row: heading + CTA */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <FadeIn>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                <GraduationCap size={13} weight="duotone" className="text-accent" />
                LBS MCA Entrance Exam
              </div>
              <h2 className="mt-3 max-w-md font-display text-[1.35rem] font-medium leading-[1.25] tracking-tight text-text-primary sm:text-[1.65rem]">
                Preparing for the MCA Entrance?
              </h2>
              <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-text-secondary sm:text-[14px]">
                120 objective MCQs. 2 hours. No negative marking. Access syllabus,
                study materials, preparation strategy & more.
              </p>
            </FadeIn>
            <FadeIn delay={0.15} className="shrink-0">
              <button
                onClick={() => navigate("/entrance")}
                className="group flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-accent-light sm:px-6 sm:py-3 sm:text-[13px]"
              >
                Explore Entrance Resources
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </FadeIn>
          </div>

          {/* Exam quick facts */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-5 sm:gap-2.5">
            {examQuickFacts.map((fact, i) => (
              <FadeIn key={fact.label} delay={0.05 + i * 0.06}>
                <div className="rounded-lg border border-border bg-bg px-3 py-2.5 sm:px-3.5 sm:py-3">
                  <fact.icon size={16} weight="duotone" style={{ color: fact.color }} />
                  <div className="mt-1.5 font-display text-[16px] font-semibold text-text-primary sm:text-[18px]">
                    {fact.value}
                  </div>
                  <div className="mt-0.5 text-[10px] text-text-tertiary sm:text-[11px]">
                    {fact.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Key highlights strip */}
          <FadeIn delay={0.4}>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6">
              {[
                { icon: Timer, text: "2 hours duration" },
                { icon: CheckCircle, text: "No negative marking" },
                { icon: GraduationCap, text: "40+ colleges in Kerala" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-[11px] text-text-quaternary sm:text-[12px]">
                  <item.icon size={13} weight="duotone" className="text-text-quaternary" />
                  {item.text}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Faculty ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <FadeIn>
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <Users size={13} weight="duotone" className="text-accent" />
              Our Faculty
            </div>
          </FadeIn>
          {/* Mobile: compact horizontal rows */}
          <div className="mt-5 space-y-2.5 sm:hidden">
            {faculty.map((f, i) => (
              <FadeIn key={f.name} delay={i * 0.05}>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5">
                  <img
                    src={f.img}
                    alt={f.name}
                    loading="lazy"
                    decoding="async"
                    className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-border"
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-text-primary">{f.name}</div>
                    <div className="text-[11px] text-text-tertiary">{f.role}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          {/* Desktop: card grid */}
          <div className="mt-7 hidden gap-5 sm:grid sm:grid-cols-3">
            {faculty.map((f, i) => (
              <FadeIn key={f.name} delay={i * 0.07}>
                <div
                  className="group rounded-xl border border-border bg-bg p-4 text-center hover:border-accent/20 hover:shadow-sm transition-shadow"
                >
                  <img
                    src={f.img}
                    alt={f.name}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-border group-hover:ring-accent/30 transition-all"
                  />
                  <div className="mt-3.5 text-[14px] font-medium text-text-primary">
                    {f.name}
                  </div>
                  <div className="mt-0.5 text-[12px] text-text-tertiary">
                    {f.role}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Two-column: Research + Activities ─── */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl gap-0 md:grid-cols-[1fr_1px_1fr]">
          {/* Research */}
          <div className="px-4 py-8 sm:px-6 sm:py-10">
            <FadeIn>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                <Flask size={13} weight="duotone" className="text-accent" />
                Research Focus
              </div>
            </FadeIn>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
              {researchAreas.map((area, i) => (
                <FadeIn key={area} delay={i * 0.04}>
                  <li className="flex items-start gap-2 text-[13px] text-text-secondary sm:text-[13.5px]">
                    <span className="mt-[7px] block h-[3px] w-[3px] shrink-0 rounded-full bg-text-quaternary" />
                    {area}
                  </li>
                </FadeIn>
              ))}
            </ul>
            <FadeIn delay={0.35}>
              <div className="mt-4 text-[11px] text-text-tertiary sm:mt-6 sm:text-[12px]">
                Labs: Multimedia Lab, Data Analytics Lab, Bioinformatics Lab
              </div>
            </FadeIn>
          </div>

          {/* Divider */}
          <div className="hidden bg-border md:block" />

          {/* Recent activities */}
          <div className="border-t border-border px-4 py-8 sm:px-6 sm:py-10 md:border-t-0">
            <FadeIn>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                <BookOpenText size={13} weight="duotone" className="text-accent" />
                Recent Activities
              </div>
            </FadeIn>
            <div className="mt-4 space-y-0 sm:mt-5">
              {recentActivity.map((a, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="flex items-center justify-between border-b border-border-subtle py-2 last:border-0 sm:py-2.5">
                    <span className="text-[13px] text-text-secondary">{a.label}</span>
                    <span className="ml-3 shrink-0 font-mono text-[10px] text-text-quaternary sm:text-[11px]">
                      {a.date}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Highlights ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <FadeIn>
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <Certificate size={13} weight="duotone" className="text-accent" />
              Highlights
            </div>
          </FadeIn>
          <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 md:grid-cols-3">
            <FadeIn delay={0}>
              <div>
                <div className="text-[12px] font-medium text-text-primary">
                  Professional Societies
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {[
                    { name: "ACM Student Chapter", logo: "/images/logos/acm.webp" },
                    { name: "IEEE Computer Society", logo: "/images/logos/ieee.webp" },
                    { name: "CSI", logo: "/images/logos/csi.webp" },
                  ].map((s) => (
                    <span
                      key={s.name}
                      className="flex items-center gap-1.5 rounded border border-border bg-bg px-2 py-1 text-[10px] text-text-secondary sm:text-[11px]"
                    >
                      <img src={s.logo} alt={s.name} className="h-4 w-4 rounded-sm object-contain" />
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <div className="text-[12px] font-medium text-text-primary">
                  Patents Filed
                </div>
                <ul className="mt-2 space-y-1.5">
                  <li className="text-[12px] leading-snug text-text-secondary sm:text-[12.5px]">
                    AI/IoT-based automated irrigation system
                  </li>
                  <li className="text-[12px] leading-snug text-text-secondary sm:text-[12.5px]">
                    Handheld caprine/bovine eye imaging device
                  </li>
                  <li className="text-[12px] leading-snug text-text-secondary sm:text-[12.5px]">
                    AI/IoT automatic metastasis risk prediction
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.16}>
              <div>
                <div className="text-[12px] font-medium text-text-primary">
                  Newsletter
                </div>
                <p className="mt-2 text-[12px] text-text-secondary sm:text-[12.5px]">
                  SANGANANI (2024–25) — monthly department newsletter documenting
                  activities and achievements.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <FadeIn>
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <Images size={13} weight="duotone" className="text-accent" />
              Department Gallery
            </div>
          </FadeIn>
          {/* Mobile: horizontal scroll, Desktop: 3-col grid */}
          <div className="mt-4 -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
            {galleryImages.map((img, i) => (
              <FadeIn key={img.alt} delay={i * 0.08}>
                <div className="group w-60 shrink-0 overflow-hidden rounded-lg border border-border sm:w-auto">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="bg-surface px-3 py-2 text-[11px] text-text-tertiary sm:text-[12px]">
                    {img.alt}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mission ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <FadeIn>
            <div className="text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              Mission
            </div>
          </FadeIn>
          <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-3">
            {[
              "Quality education with industry collaboration and teaching excellence.",
              "Academic environment fostering research, innovation, and entrepreneurship.",
              "Developing socially committed professionals for societal development.",
            ].map((m, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <p className="font-display text-[14px] leading-relaxed text-text-secondary italic sm:text-[15px]">
                  {m}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-surface border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col justify-between gap-5 sm:gap-6 md:flex-row md:items-start">
            <div className="flex items-center gap-3">
              <img
                src="/logo.webp"
                alt="ASIET"
                className="h-9 w-9 shrink-0 object-contain md:hidden"
              />
              <img
                src="/images/logos/asiet-footer-logo.webp"
                alt="ASIET"
                className="hidden h-10 w-auto opacity-80 md:block"
              />
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
            <span>Course Materials Repository — Built for ASIET MCA students</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/contribute")}
                className="text-text-quaternary transition-colors hover:text-accent"
              >
                Contribute
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => navigate("/open-source")}
                className="text-text-quaternary transition-colors hover:text-accent"
              >
                Open Source
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => navigate("/admin")}
                className="text-text-quaternary transition-colors hover:text-accent"
              >
                Faculty Portal
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
