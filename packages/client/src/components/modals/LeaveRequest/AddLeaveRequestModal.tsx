import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeaveRequestForm from "./LeaveRequestForm";

("");

interface AddLeaveRequestModalProps {
  isOpen: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddLeaveRequestModal({
  isOpen,
  setOpenModal,
}: AddLeaveRequestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpenModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Fill in the department information below
          </DialogDescription>
        </DialogHeader>

        {/* Form && Footer */}
        <LeaveRequestForm />
      </DialogContent>
    </Dialog>
  );
}
