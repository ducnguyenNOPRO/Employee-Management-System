// Custom Button
import React, { type ButtonHTMLAttributes, type RefObject } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";

export const buttonVariants = cva(
  "inline-flex justify-center items-center outline-1 gap-2 px-3 py-2 text-sm font-semibold rounded cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-gray-100",
        add: "bg-blue-500 text-white hover:bg-blue-700",
        delete: "bg-white text-red-700 hover:bg-red-50 outline-red-200",
        approve: "bg-green-50 text-green-900 hover:bg-green-200",
        ghost: "outline-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  iconSize?: number; // New: custom icon size prop
  ref?: RefObject<HTMLButtonElement | null>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  icon,
  iconSize = 15, // New: destructure iconSize
  variant,
  ...props
}) => {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props}>
      {icon && (
        <span
          className="shrink-0 inline-flex items-center justify-center"
          style={
            iconSize
              ? { width: iconSize, height: iconSize, fontSize: iconSize }
              : undefined
          }
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};
