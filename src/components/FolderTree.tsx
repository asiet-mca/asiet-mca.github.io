import { useState, useEffect } from "react";
import { CaretRight, CaretDown } from "@phosphor-icons/react";
import { FolderIcon } from "./FileIcon";
import { cn } from "../lib/utils";
import type { FileSystemNode } from "../data/fileSystem";

interface TreeNodeProps {
  node: FileSystemNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  depth?: number;
}

function TreeNode({ node, currentPath, onNavigate, depth = 0 }: TreeNodeProps) {
  const isActive = currentPath === node.path;
  const isAncestor = currentPath.startsWith(node.path + "/");
  const [expanded, setExpanded] = useState(isAncestor);

  useEffect(() => {
    if (isAncestor && !expanded) setExpanded(true);
  }, [currentPath]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show expand arrow for folders with sub-folders, or folders not yet loaded
  const hasChildren = !node.children || node.children.some((c) => c.type === "folder");
  const folderChildren = node.children?.filter((c) => c.type === "folder") || [];

  const handleClick = () => {
    onNavigate(node.path);
    if (hasChildren) setExpanded(!expanded);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "group relative flex w-full items-center gap-1.5 py-[5px] pr-2 text-left text-[13px] transition-colors cursor-pointer",
          isActive
            ? "bg-accent-muted text-accent font-medium"
            : "text-text-secondary hover:bg-hover active:bg-active"
        )}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span className="absolute left-0 top-1 bottom-1 w-[2px] rounded-r bg-accent" />
        )}

        {hasChildren ? (
          <span className="flex w-4 shrink-0 items-center justify-center">
            {expanded ? (
              <CaretDown size={12} weight="bold" className="text-text-tertiary" />
            ) : (
              <CaretRight size={12} weight="bold" className="text-text-tertiary" />
            )}
          </span>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        <FolderIcon name={node.name} size={15} weight={isActive ? "duotone" : "regular"} />
        <span className="truncate">{node.name}</span>
      </button>

      {expanded && folderChildren.length > 0 && (
        <div>
          {folderChildren.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              currentPath={currentPath}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  tree: FileSystemNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function FolderTree({ tree, currentPath, onNavigate }: FolderTreeProps) {
  return (
    <nav className="py-1">
      {tree.children
        ?.filter((c) => c.type === "folder")
        .map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            currentPath={currentPath}
            onNavigate={onNavigate}
            depth={0}
          />
        ))}
    </nav>
  );
}
