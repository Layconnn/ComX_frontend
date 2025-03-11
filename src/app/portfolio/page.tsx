/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import axiosInstance from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ToastContainer, toast, Slide as ToastSlide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import CreateInvestmentModal from "@/components/portfolio/createInvestmentModal";
import EditInvestmentModal from "@/components/portfolio/editInvestmentModal";

export default function PortfolioPage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);

  async function refreshPortfolio() {
    if (!token) {
      router.push("/welcome");
      return;
    }
    try {
      const res = await axiosInstance.get("/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(res.data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // If no portfolio exists, initialize as empty
        setPortfolio({ totalValue: 0, todayChange: 0, investments: [] });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch portfolio.",
          { position: "top-right", autoClose: 3000, transition: ToastSlide }
        );
      }
    }
  }

  useEffect(() => {
    async function fetchPortfolio() {
      await refreshPortfolio();
      setLoading(false);
    }
    fetchPortfolio();
  }, [token, router]);

  const handleAddInvestment = async (newInvestment: { name: string; quantity: number; value: number }) => {
    try {
      await axiosInstance.post("/portfolio/investments", newInvestment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Investment added successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
      refreshPortfolio();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add investment.",
        { position: "top-right", autoClose: 2000, transition: ToastSlide }
      );
    } finally {
      setCreateModalOpen(false);
    }
  };

  const handleUpdateInvestment = async (updatedInvestment: { id: number; name: string; quantity: number; value: number }) => {
    try {
      await axiosInstance.put(`/portfolio/investments/${updatedInvestment.id}`, updatedInvestment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Investment updated successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
      refreshPortfolio();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update investment.",
        { position: "top-right", autoClose: 2000, transition: ToastSlide }
      );
    } finally {
      setEditModalOpen(false);
      setSelectedInvestment(null);
    }
  };

  const handleDeleteInvestment = async (id: number) => {
    try {
      await axiosInstance.delete(`/portfolio/investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Investment deleted successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
      refreshPortfolio();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete investment.",
        { position: "top-right", autoClose: 2000, transition: ToastSlide }
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-[#D71E0E]">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => router.push("/welcome")}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#000000] bg-opacity-80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col">
        <header
          className="h-16 flex items-center justify-between px-4 shadow bg-white text-black"
        >
          <button className="lg:hidden text-xl" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h1 className="text-xl font-bold">Portfolio</h1>
          <div>{/* Additional header info can go here */}</div>
        </header>
        <main className="p-8 flex-1 bg-[#E8ECEF] text-[#D71E0E]">
          {loading ? (
            // Skeleton loader: Overview skeleton + investments skeleton
            <div className="space-y-6">
              <div className="animate-pulse flex flex-col space-y-4 p-6 border rounded-xl bg-white">
                <div className="h-6 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex flex-col space-y-4 p-6 border rounded-xl bg-white"
                  >
                    <div className="h-6 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : portfolio ? (
            <div className="space-y-6">
              <div
                className="p-6 rounded-xl shadow-lg text-black bg-white"
              >
                <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                <p>
                  Total Value: <span className="font-bold">${portfolio.totalValue}</span>
                </p>
                <p className="mt-2">
                  Today&apos;s Change:{" "}
                  <span className="font-bold">
                    {portfolio.todayChange >= 0
                      ? `+${portfolio.todayChange}%`
                      : `${portfolio.todayChange}%`}
                  </span>
                </p>
              </div>
              <div className="mb-6 text-black">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Investments</h2>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-4 py-2 rounded shadow flex items-center gap-2 transition-colors duration-200 bg-[#D71E0E] text-white"
                  >
                    <FiPlus size={20} /> Add Investment
                  </button>
                </div>
                {portfolio.investments.length === 0 ? (
                  <p className="text-center text-lg">No investments found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolio.investments.map((inv: any) => (
                      <div
                        key={inv.id}
                        className="p-6 rounded-xl shadow-lg bg-white"
                      >
                        <h3 className="text-xl font-semibold mb-2">{inv.name}</h3>
                        <p className="mb-2">Quantity: {inv.quantity}</p>
                        <p className="mb-4">Value: ${inv.value}</p>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedInvestment(inv);
                              setEditModalOpen(true);
                            }}
                            className="hover:text-[#000000] text-[#D71E0E]"
                          >
                            <FiEdit size={20} className="cursor-pointer text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvestment(inv.id)}
                            className="hover:text-[#000000] text-[#D71E0E]"
                          >
                            <FiTrash2 size={20} className="cursor-pointer" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center mt-8 text-lg text-black">No portfolio data available.</p>
          )}
        </main>
      </div>
      <EditInvestmentModal
        isOpen={editModalOpen}
        investment={selectedInvestment}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedInvestment(null);
        }}
        onSave={handleUpdateInvestment}
      />
      <CreateInvestmentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleAddInvestment}
      />
      <ToastContainer position="top-right" autoClose={3000} transition={ToastSlide} />
    </div>
  );
}
