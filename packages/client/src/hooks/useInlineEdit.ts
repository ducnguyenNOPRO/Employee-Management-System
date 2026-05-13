// useInlineEdit.ts
import { useState } from "react";
import type { ZodSchema } from "zod";

export function useInlineEdit<T extends string>(schema: ZodSchema) {
  const [editingField, setEditingField] = useState<T | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function startEdit(field: T, currentValue: string) {
    setEditingField(field);
    setValue(currentValue);
    setError(null);
  }

  function cancel() {
    setEditingField(null);
    setValue("");
    setError(null);
  }

  async function save(
    field: T,
    onSave: (field: T, value: string) => Promise<void>
  ) {
    // Validate with Zod
    const result = schema.safeParse({ [field]: value });
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid value";
      setError(message);
      return;
    }

    try {
      setLoading(true);
      await onSave(field, value);
      setEditingField(null);
      setError(null);
    } catch (err: any) {
      // Surface API errors (e.g. 400 "Email already exists")
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return {
    editingField,
    value,
    setValue,
    error,
    loading,
    startEdit,
    cancel,
    save,
  };
}
