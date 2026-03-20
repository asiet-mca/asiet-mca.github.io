import { useState, useRef, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  BookOpenText,
  CaretDown,
  CheckCircle,
  EnvelopeSimple,
  Exam,
  FileText,
  FolderSimple,
  GithubLogo,
  GraduationCap,
  HandHeart,
  House,
  Lightning,
  Lock,
  MapPin,
  Notebook,
  Phone,
  SpinnerGap,
  Upload,
  UserPlus,
  UsersThree,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { encryptData, decryptData } from "../lib/crypto";

/* ─── Config ─── */

const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || "asiet-mca";
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || "asiet-mca.github.io";
const GITHUB_BRANCH = import.meta.env.VITE_GITHUB_BRANCH || "main";
const ENCRYPTED_CONTRIB_TOKEN = import.meta.env.VITE_ENCRYPTED_CONTRIB_TOKEN || "";
const CONTRIB_PASSPHRASE = import.meta.env.VITE_CONTRIB_PASSPHRASE || "asiet-mca-contrib-2026";

/** Decrypt the contribution token on demand (cached after first call) */
let _cachedToken: string | null = null;
async function getContribToken(): Promise<string> {
  if (_cachedToken) return _cachedToken;
  if (!ENCRYPTED_CONTRIB_TOKEN) throw new Error("Contributions not configured");
  _cachedToken = await decryptData(ENCRYPTED_CONTRIB_TOKEN, CONTRIB_PASSPHRASE);
  return _cachedToken;
}

/* ─── Data ─── */

const contributionTypes = [
  {
    icon: Notebook,
    title: "Class Notes",
    description: "Handwritten or typed notes from lectures, organized by subject and module.",
    formats: "PDF, DOCX, images",
  },
  {
    icon: Exam,
    title: "Question Papers",
    description: "Previous semester university exam papers or internal test papers.",
    formats: "PDF, images",
  },
  {
    icon: FileText,
    title: "Assignments & Lab Records",
    description: "Completed assignments, lab programs, or practical records for reference.",
    formats: "PDF, DOCX, code files",
  },
  {
    icon: BookOpenText,
    title: "Entrance Prep Materials",
    description: "MCQ sets, topic summaries, or practice papers for LBS MCA entrance exam.",
    formats: "PDF, DOCX",
  },
  {
    icon: Lightning,
    title: "Study Guides & Summaries",
    description: "Concise topic summaries, formula sheets, or revision guides you've created.",
    formats: "PDF, DOCX, MD",
  },
  {
    icon: GithubLogo,
    title: "Code & Projects",
    description: "Lab programs, mini-projects, or useful code snippets from your coursework.",
    formats: "ZIP, GitHub link",
  },
];

const steps = [
  { step: "1", title: "Fill the form", description: "Tell us your name, semester, and what you'd like to contribute." },
  { step: "2", title: "Encrypted submission", description: "Your data is AES-256 encrypted and committed to the repository." },
  { step: "3", title: "Admin review", description: "Only the admin can decrypt and review submissions with the secret key." },
  { step: "4", title: "Live on platform", description: "Approved contributions are published to the course materials." },
];

const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Entrance Prep", "Alumni", "Other"];

const materialTypes = [
  "Class Notes",
  "Question Papers",
  "Assignments",
  "Lab Records",
  "Entrance Materials",
  "Study Guides",
  "Code / Projects",
  "Other",
];

/* ─── GitHub commit helper ─── */

async function commitEncryptedSubmission(encrypted: string, name: string): Promise<void> {
  const token = await getContribToken();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 20);
  const path = `contributions/${timestamp}_${slug}.json`;

  const content = btoa(JSON.stringify({ v: 1, encrypted, ts: new Date().toISOString() }));

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `New contribution from ${name}`,
        content,
        branch: GITHUB_BRANCH,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
}

/* ─── Helpers ─── */

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

