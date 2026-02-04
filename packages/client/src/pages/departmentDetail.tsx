import DepartmentReadOnly from "@/components/modals/Department/DepartmentReadOnly";
import EditDepartmentForm from "@/components/modals/Department/EditDepartmentForm";
import { mockDepartments } from "@/lib/mockData";
import { Activity, useState } from "react";
import { useParams } from "react-router-dom";

export default function DepartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);

  const [isEditing, setIsEditing] = useState(false);
  const department = mockDepartments.find((d) => d.id === numId);

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
