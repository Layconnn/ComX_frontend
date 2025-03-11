/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarItem from "./sidebarItem";

export default function Sidebar({
  sidebarOpen,
  toggleSidebar,
  onLogout,
}: {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 w-64 bg-white shadow-lg min-h-screen transition-transform duration-300 z-50 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="h-16 flex items-center justify-center border-b">
            <img src="/logo.svg" alt="ComX Logo" className="h-8" />
          </div>
          <nav className="py-4 px-2">
            <Link href="/dashboard">
              <SidebarItem
                icon="🏠"
                label="Dashboard"
                active={pathname === "/dashboard"}
              />
            </Link>
            <Link href="/market">
              <SidebarItem
                icon="📈"
                label="Market"
                active={pathname === "/market"}
              />
            </Link>
            <Link href="/portfolio">
              <SidebarItem
                icon="💼"
                label="Portfolio"
                active={pathname === "/portfolio"}
              />
            </Link>
            <Link href="/items">
              <SidebarItem
                icon="📦"
                label="Items"
                active={pathname === "/items"}
              />
            </Link>
            <Link href="/settings">
              <SidebarItem
                icon="⚙️"
                label="Settings"
                active={pathname === "/settings"}
              />
            </Link>
          </nav>
        </div>
        <div className="px-4 pb-4 relative">
          <button
            onClick={onLogout}
            className="absolute bottom-0 left-0 w-full px-4 py-4 flex items-center text-sm font-medium text-[#252631] hover:text-white hover:bg-[#D71E0E] rounded"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </div>
      <button
        className="absolute top-4 right-4 lg:hidden"
        onClick={toggleSidebar}
      >
        ✕
      </button>
    </aside>
  );
}
