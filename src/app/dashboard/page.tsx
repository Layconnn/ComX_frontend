/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import Sidebar from "@/components/dashboard/sidebar";
import TableHeader from "@/components/dashboard/tableHeader";
import TableRows from "@/components/dashboard/tableRows";
// import SkeletonLoader from "@/components/dashboard/skeletonLoader";
import { FadeLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Slide as ToastSlide } from "react-toastify";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

  const userName = user?.companyName || user?.firstName || "User";

  useEffect(() => {
    toast.success(`Welcome, ${userName}!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  }, [!loading && user]);

  if (loading) {
    return <div className="flex items-center justify-center mx-auto min-h-screen">
      <FadeLoader />
      </div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/welcome");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] text-[#252631]">
      <button
        className="lg:hidden absolute top-4 left-4 z-50 text-2xl"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col w-full">
        <header className="h-16 flex items-center justify-between bg-white shadow px-4">
          <button
            className="lg:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="font-medium">Balance: $12,340</span>
              <span className="text-sm text-gray-500">Equity: $14,500</span>
            </div>
            <img
              src="/avatar.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </header>
        <div className="p-4 flex flex-wrap gap-4 bg-white shadow-sm">
          <button className="bg-[#D71E0E] text-white px-4 py-2 rounded">
            BUY
          </button>
          <button className="bg-black text-white px-4 py-2 rounded">
            SELL
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span>Last Price:</span>
            <span className="font-medium text-[#D71E0E]">12.345</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>24h Change:</span>
            <span className="font-medium text-green-600">+1.23%</span>
          </div>
        </div>
        <main className="m-4 w-auto overflow-x-auto no-scrollbar">
          <div className="bg-white shadow rounded-lg p-4 min-w-[736px] border">
            <TableHeader />
            <hr className="my-2" />
            <TableRows />
          </div>
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={ToastSlide}
      />
    </div>
  );
}
