import type { Invitation } from "@/types/employee";
import { prettyFormatISODate, formatString } from "@/utils/format";

type InvitationProps = {
  invitation: Invitation;
};

export default function InvitationStatus({ invitation }: InvitationProps) {
  const status = invitation.invitation_status;
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
        </div>
      </div>
    </div>
  );
}