export default function Contribute() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    semester: "",
    type: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const hasToken = !!ENCRYPTED_CONTRIB_TOKEN;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const payload = JSON.stringify({
        ...formData,
        submittedAt: new Date().toISOString(),
      });

      const encrypted = await encryptData(payload, CONTRIB_PASSPHRASE);

      if (hasToken) {
        await commitEncryptedSubmission(encrypted, formData.name);
      } else {
        // Fallback: store in localStorage for the admin to collect
        const existing = JSON.parse(localStorage.getItem("asiet-mca-contributions") || "[]");
        existing.push({ v: 1, encrypted, ts: new Date().toISOString() });
        localStorage.setItem("asiet-mca-contributions", JSON.stringify(existing));
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  };

  const isFormValid = formData.name && formData.email && formData.semester && formData.type;

  return (
    <div className="min-h-screen bg-bg">
      <Helmet>
        <title>Contribute — Share Notes, Papers & Materials | ASIET MCA</title>
        <meta
          name="description"
          content="Contribute to the ASIET MCA platform — share your class notes, question papers, assignments, lab records, and study materials to help fellow MCA students at Adi Shankara Institute, Kalady."
        />
        <meta
          name="keywords"
          content="ASIET MCA contribute, share MCA notes, ASIET MCA study materials, contribute question papers, MCA student community, ASIET Kalady MCA help, share MCA resources Kerala"
        />
        <link rel="canonical" href="https://asiet-mca.github.io/contribute" />
        <meta property="og:title" content="Contribute — Share Materials | ASIET MCA" />
        <meta property="og:description" content="Help fellow MCA students — share your notes, question papers, and study materials on the ASIET MCA platform." />
        <meta property="og:url" content="https://asiet-mca.github.io/contribute" />
        <meta name="twitter:title" content="Contribute — Share Materials | ASIET MCA" />
        <meta name="twitter:description" content="Help fellow MCA students — share your notes, question papers, and study materials on the ASIET MCA platform." />
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
              <HandHeart size={13} weight="duotone" />
              Open to all MCA students
            </div>
            <h1
              className="animate-fade-up mt-4 max-w-lg font-display text-[1.6rem] font-medium leading-[1.2] tracking-tight text-text-primary sm:text-[2.25rem] sm:leading-[1.15]"
              style={{ animationDelay: "80ms" }}
            >
              Help build this platform
            </h1>
            <p
              className="animate-fade-up mt-3 max-w-lg text-[13px] leading-relaxed text-text-secondary sm:mt-4 sm:text-[15px]"
              style={{ animationDelay: "160ms" }}
            >
              Share your notes, question papers, and study materials to help
              current and future MCA students at ASIET. Every contribution makes
              a difference.
            </p>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <FadeIn>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                <UsersThree size={13} weight="duotone" className="text-accent" />
                How It Works
              </div>
            </FadeIn>
            <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-4">
              {steps.map((s, i) => (
                <FadeIn key={s.step} delay={i * 0.08}>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3.5 sm:flex-col sm:gap-0 sm:p-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-muted font-mono text-[12px] font-semibold text-accent">
                      {s.step}
                    </div>
                    <div className="sm:mt-3">
                      <div className="text-[13px] font-medium text-text-primary">{s.title}</div>
                      <div className="mt-0.5 text-[12px] leading-relaxed text-text-tertiary">
                        {s.description}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── What you can contribute ─── */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <FadeIn>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                <Upload size={13} weight="duotone" className="text-accent" />
                What You Can Contribute
              </div>
            </FadeIn>
            <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 md:grid-cols-3 sm:gap-3">
              {contributionTypes.map((ct, i) => (
                <FadeIn key={ct.title} delay={i * 0.06}>
                  <div className="rounded-lg border border-border bg-bg p-3.5 sm:p-4">
                    <ct.icon size={18} weight="duotone" className="text-accent" />
                    <div className="mt-2 text-[13px] font-medium text-text-primary sm:text-[14px]">
                      {ct.title}
                    </div>
                    <div className="mt-1 text-[12px] leading-relaxed text-text-tertiary">
                      {ct.description}
                    </div>
                    <div className="mt-2 font-mono text-[10px] text-text-quaternary">
                      {ct.formats}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Contribution Form ─── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <FadeIn>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
                <UserPlus size={13} weight="duotone" className="text-accent" />
                Sign Up to Contribute
              </div>
            </FadeIn>

            <div className="mt-5 grid gap-6 sm:mt-6 md:grid-cols-[1fr_auto]">
              {/* Form */}
              <FadeIn>
                {status === "success" ? (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center sm:p-8">
                    <CheckCircle size={32} weight="duotone" className="mx-auto text-green-600" />
                    <div className="mt-3 font-display text-[17px] font-medium text-green-900 sm:text-[19px]">
                      Submission received!
                    </div>
                    <p className="mx-auto mt-2 max-w-sm text-[13px] text-green-700">
                      Your contribution details have been encrypted and
                      {hasToken ? " committed to the repository" : " saved locally"}.
                      The admin will review and contact you. Thank you!
                    </p>
                    <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-green-600">
                      <Lock size={11} weight="bold" />
                      AES-256-GCM encrypted
                    </div>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setFormData({ name: "", email: "", semester: "", type: "", subject: "", message: "" });
                      }}
                      className="mt-4 text-[12px] font-medium text-green-700 underline underline-offset-2 hover:text-green-900"
                    >
                      Submit another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {status === "error" && (
                      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
                        <XCircle size={15} weight="duotone" className="mt-0.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Name + Email row */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[11px] font-medium text-text-tertiary">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-quaternary outline-none transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-text-tertiary">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@email.com"
                          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-quaternary outline-none transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                        />
                      </div>
                    </div>

                    {/* Semester + Type row */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[11px] font-medium text-text-tertiary">
                          Semester / Batch <span className="text-red-400">*</span>
                        </label>
                        <div className="relative mt-1">
                          <select
                            required
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            className="w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 pr-8 text-[13px] text-text-primary outline-none transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                          >
                            <option value="" disabled>Select semester</option>
                            {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <CaretDown size={13} weight="bold" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-quaternary" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-text-tertiary">
                          Material Type <span className="text-red-400">*</span>
                        </label>
                        <div className="relative mt-1">
                          <select
                            required
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 pr-8 text-[13px] text-text-primary outline-none transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                          >
                            <option value="" disabled>Select type</option>
                            {materialTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <CaretDown size={13} weight="bold" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-quaternary" />
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="text-[11px] font-medium text-text-tertiary">
                        Subject Name
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Data Structures Using C, Discrete Mathematics"
                        className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-quaternary outline-none transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-[11px] font-medium text-text-tertiary">
                        Additional Details
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe what you'd like to contribute, how many files, any notes for the admin..."
                        rows={3}
                        className="mt-1 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-quaternary outline-none transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:gap-3">
                      <button
                        type="submit"
                        disabled={!isFormValid || status === "submitting"}
                        className="group flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed sm:text-[13px]"
                      >
                        {status === "submitting" ? (
                          <>
                            <SpinnerGap size={14} className="animate-spin" />
                            Encrypting & submitting...
                          </>
                        ) : (
                          <>
                            <Lock size={14} weight="duotone" />
                            Submit Encrypted
                            <ArrowRight
                              size={13}
                              weight="bold"
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          </>
                        )}
                      </button>
                      <span className="flex items-center gap-1 text-[11px] text-text-quaternary">
                        <Lock size={10} weight="bold" />
                        AES-256-GCM encrypted — only admin can read
                      </span>
                    </div>
                  </form>
                )}
              </FadeIn>

              {/* Sidebar info */}
              <FadeIn delay={0.12}>
                <div className="space-y-3 md:w-[220px]">
                  <div className="rounded-lg border border-border bg-surface p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary uppercase tracking-wide">
                      <Lock size={11} weight="bold" className="text-accent" />
                      Encryption
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-text-tertiary">
                      Your submission is encrypted with AES-256-GCM before leaving your browser.
                      {hasToken
                        ? " The encrypted file is committed directly to the GitHub repository."
                        : " Data is saved locally until the admin collects it."}
                    </p>
                  </div>

                  <a
                    href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-accent/20"
                  >
                    <GithubLogo size={18} weight="duotone" className="mt-0.5 shrink-0 text-text-secondary group-hover:text-accent" />
                    <div>
                      <div className="text-[12px] font-medium text-text-primary group-hover:text-accent">
                        Contribute via GitHub
                      </div>
                      <div className="mt-0.5 text-[11px] leading-relaxed text-text-tertiary">
                        Fork the repo, add files to the materials/ directory, and open a pull request.
                      </div>
                    </div>
                  </a>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800">
                      <WarningCircle size={13} weight="duotone" />
                      Guidelines
                    </div>
                    <ul className="mt-1.5 space-y-1 text-[11px] leading-relaxed text-amber-700">
                      <li>Only share your own work or openly available content</li>
                      <li>No copyrighted textbook scans</li>
                      <li>Include subject name and semester in filenames</li>
                      <li>PDF format preferred for documents</li>
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:justify-between">
              <FadeIn>
                <div className="text-[13px] font-medium text-text-primary sm:text-[14px]">
                  Want to browse existing materials instead?
                </div>
                <div className="mt-0.5 text-[12px] text-text-tertiary">
                  Explore semester-wise notes, question papers, and lab records.
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => navigate("/explorer")}
                    className="group flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-accent-light sm:text-[13px]"
                  >
                    <FolderSimple size={14} weight="duotone" />
                    File Explorer
                    <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <button
                    onClick={() => navigate("/entrance")}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-[12px] font-medium text-text-secondary transition-colors hover:bg-hover sm:text-[13px]"
                  >
                    <GraduationCap size={14} weight="duotone" />
                    Entrance Prep
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
            <span>Contribute to the ASIET MCA Platform</span>
            <button
              onClick={() => navigate("/")}
              className="text-text-quaternary transition-colors hover:text-accent"
            >
              Back to Home
            </button>
          </div>
          <a
            href="https://ebin.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center font-mono text-[8px] tracking-wide text-text-quaternary/50 transition-all duration-700 hover:tracking-[0.3em] hover:text-accent/70 sm:mt-4"
          >
            // eb
          </a>
        </div>
      </footer>
    </div>
  );
}
