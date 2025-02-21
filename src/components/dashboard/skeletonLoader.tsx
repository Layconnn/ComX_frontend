export default function SkeletonLoader() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFB] p-4 animate-pulse">
      <header className="flex items-center justify-between bg-white shadow px-4 py-4 mb-4">
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
        <div className="w-32 h-6 bg-gray-300 rounded"></div>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-64 bg-gray-300 p-4 mr-4">
          <div className="h-16 bg-gray-400 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-400 rounded"></div>
            <div className="h-6 bg-gray-400 rounded"></div>
            <div className="h-6 bg-gray-400 rounded"></div>
            <div className="h-6 bg-gray-400 rounded"></div>
          </div>
        </aside>
        <main className="flex-1 space-y-4">
          <div className="p-4 bg-white shadow rounded-lg">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
