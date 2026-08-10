import { useLocation, Link } from "react-router-dom";
import { House, GraduationCap, BookOpenText } from "@phosphor-icons/react";

export default function BottomNav() {
  const location = useLocation();

  const items = [
    { name: "Home", icon: House, path: "/" },
    { name: "Entrance", icon: GraduationCap, path: "/entrance" },
    { name: "Study Materials", icon: BookOpenText, path: "/explorer" },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t shadow-md md:hidden z-50">
      <div className="flex justify-around py-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <item.icon
                size={22}
                weight={isActive ? "fill" : "duotone"}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}