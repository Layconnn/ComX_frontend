import React from "react";
import ErrorMessage from "./errorMessage";

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onClose?: () => void;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  maxLength?: number;
  error?: boolean;
  errorMessage?: string;
}

export default function FormInput({
  label,
  type = "text",
  name,
  id,
  placeholder,
  value,
  onChange,
  onClick,
  onClose = () => {},
  required = false,
  maxLength,
  labelClassName = "",
  className = "",
  error = false,
  errorMessage,
}: FormInputProps) {
  return (
    <div className="mb-5 max-[640px]:w-full">
      <label
        htmlFor={id}
        className={`text-[0.875rem] leading-[1.025625rem] ${labelClassName}`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
        required={required}
        maxLength={maxLength}
        className={`pl-4 pb-4 pt-[0.875rem] text-[0.875rem] rounded-[0.125rem] border border-[#E8ECEF] max-w-[28.5625rem] w-full mt-[0.875rem] ${className}`}
      />
      {error && (
        <ErrorMessage
          message={errorMessage || ""}
          onClose={onClose}
          isNotification={false}
        />
      )}
    </div>
  );
}
