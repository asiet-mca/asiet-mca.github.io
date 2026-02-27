import {
  CaretRight,
  ArrowLeft,
  ArrowRight,
  House,
  List,
  SquaresFour,
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
}) {
  const crumbs = getBreadcrumbs(currentPath);

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-surface px-3">
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

      {/* Breadcrumb bar */}
      <div className="flex flex-1 items-center gap-px rounded border border-border bg-bg px-2 py-[5px] font-mono text-[12.5px]">
        <button
          onClick={() => onNavigate("/")}
          className="flex items-center rounded px-1 text-text-tertiary transition-colors cursor-pointer hover:bg-hover hover:text-accent"
        >
          <House size={13} weight="bold" />
        </button>
        {crumbs.slice(1).map((crumb, i) => (
          <span key={crumb.path} className="flex items-center">
            <CaretRight size={10} className="mx-0.5 text-text-quaternary" />
            <button
              onClick={() => onNavigate(crumb.path)}
              className={cn(
                "rounded px-1 py-px transition-colors cursor-pointer hover:bg-hover hover:text-accent",
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
      <div className="flex items-center rounded border border-border">
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
