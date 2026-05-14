export type LeaveType = "VACATION" | "SICK_LEAVE";

export interface LeaveBalance {
  type: LeaveType;
  remaining: number;
}

export interface BaseRequest {
  id: string;
  type: LeaveType;
  hours: number;
  start_date: string;
  end_date?: string | null;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  requester: Requester;
  approver?: Approver;
}

export interface EmpHistoryRequest extends Pick<
  BaseRequest,
  "id" | "start_date" | "end_date" | "status" | "hours" | "type"
> {}
interface Requester {
  id: string;
  first_name: string;
  last_name: string;
}

interface Approver extends Omit<Requester, "id"> {}

export interface UpdateRequestDecisionPayload {
  status: "APPROVED" | "REJECTED";
  approver_id: string;
}
