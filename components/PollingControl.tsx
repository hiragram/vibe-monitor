"use client";

interface PollingControlProps {
  interval: number | null;
  onChange: (interval: number | null) => void;
}

const INTERVALS = [
  { label: "Disabled", value: null },
  { label: "10s", value: 10000 },
  { label: "30s", value: 30000 },
  { label: "1m", value: 60000 },
];

export default function PollingControl({ interval, onChange }: PollingControlProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Polling:</label>
      <select
        value={interval ?? "null"}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value === "null" ? null : Number(value));
        }}
        className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {INTERVALS.map((option) => (
          <option key={option.value ?? "null"} value={option.value ?? "null"}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
