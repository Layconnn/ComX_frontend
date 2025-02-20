import React, { useEffect, useState } from "react";

interface ErrorMessageProps {
  message: string;
  isNotification?: boolean;
  className?: string;
  onClose: () => void;
}

export default function ErrorMessage({
  message,
  isNotification = true,
  className = "",
  onClose,
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  // When isVisible becomes false, wait for the transition to finish before calling onClose
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 300); // 300ms corresponds to our transition duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <>
      {isNotification ? (
        <div
          className={`bg-[#FEF2F2] border border-[#EF4444] text-[#EF4444] px-4 py-[1.3125rem] pl-[1.625rem] rounded-[0.625rem] mb-[2.875rem] max-w-[26.1875rem] mx-auto flex items-center transition-opacity duration-300 w-full ${className} ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-sm flex-grow">{message}</span>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#EF4444] font-bold"
          >
            &#10005;
          </button>
        </div>
      ) : (
        <h5 className="text-[#EF4444] text-[0.625rem] leading-[1.3125rem] mt-2">
          {message}
        </h5>
      )}
    </>
  );
}
