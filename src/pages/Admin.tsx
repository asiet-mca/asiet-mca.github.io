import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FolderPlus,
  UploadSimple,
  Trash,
  GithubLogo,
  Key,
  X,
  SpinnerGap,
  CheckCircle,
  WarningCircle,
  Info,
  House,
  GearSix,
  SignOut,
  CaretRight,
  Folder,
  FileText,
  CloudArrowUp,
  ArrowsClockwise,
  Eye,
  EyeSlash,
  Copy,
  ArrowLeft,
  ArrowUpRight,
  TreeStructure,
} from "@phosphor-icons/react";
import { GitHubService } from "../services/github";
import type { GitHubConfig, GitHubContent } from "../services/github";
import { decryptToken } from "../lib/crypto";

/* ═══════════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════════ */

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const STORAGE_KEY = "asiet-mca-admin";
const TOAST_MS = 4000;

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

function fmtSize(b: number): string {
  if (!b) return "\u2014";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}`;
}

function fileColor(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    pdf: "text-red-500",
    doc: "text-blue-600",
    docx: "text-blue-600",
    ppt: "text-orange-500",
    pptx: "text-orange-500",
    xls: "text-green-600",
    xlsx: "text-green-600",
    jpg: "text-violet-500",
    jpeg: "text-violet-500",
    png: "text-violet-500",
    gif: "text-violet-500",
    svg: "text-violet-500",
    zip: "text-yellow-600",
    rar: "text-yellow-600",
    py: "text-cyan-600",
    js: "text-cyan-600",
    ts: "text-cyan-600",
    java: "text-cyan-600",
    txt: "text-stone-500",
    md: "text-stone-500",
  };
  return map[ext] || "text-stone-400";
}

function readFileBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════
   Course Structure (for initial seeding)
   ═══════════════════════════════════════════ */

const MATERIAL_TYPES = ["Notes", "Assignments", "Question Papers", "Lab Records"];

const CURRICULUM = [
  {
    name: "Semester 1",
    subjects: [
      "Discrete Mathematics",
      "Computer Organization & Architecture",
      "Data Structures Using C",
      "Programming in Python",
      "Professional Communication",
    ],
  },
  {
    name: "Semester 2",
    subjects: [
      "Operating Systems",
      "Database Management Systems",
      "Object Oriented Programming Using Java",
      "Computer Networks",
      "Optimization Techniques",
    ],
  },
  {
    name: "Semester 3",
    subjects: [
      "Machine Learning",
      "Web Technologies",
      "Software Engineering",
      "Data Mining & Warehousing",
      "Cloud Computing",
    ],
  },
  {
    name: "Semester 4",
    subjects: [
      "Artificial Intelligence",
      "Distributed Systems",
      "Cyber Security",
      "Project & Viva Voce",
      "Seminar",
    ],
  },
];

function buildSeedPaths(): string[] {
  const paths: string[] = [];
  for (const sem of CURRICULUM) {
    for (const subject of sem.subjects) {
      for (const mat of MATERIAL_TYPES) {
        paths.push(`${sem.name}/${subject}/${mat}`);
      }
    }
  }
  return paths;
}

/* ═══════════════════════════════════════════
   Toast Component
   ═══════════════════════════════════════════ */

function Toasts({
  items,
  onDismiss,
}: {
  items: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-2.5 rounded-lg border bg-white px-4 py-3 shadow-lg animate-slide-in ${
            t.type === "success"
              ? "border-green-200"
              : t.type === "error"
                ? "border-red-200"
                : "border-blue-200"
          }`}
        >
          {t.type === "success" && (
            <CheckCircle
              size={18}
              weight="fill"
              className="mt-px shrink-0 text-green-500"
            />
          )}
          {t.type === "error" && (
            <WarningCircle
              size={18}
              weight="fill"
              className="mt-px shrink-0 text-red-500"
            />
          )}
          {t.type === "info" && (
            <Info
              size={18}
              weight="fill"
              className="mt-px shrink-0 text-blue-500"
            />
          )}
          <span className="text-[13px] leading-snug text-stone-700">
            {t.message}
          </span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-2 shrink-0 text-stone-400 hover:text-stone-600"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Auth Screen
   ═══════════════════════════════════════════ */

