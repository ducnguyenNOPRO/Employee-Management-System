// Custom Button
import React, { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  bgColor = "bg-green-50",
  textColor = "text-green-700",
  hoverBgColor = "hover:bg-green-100",
  className = "",
  icon,
  ...props
}) => {
  return (
    <button
      className={`flex items-center outline-1 gap-2 px-3 py-2 text-sm font-semibold rounded ${bgColor} ${textColor} ${hoverBgColor} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
