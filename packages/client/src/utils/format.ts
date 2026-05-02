export function formatString(s: string) {
  return s.replace("_", " ");
}

export function formatSnakeCase(str: string) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function simpleFormatISODate(d: string) {
  return d.split("T")[0];
}

// mmm dd, yyyy
export function prettyFormatISODateYear(d: string | Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(d));
}

// mmm dd
export function prettyFormatISODate(d: string | Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(d));
}

// HH:MM
export function prettyFormatISOTime(d: string | Date) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

export function prettyFormatISODateTime(d: string | Date) {
  if (!d) return "";
  const datePart = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(d));

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(d));

  return `${datePart} • ${timePart}`;
}
