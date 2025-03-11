/* eslint-disable @next/next/no-img-element */
import React from "react";

interface ButtonDivProps extends React.HTMLAttributes<HTMLButtonElement> {
  option: string | React.JSX.Element;
  type?: "button" | "submit" | "reset";
  image?: string; // optional image URL
}

export default function ButtonDiv({
  option,
  type = "button",
  className,
  onClick,
  image,
  ...props
}: ButtonDivProps) {
  return (
    <button
      {...props}
      role="button"
      tabIndex={0}
      type={type}
      onClick={onClick}
      className={`cursor-pointer outline-none transition flex justify-center items-center rounded-[0.125rem] max-[400px]:p-4 ${className}`}
    >
      {image && <img src={image} alt="button icon" className="mr-2" />}
      {option}
    </button>
  );
}
