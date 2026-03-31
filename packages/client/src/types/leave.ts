export interface BaseRequest {
  id: string;
  type: "VACATION" | "SICK_LEAVE" | "UNPAID" | "OTHER";
  hours: number;
  start_date: string;
  end_date: string;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  requester: Requester;
  approver?: Approver;
}
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
