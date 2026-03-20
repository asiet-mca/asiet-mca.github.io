import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FolderSimple,
  House,
  MagnifyingGlass,
} from "@phosphor-icons/react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
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
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-accent-light sm:px-3.5 sm:text-[12px]"
          >
            <House size={13} weight="duotone" />
            Home
          </button>
        </div>
      </header>

      {/* ─── 404 Content ─── */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <div className="font-mono text-[64px] font-bold leading-none text-border sm:text-[96px]">
            404
          </div>
          <h1 className="mt-3 font-display text-[18px] font-medium text-text-primary sm:text-[22px]">
            Page not found
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-[13px] text-text-tertiary sm:text-[14px]">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-accent-light sm:text-[13px]"
            >
              <House size={14} weight="duotone" />
              Go Home
              <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate("/explorer")}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-[12px] font-medium text-text-secondary transition-colors hover:bg-hover sm:text-[13px]"
            >
              <FolderSimple size={14} weight="duotone" />
              File Explorer
            </button>
            <button
              onClick={() => navigate("/entrance")}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-[12px] font-medium text-text-secondary transition-colors hover:bg-hover sm:text-[13px]"
            >
              <MagnifyingGlass size={14} weight="duotone" />
              Entrance Prep
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
