// components/CustomInput.jsx

import type { InputHTMLAttributes } from "react";
import type { FieldValues, UseFormRegister, Path } from "react-hook-form";

interface InputProps<T extends FieldValues> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name"
> {
  label?: string;
  error?: string;
  required?: boolean;
  name?: Path<T>;
  register?: UseFormRegister<T>;
}

export function Input<T extends FieldValues>({
  label,
  error,
  name,
  required = false,
  className = "",
  register,
  ...props
}: InputProps<T>) {
  const registration = register && name ? register(name) : {};
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={props.id || name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...registration}
        className={`${error ? "border-red-500" : ""} w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
