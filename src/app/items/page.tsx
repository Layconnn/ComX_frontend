/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import axiosInstance from "@/api/axiosInstance";
import Sidebar from "@/components/dashboard/sidebar";
import { ToastContainer, toast, Slide as ToastSlide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSearch, FiTrash2, FiEdit } from "react-icons/fi";
import EditItemModal from "@/components/items/editItemModal";
import CreateItemModal from "@/components/items/createItemModal";

export default function ItemsPage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchItems() {
      try {
        if (!token) {
          router.push("/welcome");
          return;
        }
        const res = await axiosInstance.get("/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
        setFilteredItems(res.data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch items. Please try again.",
          { position: "top-right", autoClose: 3000, transition: ToastSlide }
        );
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [token, router]);

  // When searchQuery changes, filter items
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const handleSearch = () => {
    setSearching(true);
    if (filteredItems.length === 0) {
      toast.info("No items matching your query.", {
        position: "top-right",
        autoClose: 1000,
        transition: ToastSlide,
      });
    }
    setTimeout(() => setSearching(false), 1000);
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingItemId(id);
      await axiosInstance.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item deleted successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedItem: {
    id: number;
    name: string;
    description: string;
  }) => {
    try {
      await axiosInstance.put(`/items/${updatedItem.id}`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        )
      );
      toast.success("Item updated successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
    } finally {
      setEditModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleCreateItem = () => {
    setCreateModalOpen(true);
  };

  const handleSaveCreate = async (newItem: {
    name: string;
    description: string;
  }) => {
    try {
      const res = await axiosInstance.post("/items", newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => [...prev, res.data]);
      toast.success("Item created successfully.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Create failed.", {
        position: "top-right",
        autoClose: 2000,
        transition: ToastSlide,
      });
    } finally {
      setCreateModalOpen(false);
    }
  };

  const handleLogout = () => {
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
          <h1 className="text-xl font-semibold">Items</h1>
          <div className="flex items-center gap-4">
            <img
              src="/avatar.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Search Bar and Create Item Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 mb-2 w-full px-4 mx-auto">
          <div className="flex items-center w-full max-w-[24.75rem]">
            <input
              type="text"
              placeholder="Search Item by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none text-gray-800 h-9 w-full max-w-[18.75rem]"
            />
            <button
              onClick={handleSearch}
              className="bg-[#D71E0E] text-white p-2 rounded-r-lg flex items-center justify-center"
            >
              {searching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiSearch size={20} className="cursor-pointer" />
              )}
            </button>
          </div>
          <button
            onClick={handleCreateItem}
            className="mt-4 md:mt-0 bg-[#D71E0E] text-white px-4 py-2 rounded shadow hover:bg-[#b53f34c4] transition-colors duration-200"
          >
            Create Item
          </button>
        </div>

        <main className="m-4 w-auto">
          <div className="bg-white shadow rounded-lg p-4 min-h-[200px] border">
            <div className="mb-4">
              <h2 className="font-semibold text-lg">Items List</h2>
            </div>
            {loading ? (
              // Skeleton loader grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex flex-col space-y-4 p-4 border rounded"
                  >
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center text-gray-600 mt-4">
                No items found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded shadow">
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-700 mb-3">{item.description}</p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                      >
                        <FiEdit size={20} className="cursor-pointer" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        {deletingItemId === item.id ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <FiTrash2 size={20} className="cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <EditItemModal
        isOpen={editModalOpen}
        item={editingItem}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
      />

      <CreateItemModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleSaveCreate}
      />

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
