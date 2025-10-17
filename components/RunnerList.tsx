"use client";

import { GitHubRunner } from "@/types/github";

interface RunnerListProps {
  runners: GitHubRunner[];
}

function getStatusColor(status: string, busy: boolean) {
  if (status === "offline") {
    return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
  }
  if (busy) {
    return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700";
  }
  return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700";
}

function getStatusLabel(status: string, busy: boolean) {
  if (status === "offline") return "Offline";
  if (busy) return "Busy";
  return "Idle";
}

export default function RunnerList({ runners }: RunnerListProps) {
  if (runners.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No runners configured
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {runners.map((runner) => (
        <div
          key={runner.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <h3 className="font-medium break-words">{runner.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {runner.os}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded border whitespace-nowrap ${getStatusColor(
                runner.status,
                runner.busy
              )}`}
            >
              {getStatusLabel(runner.status, runner.busy)}
            </span>
          </div>
          {runner.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {runner.labels.map((label) => (
                <span
                  key={label.id}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
