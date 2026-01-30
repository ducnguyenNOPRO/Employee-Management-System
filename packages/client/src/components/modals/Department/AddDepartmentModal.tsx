import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { User, DollarSign, Building2, Users, Edit, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import Label from "../../ui/label";

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
        <form className="space-y-6">
          {/* Department Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Department Information
            </h3>
            <div className="space-y-4">
              <div>
                <Input
                  label="Department Name"
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Engineering, Marketing, Sales"
                />
              </div>

              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 translate-y-1/4 h-4 w-4 text-gray-400" />
                  <Input
                    label="Department Manager"
                    type="text"
                    name="manager"
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Select or enter manager name"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  The person responsible for managing this department
                </p>
              </div>

              <div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 translate-y-1/4 h-4 w-4 text-gray-400" />
                  <Input
                    label="Annual Budget"
                    type="number"
                    name="budget"
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1500000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the annual budget allocation for this department
                </p>
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief description of the department's role and responsibilities..."
                />
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-200 rounded-lg p-6 border border-blue-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Departmen Name
                  </h3>
                </div>
                <div className="flex gap-1">
                  <button
                    disabled
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    disabled
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Manager</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    No Assigned Manager
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Employees</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Budget</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">$0M</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              bgColor="bg-white"
              textColor="text-black"
              hoverBgColor="hover:bg-gray-200"
            >
              Cancle
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              bgColor="bg-blue-500"
              textColor="text-white"
              hoverBgColor="hover:bg-blue-700"
            >
              Add Department
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
