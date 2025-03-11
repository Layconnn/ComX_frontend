/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axiosInstance";
import Sidebar from "@/components/dashboard/sidebar";
import { ToastContainer, toast, Slide as ToastSlide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function SettingsPage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState({
    fullName: "",
    email: "",
    phone: "",
    theme: "light",
    businessType: "",
    dateOfIncorporation: "",
  });
  const [isCorporate, setIsCorporate] = useState<boolean>(false);

  // Fetch current settings on mount
  useEffect(() => {
    async function fetchSettings() {
      if (!token) {
        router.push("/welcome");
        return;
      }
      try {
        const res = await axiosInstance.get("/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setSettings({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          theme: data.theme || "light",
          businessType: data.businessType || "",
          dateOfIncorporation: data.dateOfIncorporation || "",
        });
        // If corporate-specific fields exist, assume user is corporate
        setIsCorporate(!!data.businessType || !!data.dateOfIncorporation);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to fetch settings.",
          { position: "top-right", autoClose: 3000, transition: ToastSlide }
        );
      }
    }
    fetchSettings();
  }, [token, router]);

  // Update form state on change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  // Submit form to update settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push("/welcome");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.put("/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Settings updated successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Update failed.",
        { position: "top-right", autoClose: 2000, transition: ToastSlide }
      );
    } finally {
      setLoading(false);
    }
  };

  // Logout handler: you may also dispatch an action to clear auth state
  const handleLogout = () => {
    router.push("/welcome");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] text-[#252631]">
      {/* Sidebar */}
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 bg-gradient-to-r text-white shadow">
          <button
            className="lg:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-black">Settings</h1>
          <div>{/* Additional header items can go here */}</div>
        </header>
        {/* Main Content */}
        <main className="bg-[#E8ECEF] p-8 flex-1 bg-gradient-to-br text-white">
          <form
            onSubmit={handleSave}
            className="max-w-xl bg-white p-8 rounded-2xl shadow-2xl mx-auto text-black"
          >
            <h2 className="text-4xl font-bold mb-6">Account Settings</h2>
            {/* Full Name / Company Name Field */}
            <div className="mb-6">
              <label
                htmlFor="fullName"
                className="block text-lg font-semibold mb-2"
              >
                {isCorporate ? "Company Name" : "Full Name"}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={settings.fullName}
                onChange={handleChange}
                placeholder={
                  isCorporate
                    ? "Enter company name"
                    : "Enter your full name"
                }
                className="w-full p-3 rounded-lg border border-black focus:outline-none focus:border-white placeholder-white bg-white bg-opacity-30 text-[#252631]"
                required
              />
            </div>
            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-lg font-semibold mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg border border-black focus:outline-none focus:border-white placeholder-white bg-white bg-opacity-30 text-[#252631]"
                required
              />
            </div>
            {/* Individual-specific: Phone */}
            {!isCorporate && (
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-lg font-semibold mb-2"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={settings.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full p-3 rounded-lg border border-black focus:outline-none focus:border-white placeholder-white bg-white bg-opacity-30 text-[#252631]"
                  required
                />
              </div>
            )}
            {/* Corporate-specific: Business Type and Date of Incorporation */}
            {isCorporate && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="businessType"
                    className="block text-lg font-semibold mb-2"
                  >
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={settings.businessType}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-black focus:outline-none focus:border-white bg-white bg-opacity-30 text-[#252631]"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="RETAIL">RETAIL</option>
                    <option value="SERVICE">SERVICE</option>
                    <option value="MANUFACTURING">MANUFACTURING</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="dateOfIncorporation"
                    className="block text-lg font-semibold mb-2"
                  >
                    Date of Incorporation
                  </label>
                  <input
                    id="dateOfIncorporation"
                    name="dateOfIncorporation"
                    type="date"
                    value={settings.dateOfIncorporation}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-black focus:outline-none focus:border-white bg-white bg-opacity-30 text-[#252631]"
                    required
                  />
                </div>
              </>
            )}
            {/* Theme Field */}
            <div className="mb-6">
              <label
                htmlFor="theme"
                className="block text-lg font-semibold mb-2"
              >
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-black focus:outline-none focus:border-white bg-white bg-opacity-30 text-[#252631]"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#D71E0E] text-white font-extrabold shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Save Settings"
              )}
            </button>
          </form>
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        transition={ToastSlide}
      />
    </div>
  );
}
