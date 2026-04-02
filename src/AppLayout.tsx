import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav";

export default function AppLayout() {
  return (
    <>
      <main className="flex-1 pb-16 md:pb-0">
  <Outlet />
</main>
      <BottomNav />
    </>
  );
}