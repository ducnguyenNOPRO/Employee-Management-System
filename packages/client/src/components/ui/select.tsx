import type { SelectHTMLAttributes } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface SelectProps<T extends FieldValues> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "name"
> {
  error?: string;
  name?: Path<T>;
  register?: UseFormRegister<T>;
}

export default function Label<T extends FieldValues>({
  name,
  register,
  error,
  children,
  ...props
}: SelectProps<T>) {
  const registration = register && name ? register(name) : {};
  return (
    <div className="space-y-1">
      <select
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...registration}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
