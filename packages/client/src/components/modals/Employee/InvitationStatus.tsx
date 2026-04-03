import type { Invitation } from "@/types/employee";
import { prettyFormatISODate, formatString } from "@/utils/format";
import { getButtonText } from "@/utils/helper";
import { Send } from "lucide-react";

type InvitationProps = {
  invitation: Invitation;
  id: string;
};

export default function InvitationStatus({ invitation, id }: InvitationProps) {
  const status = invitation.invitation_status;
  const buttonText = getButtonText(status);
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-amber-100 text-amber-800">
            {formatString(status)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {invitation.expires_at && (
            <span className="text-sm font-medium text-gray-700">
              Invite expires:{" "}
              <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-amber-100 text-amber-800">
                {prettyFormatISODate(invitation.expires_at)}
              </span>
            </span>
          )}
          {/* Only "invite" or "resend exist here" */}
          {buttonText === "Invite" ? (
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              Send Invite
            </button>
          ) : (
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
            >
              <Send className="h-4 w-4" />
              Resend Invite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
