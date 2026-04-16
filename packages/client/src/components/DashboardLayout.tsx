import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Menu,
  ClipboardCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Employees", path: "/employees", icon: Users },
  { name: "Departments", path: "/departments", icon: Building2 },
  { name: "Leave Requests", path: "/leaves", icon: Calendar },
  { name: "Attendance", path: "/attendance", icon: ClipboardCheck },
];

export default function DashboardLayout() {
  const { signOut } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsMobile(true);
        setCollapsed(true); // collapsed by default on mobile
      } else {
        setIsMobile(false);
        setCollapsed(false);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Overlay backdrop for mobile */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        flex flex-col h-screen fixed top-0 z-50 bg-white border-r
        transition-all duration-300
        ${collapsed ? "w-15" : "w-50"}
      `}
      >
        <div className="flex p-3 gap-3 h-16 items-center border-b-2">
          <div
            className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu />
          </div>

          {!collapsed && (
            <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
              Admin
            </h1>
          )}
        </div>

        <nav className="space-y-1 p-2 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex gap-2 items-center rounded-lg px-3 py-2 font-semibold text-sm ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon size={24} />
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="p-3">
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2 rounded-md bg-red-500 hover:bg-red-700 text-white"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-auto p-3 flex gap-3 h-16 items-center border-t-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">admin@gmail.com</p>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        className={`w-full
        transition-all duration-300
        ${isMobile ? "ml-15" : collapsed ? "ml-15" : "ml-50"}
      `}
      >
        {/* Your main content here */}
        <Outlet />
      </div>
    </div>
  );
}
