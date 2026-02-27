import { useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import PathBar from "../components/PathBar";
import FileGrid from "../components/FileGrid";
import { fileSystem, findNodeByPath } from "../data/fileSystem";

export default function Explorer() {
  const [currentPath, setCurrentPath] = useState("/");
  const [history, setHistory] = useState(["/"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const currentNode = findNodeByPath(currentPath);

  const navigateTo = useCallback(
    (path) => {
      if (path === currentPath) return;
      const newHistory = [...history.slice(0, historyIndex + 1), path];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentPath(path);
    },
    [currentPath, history, historyIndex]
  );

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleOpenItem = useCallback(
    (item) => {
      if (item.type === "folder") {
        navigateTo(item.path);
      }
    },
    [navigateTo]
  );

  const folderCount = currentNode?.children?.filter((c) => c.type === "folder").length || 0;
  const fileCount = currentNode?.children?.filter((c) => c.type === "file").length || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar: hidden on mobile, visible on desktop */}
      <div className="hidden md:flex">
        <Sidebar
          tree={fileSystem}
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
          tree={fileSystem}
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
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < history.length - 1}
          onBack={goBack}
          onForward={goForward}
          viewMode={viewMode}
          onToggleView={setViewMode}
          onMenuToggle={() => setMobileOpen(true)}
        />

        {/* Content header */}
        {currentNode && currentPath !== "/" && (
          <div className="flex items-baseline gap-2 bg-bg px-3 pt-3 pb-1.5 sm:gap-3 sm:px-5 sm:pt-4 sm:pb-2">
            <h2 className="font-display text-base font-semibold text-text-primary sm:text-lg">
              {currentNode.name}
            </h2>
            <span className="text-[12px] text-text-quaternary">
              {folderCount > 0 && `${folderCount} folder${folderCount !== 1 ? "s" : ""}`}
              {folderCount > 0 && fileCount > 0 && ", "}
              {fileCount > 0 && `${fileCount} file${fileCount !== 1 ? "s" : ""}`}
            </span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <FileGrid
            items={currentNode?.children || []}
            onOpen={handleOpenItem}
            viewMode={viewMode}
          />
        </main>

        {/* Status bar — hidden on mobile */}
        <div className="hidden h-7 shrink-0 items-center justify-between border-t border-border bg-surface px-4 font-mono text-[11px] text-text-quaternary sm:flex">
          <span>{(currentNode?.children?.length || 0)} items</span>
          <span className="truncate ml-2">{currentPath}</span>
        </div>
      </div>
    </div>
  );
}
