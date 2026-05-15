import { useAuthStore } from "@/stores/useAuthStore";
import { Calendar, Calendar1, Menu, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { name: "Shifts", path: "/emp", icon: Calendar },
  { name: "Profile", path: "/emp/profile", icon: User },
  { name: "Leaves", path: "/emp/leave", icon: Calendar1 },
];

export default function TopBarLayout() {
  const { user } = useAuthStore();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutsideMenu(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  });
  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="relative flex items-center gap-4 h-16 px-3 sm:px-6 lg:px-8">
          {/* Mobile Menu */}
          <div ref={menuRef} className="flex items-center sm:hidden">
            <button
              className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              <Menu />
            </button>
            {openMenu && (
              <div className="absolute top-full w-30 text-sm border-2 rounded-sm bg-white">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/emp"}
                    className={({ isActive }) =>
                      `flex gap-2 items-center px-3 py-2 font-semibold text-sm ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-xl font-semibold text-gray-900">
            Welcome back, {user?.first_name}
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/emp"}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 ${
                    isActive
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`
                }
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-3 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
