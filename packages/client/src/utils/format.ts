export function formatString(s: string) {
  return s.replace("_", " ");
}

export function simpleFormatISODate(d: string) {
  return d.split("T")[0];
}

export function prettyFormatISODate(d: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short", // shows "UTC" — remove if you don't want it
  }).format(new Date(d));
}
export function prettyFormatISOTime(d: string | null) {
  if (!d) return;
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

export function prettyFormatISODateTime(date: Date) {
  const datePart = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} • ${timePart}`;
}
