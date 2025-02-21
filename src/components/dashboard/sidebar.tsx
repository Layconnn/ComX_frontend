/* eslint-disable @next/next/no-img-element */
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
  return (
    <aside
      className={`fixed top-0 left-0 w-64 bg-white shadow-lg min-h-screen transition-transform duration-300 z-50 
      ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:static lg:translate-x-0`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="h-16 flex items-center justify-center border-b">
            <img src="/logo.svg" alt="ComX Logo" className="h-8" />
          </div>
          <nav className="py-4 px-2">
            <SidebarItem icon="🏠" label="Dashboard" active />
            <SidebarItem icon="📈" label="Market" />
            <SidebarItem icon="💼" label="Portfolio" />
            <SidebarItem icon="⚙️" label="Settings" />
          </nav>
        </div>
        {/* Logout Button at the absolute bottom */}
        <div className="px-4 pb-4">
          <button
            onClick={onLogout}
            className="absolute bottom-0 left-0 w-full px-4 py-4 flex items-center text-sm font-medium text-[#252631] hover:text-white hover:bg-[#D71E0E] rounded "
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </div>
      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 lg:hidden"
        onClick={toggleSidebar}
      >
        ✕
      </button>
    </aside>
  );
}
