import DepartmentReadOnly from "@/components/modals/Department/DepartmentReadOnly";
import EditDepartmentForm from "@/components/modals/Department/EditDepartmentForm";
import { departmentService } from "@/services/department.service";
import { useQuery } from "@tanstack/react-query";
import { Activity, useState } from "react";
import { useParams } from "react-router-dom";

export default function DepartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const { data: department, isLoading } = useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentService.getSelectedDepartment(id!),
    enabled: !!id, // only run query if id exists
  });

  if (isLoading) {
    return <div>Getting Department Detail...</div>;
  }

  if (!department) {
    return <div>Department not found</div>;
  }

  const handleToggleMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      <Activity mode={isEditing ? "hidden" : "visible"}>
        <DepartmentReadOnly department={department} toggle={handleToggleMode} />
      </Activity>
      <Activity mode={isEditing ? "visible" : "hidden"}>
        <EditDepartmentForm department={department} toggle={handleToggleMode} />
      </Activity>
    </>
  );
}
