import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import type { Dispatch, SetStateAction } from "react";
import Form from "./AddEmployeeForm";

interface AddEmployeeModalProps {
  isOpen: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddEmployeeModal({
  isOpen,
  setOpenModal,
}: AddEmployeeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpenModal}>
      <DialogContent className="md:max-w-3xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the employee information below
          </DialogDescription>
        </DialogHeader>
        {/* Form && Footer */}
        <Form />
      </DialogContent>
    </Dialog>
  );
}
