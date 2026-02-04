import { mockEmployees } from "@/lib/mockData";
import { Activity, useState } from "react";
import EmployeeReadOnly from "@/components/modals/Employee/EmployeeReadOnly";
import EditEmployeeForm from "@/components/modals/Employee/EditEmployeeForm";
import { useParams } from "react-router-dom";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const employee = mockEmployees.find((e) => e.id === id);

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const handleToggleMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      <Activity mode={isEditing ? "hidden" : "visible"}>
        <EmployeeReadOnly employee={employee} toggle={handleToggleMode} />
      </Activity>
      <Activity mode={isEditing ? "visible" : "hidden"}>
        <EditEmployeeForm employee={employee} toggle={handleToggleMode} />
      </Activity>
    </>
  );
}
