"use client";

interface PollingControlProps {
  interval: number;
  onChange: (interval: number) => void;
}

const INTERVALS = [
  { label: "10s", value: 10000 },
  { label: "30s", value: 30000 },
  { label: "1m", value: 60000 },
];

export default function PollingControl({ interval, onChange }: PollingControlProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Polling:</label>
      <select
        value={interval}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {INTERVALS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
