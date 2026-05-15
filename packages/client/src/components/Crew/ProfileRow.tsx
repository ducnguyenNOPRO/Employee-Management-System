import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type EditableField =
  | "email"
  | "phone"
  | "emergency_contact"
  | "emergency_phone";

interface ProfileRowProps {
  label: string;
  field: EditableField;
  displayValue: string | null | undefined;
  editingField: EditableField | null;
  editValue: string;
  error: string | null;
  loading: boolean;
  onEdit: (field: EditableField, currentValue: string) => void;
  onSave: (field: EditableField) => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

export default function ProfileRow({
  label,
  field,
  displayValue,
  editingField,
  editValue,
  error,
  loading,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: ProfileRowProps) {
  const isEditing = editingField === field;
  const isLocked = editingField !== null && !isEditing;

  return (
    <div className="flex items-center justify-between py-3 border-b gap-4">
      <div className="space-y-1 flex-1">
        {isEditing ? (
          <Input
            label={label}
            id={label}
            value={editValue}
            onChange={(e) => onChange(e.target.value)}
            error={error ?? undefined}
            autoFocus
          />
        ) : (
          <>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="font-medium">{displayValue ?? "—"}</p>
          </>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <Button
            variant="add"
            onClick={() => onSave(field)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => onEdit(field, displayValue ?? "")}
          disabled={isLocked}
          icon={<Pencil />}
        >
          Edit
        </Button>
      )}
    </div>
  );
}
