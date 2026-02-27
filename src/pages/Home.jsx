import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FolderSimple,
  BookOpenText,
  Flask,
  Users,
  Certificate,
  GraduationCap,
  EnvelopeSimple,
  Phone,
  MapPin,
  ArrowUpRight,
  Images,
} from "@phosphor-icons/react";

const faculty = [
  { name: "Dr. Vincy Devi V K", role: "Associate Professor & HOD", img: "/images/faculty/vincy.jpg" },
  { name: "Dr. Sneha Prakash", role: "Associate Professor", img: "/images/faculty/sneha.jpg" },
  { name: "Anjali Sankar", role: "Assistant Professor", img: "/images/faculty/anjali.jpg" },
  { name: "Rintu Augustine", role: "Assistant Professor", img: "/images/faculty/rintu.jpg" },
  { name: "Sukrith Lal P S", role: "Assistant Professor", img: "/images/faculty/sukrith.jpg" },
  { name: "Sumathy M V", role: "Lab Instructor", img: "/images/faculty/sumathy.jpg" },
];

const galleryImages = [
  { src: "/images/gallery/department.jpeg", alt: "MCA Department" },
  { src: "/images/gallery/lab.jpg", alt: "Computer Lab" },
  { src: "/images/gallery/research.jpg", alt: "Research Activities" },
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

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg">
      {/* ─── Top bar ─── */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-3">
            <img
              src="/images/logos/asiet-logo.png"
              alt="ASIET"
              className="h-7 w-auto"
            />
            <div className="h-4 w-px bg-border" />
            <span className="text-[12px] font-medium tracking-wide text-accent uppercase">
              MCA
            </span>
          </div>
          <button
            onClick={() => navigate("/explorer")}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-accent-light"
          >
            <FolderSimple size={14} weight="duotone" />
            File Explorer
          </button>
        </div>
      </header>

      {/* ─── Hero Banner ─── */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/banner15.jpg"
            alt="ASIET Campus Life"
            className="h-full w-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C4A6E]/90 via-[#0C4A6E]/75 to-[#0C4A6E]/40" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-18">
          <p
            className="animate-fade-up text-[11px] font-medium tracking-[0.15em] text-sky-200 uppercase"
            style={{ animationDelay: "0ms" }}
          >
            Department of Computer Applications
          </p>
          <h1
            className="animate-fade-up mt-4 max-w-xl font-display text-[2.75rem] font-medium leading-[1.15] tracking-tight text-white"
            style={{ animationDelay: "80ms" }}
          >
            Master of Computer Applications
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-lg text-[15px] leading-relaxed text-sky-100/80"
            style={{ animationDelay: "160ms" }}
          >
            Nurturing globally competent computing professionals with innovation,
            research, entrepreneurship skills and social commitment.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <button
              onClick={() => navigate("/explorer")}
              className="group flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[13px] font-medium text-accent transition-colors hover:bg-sky-50"
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
              className="flex items-center gap-1.5 rounded-lg border border-white/30 px-5 py-2.5 text-[13px] font-medium text-white/90 transition-colors hover:border-white/60 hover:text-white"
            >
              Department Website
              <ArrowUpRight size={13} weight="bold" />
            </a>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-up mt-14 flex gap-10"
            style={{ animationDelay: "320ms" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-semibold text-white">
                  {s.value}
                </div>
                <div className="text-[12px] text-sky-200/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Faculty ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
            <Users size={13} weight="duotone" className="text-accent" />
            Our Faculty
          </div>
          <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {faculty.map((f) => (
              <div
                key={f.name}
                className="group rounded-xl border border-border bg-bg p-4 text-center transition-all hover:border-accent/20 hover:shadow-sm"
              >
                <img
                  src={f.img}
                  alt={f.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-border transition-all group-hover:ring-accent/30"
                />
                <div className="mt-3.5 text-[14px] font-medium text-text-primary">
                  {f.name}
                </div>
                <div className="mt-0.5 text-[12px] text-text-tertiary">
                  {f.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Two-column: Research + Activities ─── */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl gap-0 md:grid-cols-[1fr_1px_1fr]">
          {/* Research */}
          <div className="px-6 py-10">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <Flask size={13} weight="duotone" className="text-accent" />
              Research Focus
            </div>
            <ul className="mt-5 space-y-2.5">
              {researchAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-start gap-2 text-[13.5px] text-text-secondary"
                >
                  <span className="mt-[7px] block h-[3px] w-[3px] shrink-0 rounded-full bg-text-quaternary" />
                  {area}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-[12px] text-text-tertiary">
              Labs: Multimedia Lab, Data Analytics Lab, Bioinformatics Lab
            </div>
          </div>

          {/* Divider */}
          <div className="hidden bg-border md:block" />

          {/* Recent activities */}
          <div className="border-t border-border px-6 py-10 md:border-t-0">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
              <BookOpenText size={13} weight="duotone" className="text-accent" />
              Recent Activities
            </div>
            <div className="mt-5 space-y-0">
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border-subtle py-2.5 last:border-0"
                >
                  <span className="text-[13px] text-text-secondary">{a.label}</span>
                  <span className="font-mono text-[11px] text-text-quaternary">
                    {a.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Highlights ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
            <Certificate size={13} weight="duotone" className="text-accent" />
            Highlights
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-[12px] font-medium text-text-primary">
                Professional Societies
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {[
                  { name: "ACM Student Chapter", logo: "/images/logos/acm.jpg" },
                  { name: "IEEE Computer Society", logo: "/images/logos/ieee.jpg" },
                  { name: "CSI", logo: "/images/logos/csi.jpg" },
                ].map((s) => (
                  <span
                    key={s.name}
                    className="flex items-center gap-1.5 rounded border border-border bg-bg px-2 py-1 text-[11px] text-text-secondary"
                  >
                    <img src={s.logo} alt={s.name} className="h-4 w-4 rounded-sm object-contain" />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-text-primary">
                Patents Filed
              </div>
              <ul className="mt-2 space-y-1.5">
                <li className="text-[12.5px] leading-snug text-text-secondary">
                  AI/IoT-based automated irrigation system
                </li>
                <li className="text-[12.5px] leading-snug text-text-secondary">
                  Handheld caprine/bovine eye imaging device
                </li>
                <li className="text-[12.5px] leading-snug text-text-secondary">
                  AI/IoT automatic metastasis risk prediction
                </li>
              </ul>
            </div>
            <div>
              <div className="text-[12px] font-medium text-text-primary">
                Newsletter
              </div>
              <p className="mt-2 text-[12.5px] text-text-secondary">
                SANGANANI (2024–25) — monthly department newsletter documenting
                activities and achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
            <Images size={13} weight="duotone" className="text-accent" />
            Department Gallery
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {galleryImages.map((img) => (
              <div key={img.alt} className="group overflow-hidden rounded-lg border border-border">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="bg-surface px-3 py-2 text-[12px] text-text-tertiary">
                  {img.alt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mission ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
            Mission
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "Quality education with industry collaboration and teaching excellence.",
              "Academic environment fostering research, innovation, and entrepreneurship.",
              "Developing socially committed professionals for societal development.",
            ].map((m, i) => (
              <p
                key={i}
                className="font-display text-[15px] leading-relaxed text-text-secondary italic"
              >
                {m}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-surface border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="ASIET"
                className="h-9 w-9 object-contain md:hidden"
              />
              <img
                src="/images/logos/asiet-footer-logo.png"
                alt="ASIET"
                className="hidden h-10 w-auto opacity-80 md:block"
              />
              <div>
                <div className="font-display text-[13px] font-semibold text-text-primary">
                  Adi Shankara Institute of Engineering & Technology
                </div>
                <div className="mt-1 text-[12px] text-text-tertiary">
                  Department of Computer Applications (MCA)
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-[12px] text-text-tertiary md:items-end">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} weight="bold" className="text-text-quaternary" />
                Vidya Bharathi Nagar, Kalady, Ernakulam, Kerala 683574
              </div>
              <div className="flex items-center gap-1.5">
                <Phone size={12} weight="bold" className="text-text-quaternary" />
                0484-2463825
              </div>
              <div className="flex items-center gap-1.5">
                <EnvelopeSimple size={12} weight="bold" className="text-text-quaternary" />
                info@adishankara.ac.in
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-border-subtle pt-4 text-[11px] text-text-quaternary">
            Course Materials Repository — Built for ASIET MCA students
          </div>
        </div>
      </footer>
    </div>
  );
}
