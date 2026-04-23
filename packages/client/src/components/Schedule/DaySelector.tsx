import { cn } from "@/utils/utils";

// DaySelector.tsx
interface DaySelectorProps {
  weekDays: { key: string; label: string }[]; // key = yyyy-mm-dd
  selected: string[]; // have current day
  onChange: (selected: string[]) => void;
}

export function DaySelector({
  weekDays,
  selected,
  onChange,
}: DaySelectorProps) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((d) => d !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="flex gap-3 w-fit">
      {weekDays.map((d) => {
        const isSelected = selected.includes(d.key);
        return (
          <button
            key={d.key}
            onClick={() => toggle(d.key)}
            className={cn(
              "w-9 h-9 rounded-full text-xs font-medium transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {d.label.slice(0, 2)} {/* "M", "T" etc */}
          </button>
        );
      })}
    </div>
  );
}
