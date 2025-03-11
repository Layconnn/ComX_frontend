"use client";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface EditInvestmentModalProps {
  isOpen: boolean;
  investment: { id: number; name: string; quantity: number; value: number } | null;
  onClose: () => void;
  onSave: (updatedInvestment: { id: number; name: string; quantity: number; value: number }) => void;
}

export default function EditInvestmentModal({
  isOpen,
  investment,
  onClose,
  onSave,
}: EditInvestmentModalProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (investment) {
      setName(investment.name);
      setQuantity(investment.quantity);
      setValue(investment.value);
    }
  }, [investment]);

  if (!isOpen || !investment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: investment.id, name, quantity, value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#000000] opacity-70"
        onClick={onClose}
      ></div>
      <div
        className="relative z-50 w-full max-w-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-300 bg-white"
      >
        <h2
          className="text-3xl font-extrabold text-center mb-6 text-black"
        >
          Edit Investment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-lg font-semibold mb-2 text-black"
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Investment name"
              className="w-full p-3 rounded-lg border border-[#000000] focus:outline-none bg-[#ffffff] text-[#000000]"
              required
            />
          </div>
          <div>
            <label
              className="block text-lg font-semibold mb-2 text-black"
            >
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
              className="text-black w-full p-3 rounded-lg border border-[#000000] focus:outline-none bg-[#ffffff]"
              required
            />
          </div>
          <div>
            <label
              className="block text-lg font-semibold mb-2 text-black"
            >
              Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="Enter value per share"
              className="w-full p-3 rounded-lg border border-[#000000] focus:outline-none bg-[#ffffff] text-[#000000]"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded transition-transform duration-200 hover:scale-105 bg-white text-black"
            >
              Save Changes
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:text-[#D71E0E] text-black"
        >
          <FiX size={24} />
        </button>
      </div>
    </div>
  );
}
