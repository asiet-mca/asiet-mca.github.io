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
        "group flex flex-col items-center gap-2 rounded-lg border border-transparent p-4 text-center transition-all duration-100 cursor-pointer select-none",
        "hover:border-border hover:bg-surface hover:shadow-sm active:scale-[0.97]"
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center">
        {isFolder ? (
          <FolderIcon name={item.name} size={32} weight="duotone" />
        ) : (
          <TypeFileIcon name={item.name} size={28} />
        )}
      </div>
      <div className="w-full min-w-0">
        <p className={cn(
          "truncate text-[13px]",
          isFolder ? "font-medium text-text-primary" : "text-text-secondary"
        )}>
          {item.name}
        </p>
        <p className="mt-px text-[11px] text-text-quaternary">
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
        "group flex w-full items-center gap-3 border-b border-border-subtle px-4 py-2.5 text-left transition-colors duration-75 cursor-pointer",
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
        "flex-1 truncate text-[13px]",
        isFolder ? "font-medium text-text-primary" : "text-text-secondary"
      )}>
        {item.name}
      </span>
      {!isFolder && item.modified && (
        <span className="hidden text-[12px] text-text-quaternary sm:block">
          {item.modified}
        </span>
      )}
      {isFolder && (
        <span className="text-[12px] text-text-quaternary">
          {item.children?.length || 0} items
        </span>
      )}
      {!isFolder && item.size && (
        <span className="w-16 text-right text-[12px] text-text-quaternary">
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
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
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
      <div className="mx-4 mt-3 overflow-hidden rounded-lg border border-border bg-surface">
        {/* List header */}
        <div className="flex items-center gap-3 border-b border-border bg-bg px-4 py-2 text-[11px] font-medium tracking-wide text-text-quaternary uppercase">
          <span className="w-5 shrink-0" />
          <span className="flex-1">Name</span>
          <span className="hidden sm:block">Modified</span>
          <span className="w-16 text-right">Size</span>
        </div>
        {sorted.map((item) => (
          <ListRow key={item.id} item={item} onOpen={onOpen} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-px p-3 sm:p-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {sorted.map((item) => (
        <GridCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}
