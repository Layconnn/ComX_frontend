/* eslint-disable @next/next/no-img-element */
import React from "react";

interface FormWrapperProps {
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
  success?: boolean;
}

export default function FormWrapper({
  title,
  subtitle,
  className = '',
  children,
  success = false,
}: FormWrapperProps) {
  return (
    <div className={`pt-12 px-[3.0625rem] pb-[2.6875rem] max-w-[34.6875rem] w-full bg-white mx-auto rounded mix-h-[35.625rem] h-full ${className} max-[640px]:p-8`}>
      <div className="mb-[2.5rem] max-[400px]:mb-6">
        {success && (
          <div className="flex justify-center mb-6 mt-[1.75rem]">
            <img src="/success.svg" alt="ComX" />
          </div>
        )}
        <h1 className="text-[1.875rem] text-[#1B1E24] leading-[2.1975rem] font-normal text-center mb-[0.4375rem] max-[400px]:text-[1.5rem]">
          {title}
        </h1>
        <h5 className="text-[0.875rem] text-[#252631] leading-[1.3125rem] text-center max-w-[27.375rem] max-[400px]:text-[0.75rem]">
          {subtitle}
        </h5>
      </div>
      {children}
    </div>
  );
}
