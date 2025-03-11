"use client";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newItem: { name: string; description: string }) => void;
}

export default function CreateItemModal({
  isOpen,
  onClose,
  onSave,
}: CreateItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-300 ease-in-out bg-[linear-gradient(135deg,rgba(255,154,158,0.8)_0%,rgba(250,208,196,0.8)_100%)] backdrop-blur-[10px]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200">
          <FiX size={24} />
        </button>
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Create New Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white text-lg font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              className="w-full p-3 rounded-lg border border-transparent focus:outline-none focus:border-white placeholder-white bg-white bg-opacity-20 text-white shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-white text-lg font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
              rows={3}
              className="w-full p-3 rounded-lg border border-transparent focus:outline-none focus:border-white placeholder-white bg-white bg-opacity-20 text-white shadow-sm h-[19.25rem] resize-none"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-purple-600 font-extrabold shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            Create Item
          </button>
        </form>
      </div>
    </div>
  );
}
