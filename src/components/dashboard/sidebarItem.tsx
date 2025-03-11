export default function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center px-4 py-2 rounded cursor-pointer mb-2 ${
        active
          ? "bg-[#D71E0E] text-white"
          : "text-[#252631] hover:bg-[#E8ECEF]"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
