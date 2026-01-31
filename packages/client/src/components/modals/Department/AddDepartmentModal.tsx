import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import AddForm from "./AddDepartmentForm";

interface AddDepartmentModalProps {
  isOpen: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddDepartmentModal({
  isOpen,
  setOpenModal,
}: AddDepartmentModalProps) {
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
        <AddForm />
      </DialogContent>
    </Dialog>
  );
}