function AuthScreen({ onConnect }: { onConnect: (c: GitHubConfig) => void }) {
  const navigate = useNavigate();
  const hasEncrypted = !!import.meta.env.VITE_ENCRYPTED_TOKEN;
  const [mode, setMode] = useState<"passphrase" | "token">(
    hasEncrypted ? "passphrase" : "token"
  );

  // Passphrase mode state
  const [passphrase, setPassphrase] = useState("");

  // Token mode state
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState(
    import.meta.env.VITE_GITHUB_OWNER || "asiet-mca"
  );
  const [repo, setRepo] = useState(
    import.meta.env.VITE_GITHUB_REPO || "asiet-mca.github.io"
  );
  const [branch, setBranch] = useState(
    import.meta.env.VITE_GITHUB_BRANCH || "main"
  );
  const [basePath, setBasePath] = useState(
    import.meta.env.VITE_GITHUB_BASE_PATH || "materials"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  function envConfig(tok: string): GitHubConfig {
    return {
      token: tok,
      owner: import.meta.env.VITE_GITHUB_OWNER || "asiet-mca",
      repo: import.meta.env.VITE_GITHUB_REPO || "asiet-mca.github.io",
      branch: import.meta.env.VITE_GITHUB_BRANCH || "main",
      basePath: import.meta.env.VITE_GITHUB_BASE_PATH || "materials",
    };
  }

  async function verifyAndConnect(config: GitHubConfig) {
    const gh = new GitHubService(config);
    const result = await gh.verify();
    if (!result.ok) {
      setError(
        mode === "passphrase"
          ? "Invalid passphrase, or the access token has expired. Contact the site administrator."
          : result.error || "Connection failed."
      );
      return;
    }
    try {
      await gh.ensureBasePath();
    } catch {}
    onConnect(config);
  }

  async function handlePassphrase(e: React.FormEvent) {
    e.preventDefault();
    if (!passphrase) return;
    setLoading(true);
    setError("");
    try {
      const decrypted = await decryptToken(
        import.meta.env.VITE_ENCRYPTED_TOKEN!,
        passphrase
      );
      await verifyAndConnect(envConfig(decrypted));
    } catch {
      setError("Invalid passphrase. Please try again.");
    }
    setLoading(false);
  }

  async function handleToken(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !owner || !repo) return;
    setLoading(true);
    setError("");
    await verifyAndConnect({ token, owner, repo, branch, basePath });
    setLoading(false);
  }

  const inputClass =
    "w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3 py-2 text-[13px] text-stone-700 placeholder:text-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors";

  return (
    <div className="flex min-h-screen flex-col bg-amber-50/40">
      {/* Top bar */}
      <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[12px] text-stone-500 transition-colors hover:text-stone-700"
          >
            <ArrowLeft size={14} />
            Back to Home
          </button>
          <span className="text-[11px] font-medium uppercase tracking-widest text-amber-700/60">
            Faculty Portal
          </span>
        </div>
      </header>

      {/* Center card */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-white shadow-xl shadow-amber-900/5">
            {/* Gold accent bar */}
            <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

            <div className="px-6 pt-7 pb-8 sm:px-8">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <GithubLogo
                    size={22}
                    weight="fill"
                    className="text-amber-700"
                  />
                </div>
                <div>
                  <h1 className="font-display text-xl font-semibold text-stone-800">
                    Faculty Portal
                  </h1>
                  <p className="text-[12px] text-stone-500">
                    {mode === "passphrase"
                      ? "Enter the admin passphrase to sign in"
                      : "Connect with a GitHub Personal Access Token"}
                  </p>
                </div>
              </div>

              {/* ── Passphrase mode ── */}
              {mode === "passphrase" && (
                <form onSubmit={handlePassphrase} className="mt-6">
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    Admin Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      placeholder="Enter passphrase..."
                      required
                      autoFocus
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? (
                        <EyeSlash size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">
                      <WarningCircle
                        size={15}
                        weight="fill"
                        className="shrink-0"
                      />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !passphrase}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <SpinnerGap size={16} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowUpRight size={14} weight="bold" />
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-[11px] leading-relaxed text-stone-400">
                    Don't have the passphrase? Ask your department administrator.
                  </p>

                  <div className="mt-4 border-t border-stone-100 pt-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("token");
                        setError("");
                      }}
                      className="text-[11px] text-stone-400 transition-colors hover:text-amber-700"
                    >
                      Use personal access token instead
                    </button>
                  </div>
                </form>
              )}

              {/* ── Token mode ── */}
              {mode === "token" && (
                <form onSubmit={handleToken} className="mt-5">
                  {/* Help accordion */}
                  <button
                    type="button"
                    onClick={() => setShowHelp(!showHelp)}
                    className="flex w-full items-center gap-2 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2 text-left text-[12px] text-amber-800 transition-colors hover:bg-amber-50"
                  >
                    <Key size={14} weight="duotone" />
                    <span className="flex-1">
                      How to get a Personal Access Token
                    </span>
                    <CaretRight
                      size={12}
                      className={`transition-transform ${showHelp ? "rotate-90" : ""}`}
                    />
                  </button>

                  {showHelp && (
                    <div className="mt-2 space-y-2 rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-3 text-[12px] text-stone-600">
                      <p className="font-medium text-stone-700">Steps:</p>
                      <ol className="list-decimal space-y-1.5 pl-4">
                        <li>
                          Go to{" "}
                          <a
                            href="https://github.com/settings/tokens?type=beta"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 underline underline-offset-2 hover:text-amber-900"
                          >
                            GitHub Token Settings
                          </a>
                        </li>
                        <li>
                          Click <strong>"Generate new token"</strong>
                        </li>
                        <li>Name it (e.g., "ASIET MCA Admin")</li>
                        <li>
                          Under <strong>Repository access</strong>, select the
                          repository
                        </li>
                        <li>
                          Under <strong>Permissions &rarr; Contents</strong>,
                          choose <strong>Read and write</strong>
                        </li>
                        <li>Generate and copy the token</li>
                      </ol>
                    </div>
                  )}

                  <div className="mt-4 space-y-3.5">
                    {/* Token */}
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
                        Personal Access Token
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          placeholder="github_pat_xxxx..."
                          required
                          className={`${inputClass} pr-10 font-mono`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          {showPassword ? (
                            <EyeSlash size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Owner + Repo */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
                          Owner
                        </label>
                        <input
                          type="text"
                          value={owner}
                          onChange={(e) => setOwner(e.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
                          Repository
                        </label>
                        <input
                          type="text"
                          value={repo}
                          onChange={(e) => setRepo(e.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Branch + Base path */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
                          Branch
                        </label>
                        <input
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
                          Materials Path
                        </label>
                        <input
                          type="text"
                          value={basePath}
                          onChange={(e) => setBasePath(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">
                      <WarningCircle
                        size={15}
                        weight="fill"
                        className="shrink-0"
                      />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <SpinnerGap size={16} className="animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Connect Repository
                        <ArrowUpRight size={14} weight="bold" />
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-[11px] leading-relaxed text-stone-400">
                    Your token is stored locally in this browser only.
                    <br />
                    Never share tokens or use them on shared computers.
                  </p>

                  {hasEncrypted && (
                    <div className="mt-3 border-t border-stone-100 pt-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("passphrase");
                          setError("");
                        }}
                        className="text-[11px] text-stone-400 transition-colors hover:text-amber-700"
                      >
                        &larr; Back to passphrase login
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Create Folder Modal
   ═══════════════════════════════════════════ */

function CreateFolderModal({
  open,
  loading,
  onClose,
  onCreate,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white shadow-2xl animate-modal-in">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3.5">
          <h3 className="font-display text-[15px] font-semibold text-stone-800">
            New Folder
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
          >
            <X size={16} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onCreate(name.trim());
          }}
          className="px-5 py-4"
        >
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
            Folder Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Semester 5"
            className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3 py-2 text-[13px] text-stone-700 placeholder:text-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3.5 py-2 text-[12px] font-medium text-stone-600 transition-colors hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? (
                <SpinnerGap size={14} className="animate-spin" />
              ) : (
                <FolderPlus size={14} />
              )}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Delete Confirm Modal
   ═══════════════════════════════════════════ */

function DeleteModal({
  item,
  loading,
  onClose,
  onConfirm,
}: {
  item: GitHubContent | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white shadow-2xl animate-modal-in">
        <div className="px-5 pt-5 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Trash size={20} weight="duotone" className="text-red-600" />
          </div>
          <h3 className="mt-3 font-display text-[15px] font-semibold text-stone-800">
            Delete {item.type === "dir" ? "Folder" : "File"}?
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-stone-500">
            <strong className="text-stone-700">{item.name}</strong>
            {item.type === "dir"
              ? " and all its contents will be permanently deleted."
              : " will be permanently deleted."}{" "}
            This creates a commit in the repository.
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-stone-100 px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-[12px] font-medium text-stone-600 transition-colors hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <SpinnerGap size={14} className="animate-spin" />
            ) : (
              <Trash size={14} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Settings Modal
   ═══════════════════════════════════════════ */

function SettingsModal({
  open,
  config,
  onClose,
  onSave,
}: {
  open: boolean;
  config: GitHubConfig;
  onClose: () => void;
  onSave: (c: GitHubConfig) => void;
}) {
  const [local, setLocal] = useState(config);

  useEffect(() => {
    if (open) setLocal(config);
  }, [open, config]);

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3 py-2 text-[13px] text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors";

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white shadow-2xl animate-modal-in">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3.5">
          <h3 className="font-display text-[15px] font-semibold text-stone-800">
            Settings
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3 px-5 py-4">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
              Owner
            </label>
            <input
              type="text"
              value={local.owner}
              onChange={(e) => setLocal({ ...local, owner: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
              Repository
            </label>
            <input
              type="text"
              value={local.repo}
              onChange={(e) => setLocal({ ...local, repo: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
                Branch
              </label>
              <input
                type="text"
                value={local.branch}
                onChange={(e) => setLocal({ ...local, branch: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-stone-500">
                Base Path
              </label>
              <input
                type="text"
                value={local.basePath}
                onChange={(e) =>
                  setLocal({ ...local, basePath: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-stone-100 px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-[12px] font-medium text-stone-600 transition-colors hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(local);
              onClose();
            }}
            className="rounded-lg bg-amber-600 px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-amber-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Admin Page
   ═══════════════════════════════════════════ */

export default function Admin() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPath = searchParams.get("path") || "";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  /* ── State ── */
  const [config, setConfig] = useState<GitHubConfig | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [github, setGithub] = useState<GitHubService | null>(null);
  const [contents, setContents] = useState<GitHubContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GitHubContent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState("");

  /* ── Toast helper ── */
  const toast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== id)),
        TOAST_MS
      );
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  /* ── Effects ── */
  useEffect(() => {
    if (config) {
      const gh = new GitHubService(config);
      setGithub(gh);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } else {
      setGithub(null);
    }
  }, [config]);

  useEffect(() => {
    if (github) loadContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [github, currentPath]);

  /* ── Data loading ── */
  async function loadContents() {
    setLoading(true);
    try {
      const items = await github!.list(currentPath);
      setContents(items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load";
      toast(msg, "error");
      setContents([]);
    }
    setLoading(false);
  }

  /* ── Navigation ── */
  function navigateTo(path: string) {
    setSearchParams(path ? { path } : {});
  }

  const breadcrumbs = currentPath
    ? currentPath.split("/").map((seg, i, arr) => ({
        name: seg,
        path: arr.slice(0, i + 1).join("/"),
      }))
    : [];

  /* ── File operations ── */
  async function handleUpload(files: FileList | File[]) {
    if (!github || !files.length) return;
    setUploading(true);
    const arr = Array.from(files);
    let done = 0;
    let failed = 0;

    for (const file of arr) {
      setUploadMsg(`Uploading ${++done}/${arr.length}: ${file.name}`);
      try {
        const base64 = await readFileBase64(file);
        const target = currentPath
          ? `${currentPath}/${file.name}`
          : file.name;
        await github.upload(target, base64);
      } catch (err: unknown) {
        failed++;
        const msg = err instanceof Error ? err.message : "Upload failed";
        toast(`Failed: ${file.name} \u2014 ${msg}`, "error");
      }
    }

    setUploading(false);
    setUploadMsg("");
    const succeeded = arr.length - failed;
    if (succeeded > 0) {
      toast(
        `${succeeded} file${succeeded > 1 ? "s" : ""} uploaded successfully`,
        "success"
      );
    }
    loadContents();
  }

  async function handleCreate(name: string) {
    if (!github) return;
    setCreating(true);
    try {
      const target = currentPath ? `${currentPath}/${name}` : name;
      await github.mkdir(target);
      toast(`Created folder "${name}"`, "success");
      setShowCreate(false);
      loadContents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create";
      toast(msg, "error");
    }
    setCreating(false);
  }

  async function handleDelete() {
    if (!github || !deleteTarget) return;
    setDeleting(true);
    try {
      const rel = deleteTarget.path.startsWith(config!.basePath + "/")
        ? deleteTarget.path.slice(config!.basePath.length + 1)
        : deleteTarget.path;
      if (deleteTarget.type === "dir") {
        await github.rmdir(rel);
      } else {
        await github.delete(rel, deleteTarget.sha);
      }
      toast(`Deleted "${deleteTarget.name}"`, "success");
      setDeleteTarget(null);
      loadContents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast(msg, "error");
    }
    setDeleting(false);
  }

  async function handleSeedStructure() {
    if (!github) return;
    setSeeding(true);
    const paths = buildSeedPaths();
    let done = 0;
    for (const folderPath of paths) {
      done++;
      const parts = folderPath.split("/");
      setSeedProgress(
        `Creating ${parts[0]} / ${(parts[1] ?? "").substring(0, 20)}... (${done}/${paths.length})`
      );
      try {
        await github.mkdir(folderPath, `Set up ${folderPath}`);
      } catch {
        // Folder may already exist, skip
      }
    }
    setSeeding(false);
    setSeedProgress("");
    toast("Course structure created successfully", "success");
    loadContents();
  }

  function handleCopyLink(item: GitHubContent) {
    const url = github!.downloadUrl(item);
    navigator.clipboard.writeText(url);
    toast("Link copied to clipboard", "info");
  }

  function handleDownload(item: GitHubContent) {
    const url = github!.downloadUrl(item);
    window.open(url, "_blank");
  }

  function handleConnect(c: GitHubConfig) {
    setConfig(c);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(null);
    setGithub(null);
    setContents([]);
  }

  /* ── Drag & Drop ── */
  function onDragEnter(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) setDragOver(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragOver(false);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOver(false);
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
  }

  /* ── Render: Auth Gate ── */
  if (!config) {
    return <AuthScreen onConnect={handleConnect} />;
  }

  /* ── Render: File Manager ── */
  return (
    <div
      className="relative flex min-h-screen flex-col bg-amber-50/30"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drag overlay */}
      {dragOver && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-amber-100/80 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-amber-400 bg-white/80 px-12 py-10">
            <CloudArrowUp
              size={48}
              weight="duotone"
              className="text-amber-500"
            />
            <p className="text-[15px] font-medium text-amber-800">
              Drop files to upload
            </p>
            <p className="text-[12px] text-amber-600">
              to{" "}
              <span className="font-mono font-medium">
                /{currentPath || config.basePath}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Upload progress overlay */}
      {uploading && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-xl">
            <SpinnerGap size={20} className="animate-spin text-amber-600" />
            <span className="text-[13px] text-stone-700">{uploadMsg}</span>
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-amber-200/60 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-[12px] text-stone-500 transition-colors hover:text-stone-700"
            >
              <House size={14} weight="duotone" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <div className="h-4 w-px bg-stone-200" />
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100">
                <GithubLogo
                  size={14}
                  weight="fill"
                  className="text-amber-700"
                />
              </div>
              <span className="text-[13px] font-medium text-stone-700">
                Admin
              </span>
              <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 sm:inline">
                {config.owner}/{config.repo}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
              title="Settings"
            >
              <GearSix size={16} />
            </button>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
              title="Disconnect"
            >
              <SignOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
          {/* Breadcrumbs */}
          <nav className="scrollbar-none flex items-center gap-1 overflow-x-auto text-[13px]">
            <button
              onClick={() => navigateTo("")}
              className={`shrink-0 rounded-md px-2 py-1 transition-colors ${
                !currentPath
                  ? "bg-amber-100 font-medium text-amber-800"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
              }`}
            >
              <House
                size={14}
                weight={currentPath ? "regular" : "fill"}
              />
            </button>
            {breadcrumbs.map((b) => (
              <div
                key={b.path}
                className="flex shrink-0 items-center gap-1"
              >
                <CaretRight size={11} className="text-stone-300" />
                <button
                  onClick={() => navigateTo(b.path)}
                  className={`rounded-md px-2 py-1 transition-colors ${
                    b.path === currentPath
                      ? "bg-amber-100 font-medium text-amber-800"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                  }`}
                >
                  {b.name}
                </button>
              </div>
            ))}
          </nav>

          {/* Action bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-[12px] font-medium text-stone-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50"
            >
              <FolderPlus
                size={15}
                weight="duotone"
                className="text-amber-600"
              />
              New Folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-[12px] font-medium text-stone-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50"
            >
              <UploadSimple
                size={15}
                weight="duotone"
                className="text-amber-600"
              />
              Upload Files
            </button>
            <button
              onClick={loadContents}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-[12px] font-medium text-stone-700 shadow-sm transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50"
            >
              <ArrowsClockwise
                size={15}
                className={
                  loading ? "animate-spin text-amber-600" : "text-stone-500"
                }
              />
              Refresh
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Content grid */}
          <div className="mt-5">
            {loading && !contents.length ? (
              /* Loading skeleton */
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl border border-stone-200 bg-stone-100"
                  />
                ))}
              </div>
            ) : contents.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                  <Folder
                    size={32}
                    weight="duotone"
                    className="text-amber-400"
                  />
                </div>
                <p className="mt-4 text-[14px] font-medium text-stone-600">
                  This folder is empty
                </p>
                <p className="mt-1 text-[12px] text-stone-400">
                  {!currentPath
                    ? "Set up the course structure or start adding folders manually"
                    : "Upload files or create a subfolder to get started"}
                </p>

                {/* Seed structure card - only at root */}
                {!currentPath && (
                  <div className="mt-6 w-full max-w-md rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 text-left shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                        <TreeStructure
                          size={18}
                          weight="duotone"
                          className="text-amber-600"
                        />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-stone-700">
                          Set up MCA course structure
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Creates 4 semesters, 20 subjects, 80 material folders
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-stone-500">
                      {CURRICULUM.map((sem) => (
                        <div
                          key={sem.name}
                          className="rounded-md border border-stone-100 bg-white px-2.5 py-1.5"
                        >
                          <span className="font-medium text-stone-700">
                            {sem.name}
                          </span>
                          <span className="ml-1 text-stone-400">
                            &middot; {sem.subjects.length} subjects
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2.5 text-[10px] text-stone-400">
                      Each subject gets: Notes, Assignments, Question Papers &
                      Lab Records folders
                    </p>
                    <button
                      onClick={handleSeedStructure}
                      disabled={seeding}
                      className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-[12px] font-medium text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-60"
                    >
                      {seeding ? (
                        <>
                          <SpinnerGap
                            size={14}
                            className="animate-spin"
                          />
                          {seedProgress}
                        </>
                      ) : (
                        <>
                          <TreeStructure size={14} />
                          Create Course Structure
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-amber-700"
                  >
                    <FolderPlus size={14} />
                    New Folder
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-4 py-2 text-[12px] font-medium text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    <UploadSimple size={14} />
                    Upload
                  </button>
                </div>
              </div>
            ) : (
              /* File/folder grid */
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {contents.map((item) => (
                  <div
                    key={item.sha}
                    className={`group relative rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      item.type === "dir"
                        ? "border-amber-200/60 hover:border-amber-300"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {/* Click target */}
                    <button
                      onClick={() =>
                        item.type === "dir"
                          ? navigateTo(
                              currentPath
                                ? `${currentPath}/${item.name}`
                                : item.name
                            )
                          : handleDownload(item)
                      }
                      className="flex w-full flex-col items-center px-3 pt-4 pb-2 text-center"
                    >
                      {item.type === "dir" ? (
                        <Folder
                          size={32}
                          weight="duotone"
                          className="text-amber-500"
                        />
                      ) : (
                        <FileText
                          size={32}
                          weight="duotone"
                          className={fileColor(item.name)}
                        />
                      )}
                      <span className="mt-2 line-clamp-2 w-full break-all text-[12px] font-medium leading-snug text-stone-700">
                        {item.name}
                      </span>
                      <span className="mt-0.5 text-[10px] text-stone-400">
                        {item.type === "dir" ? "Folder" : fmtSize(item.size)}
                      </span>
                    </button>

                    {/* Hover action buttons */}
                    <div className="absolute right-2 top-2 flex gap-0.5 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                      {item.type === "file" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink(item);
                          }}
                          className="rounded-md border border-stone-200 bg-white p-1 text-stone-400 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600"
                          title="Copy link"
                        >
                          <Copy size={12} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(item);
                        }}
                        className="rounded-md border border-stone-200 bg-white p-1 text-stone-400 shadow-sm transition-colors hover:border-red-200 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload hint at bottom */}
          {!loading && contents.length > 0 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 py-5 text-[12px] text-stone-400 transition-colors hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-700"
            >
              <CloudArrowUp size={18} />
              Drag & drop files here or click to upload
            </button>
          )}
        </div>
      </main>

      {/* Status bar */}
      <footer className="border-t border-amber-200/40 bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
          <span className="text-[11px] text-stone-400">
            {contents.length} item{contents.length !== 1 ? "s" : ""}
            {currentPath && (
              <span className="ml-2 font-mono text-stone-300">
                /{config.basePath}/{currentPath}
              </span>
            )}
          </span>
          <span className="text-[10px] text-stone-300">
            {config.owner}/{config.repo}
          </span>
        </div>
      </footer>

      {/* Modals */}
      <CreateFolderModal
        open={showCreate}
        loading={creating}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
      <DeleteModal
        item={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <SettingsModal
        open={showSettings}
        config={config}
        onClose={() => setShowSettings(false)}
        onSave={(c) => setConfig({ ...c, token: config.token })}
      />

      {/* Toasts */}
      <Toasts items={toasts} onDismiss={dismissToast} />
    </div>
  );
}
