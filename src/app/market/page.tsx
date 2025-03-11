/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import axiosInstance from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Slide as ToastSlide } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import "react-toastify/dist/ReactToastify.css";

export default function MarketPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    async function fetchMarketData() {
      if (!token) return;
      try {
        const res = await axiosInstance.get("/market", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMarketData(res.data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to fetch market data.",
          { position: "top-right", autoClose: 3000, transition: ToastSlide }
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMarketData();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] text-[#252631]">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => router.push("/welcome")}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-4 bg-gradient-to-r shadow bg-white">
          <button
            className="lg:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-black">Market</h1>
          <div>{/* Additional header info can go here */}</div>
        </header>
        <main className="bg-[#E8ECEF] p-8 flex-1 bg-gradient-to-br">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex flex-col space-y-4 p-6 border rounded-xl"
                >
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : marketData.length === 0 ? (
            <p className="text-center mt-8 text-lg">
              No market data available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketData.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-xl shadow-lg text-black bg-[#ffffff]"
                >
                  <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
                  <p className="mb-4">{item.description}</p>
                  <div className="flex justify-between text-lg">
                    <span>Price: ${item.price}</span>
                    <span
                      className={`font-bold ${
                        item.change >= 0 ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {item.change >= 0
                        ? `+${item.change}%`
                        : `${item.change}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={ToastSlide}
      />
    </div>
  );
}
