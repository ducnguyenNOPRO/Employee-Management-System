// Button.tsx
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  bgColor = "bg-green-50",
  textColor = "text-green-700",
  hoverBgColor = "hover:bg-green-100",
  onClick,
  className = "",
  type = "button",
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center outline-1 gap-2 px-3 py-2 text-sm font-semibold rounded ${bgColor} ${textColor} ${hoverBgColor} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
