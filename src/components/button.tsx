import React from "react";

interface ButtonDivProps extends React.HTMLAttributes<HTMLButtonElement> {
  option: string | React.JSX.Element;
  type?: "button" | "submit" | "reset";
}

export default function ButtonDiv({
  option,
  type = "button",
  className,
  onClick,
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
      {option}
    </button>
  );
}
