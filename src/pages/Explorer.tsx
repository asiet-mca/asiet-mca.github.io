import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SpinnerGap } from "@phosphor-icons/react";
import Sidebar from "../components/Sidebar";
import PathBar from "../components/PathBar";
import FileGrid from "../components/FileGrid";
import { useGitHubExplorer } from "../hooks/useGitHubExplorer";
import type { FileSystemNode } from "../data/fileSystem";

export default function Explorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPath = searchParams.get("path") || "/";

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { tree, currentNode, isLoading, getDownloadUrl } =
    useGitHubExplorer(currentPath);

  const navigateTo = useCallback(
    (path: string) => {
      if (path === currentPath) return;
      setSearchParams(path && path !== "/" ? { path } : {});
    },
    [currentPath, setSearchParams]
  );

  const handleOpenItem = useCallback(
    (item: FileSystemNode) => {
      if (item.type === "folder") {
        navigateTo(item.path);
      } else {
        window.open(getDownloadUrl(item), "_blank");
      }
    },
    [navigateTo, getDownloadUrl]
  );

  const folderCount =
    currentNode?.children?.filter((c) => c.type === "folder").length || 0;
  const fileCount =
    currentNode?.children?.filter((c) => c.type === "file").length || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar: hidden on mobile, visible on desktop */}
      <div className="hidden md:flex">
        <Sidebar
          tree={tree}
          currentPath={currentPath}
          onNavigate={navigateTo}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={false}
          onMobileClose={() => {}}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <div className="md:hidden">
        <Sidebar
          tree={tree}
          currentPath={currentPath}
          onNavigate={navigateTo}
          collapsed={false}
          onToggle={() => {}}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <PathBar
          currentPath={currentPath}
          onNavigate={navigateTo}
          canGoBack={window.history.length > 1}
          canGoForward={false}
          onBack={() => window.history.back()}
          onForward={() => {}}
          viewMode={viewMode}
          onToggleView={setViewMode}
          onMenuToggle={() => setMobileOpen(true)}
        />

        {/* Content header */}
        {currentNode && currentPath !== "/" && !isLoading && (
          <div className="flex items-baseline gap-2 bg-bg px-3 pt-3 pb-1.5 sm:gap-3 sm:px-5 sm:pt-4 sm:pb-2">
            <h2 className="font-display text-base font-semibold text-text-primary sm:text-lg">
              {currentNode.name}
            </h2>
            <span className="text-[12px] text-text-quaternary">
              {folderCount > 0 &&
                `${folderCount} folder${folderCount !== 1 ? "s" : ""}`}
              {folderCount > 0 && fileCount > 0 && ", "}
              {fileCount > 0 &&
                `${fileCount} file${fileCount !== 1 ? "s" : ""}`}
            </span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto" key={currentPath}>
          {isLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
              <SpinnerGap
                size={24}
                className="animate-spin text-text-quaternary"
              />
              <p className="text-[13px] text-text-tertiary">
                Loading materials...
              </p>
            </div>
          ) : (
            <FileGrid
              items={currentNode?.children || []}
              onOpen={handleOpenItem}
              viewMode={viewMode}
            />
          )}
        </main>

        {/* Status bar — hidden on mobile */}
        <div className="hidden h-7 shrink-0 items-center justify-between border-t border-border bg-surface px-4 font-mono text-[11px] text-text-quaternary sm:flex">
          <span>{currentNode?.children?.length || 0} items</span>
          <span className="ml-2 truncate">{currentPath}</span>
        </div>
      </div>
    </div>
  );
}
