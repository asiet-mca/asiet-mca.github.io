import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { getFolderTree } from "./data/fileSystem";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const tree = getFolderTree();

  return (
    <div className="min-h-screen flex flex-col">

      {/* Sidebar */}
      <Sidebar
        tree={tree}
        currentPath="/"
        onNavigate={(path) => console.log("Navigate to", path)}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}