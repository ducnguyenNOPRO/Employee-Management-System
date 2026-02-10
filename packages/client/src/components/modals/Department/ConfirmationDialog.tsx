import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ManagerOverview } from "@/types/employee";
import { DialogClose } from "@radix-ui/react-dialog";
import { AlertCircle } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  conflictingManager: ManagerOverview | null;
  currentDepartmentName: string;
  submitForm: () => void;
  cancelDialog: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  isSubmitting,
  conflictingManager,
  currentDepartmentName,
  submitForm,
  cancelDialog,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={cancelDialog}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manager Already Assigned</DialogTitle>
          <DialogDescription>Click confirm to continue</DialogDescription>
        </DialogHeader>
        <p className="text-gray-600 mb-4">
          Manager{" "}
          <span className="font-semibold">
            {conflictingManager?.first_name} {conflictingManager?.last_name}
          </span>{" "}
          is already managing department{" "}
          <span className="font-semibold">
            {conflictingManager?.department.name}{" "}
          </span>
          <span>
            with (ID:{" "}
            {conflictingManager?.department.id.toString().padStart(3, "0")}).
          </span>
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-900">
                Click confirm will:
              </h4>
              <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
                <li>
                  Remove this manager from department{" "}
                  {conflictingManager?.department.name}
                </li>
                <li>
                  Assign this manager to new department {currentDepartmentName}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isSubmitting}>Cancel</Button>
          </DialogClose>
          <Button disabled={isSubmitting} onClick={submitForm} variant="add">
            {isSubmitting ? "Saving..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
