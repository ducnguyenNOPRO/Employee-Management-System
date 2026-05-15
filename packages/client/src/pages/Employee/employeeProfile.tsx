import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import type { MutableUserFields, UserAuth } from "@/types/user";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { editableSchema } from "@/lib/employee/zodSchema";
import ProfileRow from "@/components/Crew/ProfileRow";
import { ProfileService } from "@/services/Employee/profile.service";

type EditableField =
  | "email"
  | "phone"
  | "emergency_contact"
  | "emergency_phone";

export default function EmployeeProfile() {
  const { user, updateUser } = useAuthStore();
  const employee = user as UserAuth;

  const {
    editingField,
    value,
    setValue,
    error,
    loading,
    startEdit,
    cancel,
    save,
  } = useInlineEdit<EditableField>(editableSchema);

  async function handleSave(field: EditableField, newValue: string) {
    try {
      await ProfileService.editProfile({ [field]: newValue });
      updateUser({
        [field]: newValue,
      } as MutableUserFields);
    } catch {}
  }

  const rowProps = {
    editingField,
    editValue: value,
    error,
    loading,
    onEdit: startEdit,
    onSave: (field: EditableField) => save(field, handleSave),
    onCancel: cancel,
    onChange: setValue,
  };

  return (
    <div className="space-y-6">
      {/* Employment Info */}
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1 flex-1">
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-medium">{employee.id}</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1 flex-1">
                <p className="text-sm text-gray-600">Salary</p>
                <p className="font-medium">${employee.hourly_rate}/hr</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Read-only rows */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1 flex-1">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">
                  {employee.first_name} {employee.last_name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-1 flex-1">
                <p className="text-sm text-gray-600">Store Number</p>
                <p className="font-medium">{employee.location_id}</p>
              </div>
            </div>

            {/* Editable rows */}
            <ProfileRow
              label="Email"
              field="email"
              displayValue={employee.email}
              {...rowProps}
            />
            <ProfileRow
              label="Phone"
              field="phone"
              displayValue={employee.phone}
              {...rowProps}
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Contact information for emergencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <ProfileRow
              label="Contact Name"
              field="emergency_contact"
              displayValue={employee.emergency_contact}
              {...rowProps}
            />
            <ProfileRow
              label="Contact Phone"
              field="emergency_phone"
              displayValue={employee.emergency_phone}
              {...rowProps}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
