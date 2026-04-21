import Select from "./ui/select";

const SLOTS: { value: string; label: string }[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h % 12 || 12;
    SLOTS.push({ value: `${hh}:${mm}`, label: `${h12}:${mm} ${ampm}` });
  }
}

export default function ShiftPicker({
  startTime = "08:00",
  endTime = "16:00",
  onChange,
  errors,
}: {
  startTime?: string;
  endTime?: string;
  onChange: (value: { startTime: string; endTime: string }) => void;
  errors:
    | {
        notes?: string;
        start_time?: string;
        end_time?: string;
      }
    | undefined;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Select
        value={startTime}
        error={errors?.start_time}
        onChange={(e) => onChange?.({ startTime: e.target.value, endTime })}
      >
        {SLOTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>
      <span>→</span>
      <Select
        value={endTime}
        error={errors?.end_time}
        onChange={(e) => onChange?.({ startTime, endTime: e.target.value })}
      >
        {SLOTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
