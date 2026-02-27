import { FolderSimple, FolderOpen } from "@phosphor-icons/react";
import { FolderIcon, TypeFileIcon } from "./FileIcon";
import { cn } from "../lib/utils";

/* ─── Grid View Card ─── */
function GridCard({ item, onOpen }) {
  const isFolder = item.type === "folder";

  return (
    <button
      onClick={() => onOpen(item)}
      className={cn(
        "group flex flex-col items-center gap-1.5 rounded-lg border border-transparent p-2.5 text-center cursor-pointer select-none sm:gap-2 sm:p-4",
        "hover:border-border hover:bg-surface hover:shadow-sm active:scale-[0.97]"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
        <span className="sm:hidden">
          {isFolder ? (
            <FolderIcon name={item.name} size={28} weight="duotone" />
          ) : (
            <TypeFileIcon name={item.name} size={24} />
          )}
        </span>
        <span className="hidden sm:block">
          {isFolder ? (
            <FolderIcon name={item.name} size={32} weight="duotone" />
          ) : (
            <TypeFileIcon name={item.name} size={28} />
          )}
        </span>
      </div>
      <div className="w-full min-w-0">
        <p className={cn(
          "text-[12px] leading-tight sm:truncate sm:text-[13px]",
          isFolder ? "font-medium text-text-primary" : "text-text-secondary",
          // Mobile: allow 2 lines, Desktop: single line truncate
          "line-clamp-2 sm:line-clamp-1"
        )}>
          {item.name}
        </p>
        <p className="mt-0.5 text-[10px] text-text-quaternary sm:text-[11px]">
          {isFolder
            ? `${item.children?.length || 0} items`
            : item.size}
        </p>
      </div>
    </button>
  );
}

/* ─── List View Row ─── */
function ListRow({ item, onOpen }) {
  const isFolder = item.type === "folder";

  return (
    <button
      onClick={() => onOpen(item)}
      className={cn(
        "group flex w-full items-center gap-2.5 border-b border-border-subtle px-3 py-2.5 text-left cursor-pointer sm:gap-3 sm:px-4",
        "hover:bg-hover active:bg-active"
      )}
    >
      <div className="flex w-5 shrink-0 items-center justify-center">
        {isFolder ? (
          <FolderIcon name={item.name} size={18} weight="duotone" />
        ) : (
          <TypeFileIcon name={item.name} size={16} />
        )}
      </div>
      <span className={cn(
        "flex-1 min-w-0 text-[13px]",
        isFolder ? "font-medium text-text-primary" : "text-text-secondary",
        "line-clamp-1"
      )}>
        {item.name}
      </span>
      {!isFolder && item.modified && (
        <span className="hidden text-[12px] text-text-quaternary sm:block">
          {item.modified}
        </span>
      )}
      {isFolder && (
        <span className="shrink-0 text-[11px] text-text-quaternary sm:text-[12px]">
          {item.children?.length || 0} items
        </span>
      )}
      {!isFolder && item.size && (
        <span className="shrink-0 w-14 text-right text-[11px] text-text-quaternary sm:w-16 sm:text-[12px]">
          {item.size}
        </span>
      )}
    </button>
  );
}

/* ─── Main Component ─── */
export default function FileGrid({ items, onOpen, viewMode = "grid" }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 sm:py-24">
        <FolderOpen size={40} weight="duotone" className="text-text-quaternary" />
        <p className="font-display text-sm italic text-text-tertiary">
          No materials in this folder yet
        </p>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  if (viewMode === "list") {
    return (
      <div className="mx-3 mt-2 overflow-hidden rounded-lg border border-border bg-surface sm:mx-4 sm:mt-3">
        {/* List header */}
        <div className="flex items-center gap-2.5 border-b border-border bg-bg px-3 py-2 text-[10px] font-medium tracking-wide text-text-quaternary uppercase sm:gap-3 sm:px-4 sm:text-[11px]">
          <span className="w-5 shrink-0" />
          <span className="flex-1">Name</span>
          <span className="hidden sm:block">Modified</span>
          <span className="w-14 text-right sm:w-16">Size</span>
        </div>
        {sorted.map((item) => (
          <ListRow key={item.id} item={item} onOpen={onOpen} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-px p-2 sm:p-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {sorted.map((item) => (
        <GridCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}
