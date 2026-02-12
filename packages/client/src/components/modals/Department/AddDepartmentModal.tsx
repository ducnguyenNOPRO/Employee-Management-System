import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import AddForm from "./AddDepartmentForm";
import { useQueryClient } from "@tanstack/react-query";

interface AddDepartmentModalProps {
  isOpen: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddDepartmentModal({
  isOpen,
  setOpenModal,
}: AddDepartmentModalProps) {
  const queryClient = useQueryClient();
  const handleSuccess = () => {
    // Successfull submit form
    queryClient.invalidateQueries(["departments"]);
    setOpenModal(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpenModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Fill in the department information below
          </DialogDescription>
        </DialogHeader>
        {/* Form */}
        <AddForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
