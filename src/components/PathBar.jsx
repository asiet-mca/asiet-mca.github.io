import {
  CaretRight,
  ArrowLeft,
  ArrowRight,
  House,
  List,
  SquaresFour,
  SidebarSimple,
} from "@phosphor-icons/react";
import { getBreadcrumbs } from "../data/fileSystem";
import { cn } from "../lib/utils";

export default function PathBar({
  currentPath,
  onNavigate,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  viewMode,
  onToggleView,
  onMenuToggle,
}) {
  const crumbs = getBreadcrumbs(currentPath);

  return (
    <div className="flex h-12 shrink-0 items-center gap-1.5 border-b border-border bg-surface px-2 sm:gap-2 sm:px-3">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-text-secondary transition-colors cursor-pointer hover:bg-hover md:hidden"
      >
        <SidebarSimple size={16} weight="regular" />
      </button>

      {/* Navigation buttons */}
      <div className="flex items-center">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded transition-colors",
            canGoBack
              ? "cursor-pointer text-text-secondary hover:bg-hover hover:text-text-primary active:bg-active"
              : "cursor-not-allowed text-text-quaternary"
          )}
        >
          <ArrowLeft size={15} weight="bold" />
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded transition-colors",
            canGoForward
              ? "cursor-pointer text-text-secondary hover:bg-hover hover:text-text-primary active:bg-active"
              : "cursor-not-allowed text-text-quaternary"
          )}
        >
          <ArrowRight size={15} weight="bold" />
        </button>
      </div>

      {/* Breadcrumb bar — horizontally scrollable on mobile */}
      <div className="flex min-w-0 flex-1 items-center gap-px overflow-x-auto rounded border border-border bg-bg px-2 py-[5px] font-mono text-[12.5px] scrollbar-none">
        <button
          onClick={() => onNavigate("/")}
          className="flex shrink-0 items-center rounded px-1 text-text-tertiary transition-colors cursor-pointer hover:bg-hover hover:text-accent"
        >
          <House size={13} weight="bold" />
        </button>
        {crumbs.slice(1).map((crumb, i) => (
          <span key={crumb.path} className="flex shrink-0 items-center">
            <CaretRight size={10} className="mx-0.5 text-text-quaternary" />
            <button
              onClick={() => onNavigate(crumb.path)}
              className={cn(
                "whitespace-nowrap rounded px-1 py-px transition-colors cursor-pointer hover:bg-hover hover:text-accent",
                i === crumbs.length - 2
                  ? "text-text-primary"
                  : "text-text-tertiary"
              )}
            >
              {crumb.name}
            </button>
          </span>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex shrink-0 items-center rounded border border-border">
        <button
          onClick={() => onToggleView("grid")}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-l transition-colors cursor-pointer",
            viewMode === "grid"
              ? "bg-active text-text-primary"
              : "text-text-tertiary hover:text-text-secondary hover:bg-hover"
          )}
        >
          <SquaresFour size={15} weight={viewMode === "grid" ? "fill" : "regular"} />
        </button>
        <button
          onClick={() => onToggleView("list")}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-r border-l border-border transition-colors cursor-pointer",
            viewMode === "list"
              ? "bg-active text-text-primary"
              : "text-text-tertiary hover:text-text-secondary hover:bg-hover"
          )}
        >
          <List size={15} weight={viewMode === "list" ? "bold" : "regular"} />
        </button>
      </div>
    </div>
  );
}
