"use client";

import { GitHubWorkflowRun } from "@/types/github";

interface WorkflowRunListProps {
  runs: GitHubWorkflowRun[];
}

function getStatusColor(status: string, conclusion: string | null) {
  if (status === "in_progress" || status === "queued") {
    return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700";
  }
  if (conclusion === "success") {
    return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700";
  }
  if (conclusion === "failure") {
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700";
  }
  if (conclusion === "cancelled") {
    return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
  }
  return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
}

function getStatusLabel(status: string, conclusion: string | null) {
  if (status === "in_progress") return "In Progress";
  if (status === "queued") return "Queued";
  if (conclusion === "success") return "Success";
  if (conclusion === "failure") return "Failed";
  if (conclusion === "cancelled") return "Cancelled";
  return status;
}

export default function WorkflowRunList({ runs }: WorkflowRunListProps) {
  if (runs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No workflow runs
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {runs.map((run) => (
        <a
          key={run.id}
          href={run.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-800"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-medium flex-1 break-words">{run.display_title || run.name}</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded border whitespace-nowrap ${getStatusColor(
                run.status,
                run.conclusion
              )}`}
            >
              {getStatusLabel(run.status, run.conclusion)}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">{run.head_branch}</span>
              <span>•</span>
              <span>{run.event}</span>
            </div>
            <div>
              Started: {new Date(run.run_started_at || run.created_at).toLocaleString()}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
