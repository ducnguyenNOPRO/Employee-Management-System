import { Activity, useState } from "react";
import EmployeeReadOnly from "@/components/modals/Employee/EmployeeReadOnly";
import EditEmployeeForm from "@/components/modals/Employee/EditEmployeeForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employeeService } from "@/services/employee.service";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeeService.getSelectedEmployee(id!),
    enabled: !!id, // only run query if id exists
  });

  if (isLoading) {
    return <div>Getting Employee Detail...</div>;
  }

  if (!employee) {
    return (
      <div className="h-full flex items-center justify-center font-bold">
        Employee with id {id} not found
      </div>
    );
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
