import type React from "react";
import type { LabelHTMLAttributes } from "react";

interface LableProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export default function Label({
  className = "",
  required = false,
  children,
  ...props
}: LableProps) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1" {...props}>
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}
