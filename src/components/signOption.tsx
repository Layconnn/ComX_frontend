import React from "react";
import ButtonDiv from "./button";

interface SignOptionProps {
  title: string;
  option: string;
  subtitle: string;
  className?: string;
  onclick?: () => void;
}

export default function SignOption({
  title,
  subtitle,
  option,
  className,
  onclick,
}: SignOptionProps) {
  return (
    <div className="pt-[2.6875rem] pr-[3.125rem] pl-12 pb-[2.6875rem] max-w-[34.6875rem] w-full bg-white rounded max-[640px]:p-8">
      <div className="mb-[2.0625rem]">
        <h1 className="text-[1.875rem] leading-[2.1975rem] font-normal text-center mb-[0.4375rem]">
          {title}
        </h1>
        <h5 className="text-[0.875rem] leading-[1.3125rem] text-center">
          {subtitle}
        </h5>
      </div>
      <ButtonDiv
        option={option}
        onClick={onclick}
        className={`w-full pb-[1.4125rem] pt-[1.0625rem] text-white text-[0.875rem] leading-[1.025625rem] font-extrabold rounded-[0.125rem] ${className}`}
      />
    </div>
  );
}
