import { useEffect, useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { FileSystemNode } from "../data/fileSystem";

const API = "https://api.github.com";
const OWNER = import.meta.env.VITE_GITHUB_OWNER || "asiet-mca";
const REPO = import.meta.env.VITE_GITHUB_REPO || "asiet-mca.github.io";
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || "main";
const BASE_PATH = import.meta.env.VITE_GITHUB_BASE_PATH || "materials";

interface GitHubItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
  download_url: string | null;
}

function encodePath(path: string): string {
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

async function fetchDir(relativePath: string): Promise<GitHubItem[]> {
  const full = relativePath ? `${BASE_PATH}/${relativePath}` : BASE_PATH;
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodePath(full)}?ref=${BRANCH}`;
  const r = await fetch(url);
  if (r.status === 404) return [];
  if (!r.ok) throw new Error(r.statusText);
  const d = await r.json();
  if (!Array.isArray(d)) return [];
  return (d as GitHubItem[])
    .filter((i) => i.name !== ".gitkeep")
    .sort((a, b) =>
      a.type !== b.type
        ? a.type === "dir"
          ? -1
          : 1
        : a.name.localeCompare(b.name)
    );
}

function fmtSize(b: number): string {
  if (!b) return "\u2014";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}`;
}

function toNodes(
  items: GitHubItem[],
  parentExplorerPath: string
): FileSystemNode[] {
  const prefix = parentExplorerPath === "/" ? "" : parentExplorerPath;
  return items.map((item) => ({
    id: item.sha,
    name: item.name,
    type: (item.type === "dir" ? "folder" : "file") as "folder" | "file",
    path: `${prefix}/${item.name}`,
    ...(item.type === "file"
      ? {
          fileType: item.name.split(".").pop()?.toLowerCase(),
          size: fmtSize(item.size),
        }
      : {}),
  }));
}

/* ── Tree helpers ── */

function mergeChildren(
  existing: FileSystemNode[] | undefined,
  incoming: FileSystemNode[]
): FileSystemNode[] {
  if (!existing) return incoming;
  return incoming.map((node) => {
    const prev = existing.find(
      (e) => e.name === node.name && e.type === node.type
    );
    if (prev?.children) {
      return { ...node, children: prev.children };
    }
    return node;
  });
}

function setChildrenAtPath(
  root: FileSystemNode,
  targetPath: string,
  children: FileSystemNode[]
): FileSystemNode {
  if (targetPath === "/") {
    return { ...root, children: mergeChildren(root.children, children) };
  }

  const segments = targetPath.replace(/^\//, "").split("/");

  function walk(node: FileSystemNode, depth: number): FileSystemNode {
    if (depth === segments.length) {
      return { ...node, children: mergeChildren(node.children, children) };
    }
    const seg = segments[depth]!;
    let childArr = node.children || [];

    // Create intermediate node if it doesn't exist yet
    let target = childArr.find(
      (c) => c.name === seg && c.type === "folder"
    );
    if (!target) {
      target = {
        id: `lazy-${segments.slice(0, depth + 1).join("/")}`,
        name: seg,
        type: "folder" as const,
        path: `/${segments.slice(0, depth + 1).join("/")}`,
      };
      childArr = [...childArr, target];
    }

    const updated = childArr.map((child) =>
      child.name === seg && child.type === "folder"
        ? walk(child, depth + 1)
        : child
    );
    return { ...node, children: updated };
  }

  return walk(root, 0);
}

/* ── Hook ── */

export function useGitHubExplorer(currentPath: string) {
  const apiPath = currentPath === "/" ? "" : currentPath.replace(/^\//, "");

  // Always fetch root for the sidebar
  const { data: rootItems } = useQuery({
    queryKey: ["explorer", ""],
    queryFn: () => fetchDir(""),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch current directory (skip if at root — already covered above)
  const { data: pathItems, isLoading: pathLoading } = useQuery({
    queryKey: ["explorer", apiPath],
    queryFn: () => fetchDir(apiPath),
    staleTime: 5 * 60 * 1000,
    enabled: apiPath !== "",
  });

  const isLoading = apiPath === "" ? !rootItems : pathLoading;
  const items = apiPath === "" ? rootItems || [] : pathItems || [];
  const children = useMemo(
    () => toNodes(items, currentPath),
    [items, currentPath]
  );

  // Current node for the grid and content header
  const currentNode = useMemo<FileSystemNode>(
    () => ({
      id: `current-${currentPath}`,
      name: currentPath === "/" ? "ASIET MCA" : currentPath.split("/").pop()!,
      type: "folder",
      path: currentPath,
      children,
    }),
    [currentPath, children]
  );

  // Progressively built tree for the sidebar
  const [tree, setTree] = useState<FileSystemNode>({
    id: "root",
    name: "ASIET MCA",
    type: "folder",
    path: "/",
  });

  // Merge root-level data into tree
  useEffect(() => {
    if (rootItems) {
      setTree((prev) =>
        setChildrenAtPath(prev, "/", toNodes(rootItems, "/"))
      );
    }
  }, [rootItems]);

  // Merge current path data into tree (non-root)
  useEffect(() => {
    if (currentPath !== "/" && pathItems) {
      setTree((prev) =>
        setChildrenAtPath(prev, currentPath, toNodes(pathItems, currentPath))
      );
    }
  }, [pathItems, currentPath]);

  // Download URL builder
  const getDownloadUrl = useCallback((node: FileSystemNode): string => {
    const rel = node.path.replace(/^\//, "");
    return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${BASE_PATH}/${encodePath(rel)}`;
  }, []);

  return { tree, currentNode, isLoading, getDownloadUrl };
}
