import { SidebarSimple, X } from "@phosphor-icons/react";
import FolderTree from "./FolderTree";
import { cn } from "../lib/utils";

export default function Sidebar({ tree, currentPath, onNavigate, collapsed, onToggle, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Mobile: fixed overlay that slides in
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-transform duration-200 md:relative md:z-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: normal collapsible sidebar
          collapsed ? "md:w-11" : "w-64 md:w-60"
        )}
      >
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logos/asiet-logo.png"
                alt="ASIET"
                className="h-6 w-auto"
              />
              <div className="h-3.5 w-px bg-border" />
              <span className="text-[11px] font-medium tracking-wide text-accent uppercase">
                MCA
              </span>
            </div>
          )}
          {/* Desktop: collapse toggle */}
          <button
            onClick={onToggle}
            className="hidden h-7 w-7 items-center justify-center rounded text-text-tertiary transition-colors cursor-pointer hover:bg-hover hover:text-text-secondary md:flex"
          >
            <SidebarSimple size={16} weight="regular" />
          </button>
          {/* Mobile: close button */}
          <button
            onClick={onMobileClose}
            className="flex h-7 w-7 items-center justify-center rounded text-text-tertiary transition-colors cursor-pointer hover:bg-hover hover:text-text-secondary md:hidden"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <span className="text-[11px] font-medium tracking-wide text-text-quaternary uppercase">
              Semesters
            </span>
          </div>
        )}

        {/* Tree */}
        {!collapsed && (
          <div className="flex-1 overflow-y-auto">
            <FolderTree
              tree={tree}
              currentPath={currentPath}
              onNavigate={(path) => {
                onNavigate(path);
                onMobileClose();
              }}
            />
          </div>
        )}
      </aside>
    </>
  );
}
