import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { House, GraduationCapIcon, BookOpenIcon } from "@phosphor-icons/react";

export default function BottomNav() {
    const [active,setActive] = useState("home");
    const navigate = useNavigate();

    const items=[
        { name: "home", icon: <House size={24} />, path: "/" },
        { name: "entrance", icon: <GraduationCapIcon size={24} />, path: "/entrance" },
        { name: "study materials", icon: <BookOpenIcon size={24} />, path: "/explorer" },
    ];
      return (
    <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around">
      {items.map(item => (
        <button
          key={item.name}
          onClick={() => { setActive(item.name); navigate(item.path); }}
          className={`flex flex-col items-center py-2 ${active === item.name ? "text-blue-600" : "text-gray-600"}`}
        >
          {item.icon}
          <span className="text-xs">{item.name}</span>
        </button>
      ))}
    </nav>
  );
}
