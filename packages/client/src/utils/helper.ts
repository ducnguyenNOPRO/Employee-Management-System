import {
  addDays,
  differenceInDays,
  differenceInMinutes,
  format,
  startOfDay,
} from "date-fns";

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

export function startOfWeekMonday(date: Date) {
  const d = startOfDay(date);
  const day = d.getDay();

  // convert Sunday (0) → 6, Monday (1) → 0, etc.
  const diff = (day + 6) % 7;

  return addDays(d, -diff);
}

export function buildWeekDays(start: Date | string, end: Date | string) {
  const length = differenceInDays(end, start) + 1; // +1 to include the end day
  return Array.from({ length }).map((_, i) => {
    const date = addDays(start, i);

    return {
      date,
      label: format(date, "EEE dd"),
      key: format(date, "yyyy-MM-dd"),
    };
  });
}

function calculateShiftDuration(
  start_time: Date | string,
  end_time: Date | string
) {
  const start = new Date(start_time);
  const end = new Date(end_time);

  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  const totalMinutes = differenceInMinutes(end, start);

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return { h, m };
}

export function formatShiftDuration(
  start_time: Date | string,
  end_time: Date | string
) {
  const { h, m } = calculateShiftDuration(start_time, end_time);
  if (m === 0) return `${h} hours`;
  return `${h}h ${m}m`;
}
