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
    timeZone: "UTC",
  }).format(new Date(d));
}
