export function getButtonText(status: string) {
  let text: string;
  switch (status) {
    case "NOT_SENT":
      text = "Invite";
      break;
    case "PENDING":
      text = "Resend";
      break;
    case "EXPIRED":
      text = "Resend";
      break;
    default:
      text = "";
  }
  return text;
}
