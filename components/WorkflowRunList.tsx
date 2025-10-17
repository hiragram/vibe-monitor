"use client";

import { GitHubWorkflowRun, GitHubJob } from "@/types/github";

interface WorkflowRunListProps {
  runs: GitHubWorkflowRun[];
  jobs: GitHubJob[];
}

function getStatusColor(status: string, conclusion: string | null) {
  if (status === "in_progress" || status === "queued") {
    return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
  }
  if (conclusion === "success") {
    return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
  }
  if (conclusion === "failure") {
    return "bg-gradient-to-r from-red-400 to-rose-500 text-white";
  }
  if (conclusion === "cancelled") {
    return "bg-gradient-to-r from-slate-400 to-slate-500 text-white";
  }
  return "bg-gradient-to-r from-slate-400 to-slate-500 text-white";
}

function getStatusLabel(status: string, conclusion: string | null) {
  if (status === "in_progress") return "In Progress";
  if (status === "queued") return "Queued";
  if (conclusion === "success") return "Success";
  if (conclusion === "failure") return "Failed";
  if (conclusion === "cancelled") return "Cancelled";
  return status;
}

export default function WorkflowRunList({ runs, jobs }: WorkflowRunListProps) {
  // Filter runs to show only queued and in_progress
  const activeRuns = runs.filter((run) => run.status === "queued" || run.status === "in_progress");

  // Find jobs for a specific run
  const getRunJobs = (runId: number) => {
    return jobs.filter((job) => job.run_id === runId);
  };

  if (activeRuns.length === 0) {
    return (
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
        <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">No workflow runs</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeRuns.map((run) => {
        const runJobs = getRunJobs(run.id);
        const inProgressJobs = runJobs.filter((job) => job.status === "in_progress");

        return (
          <a
            key={run.id}
            href={run.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-400 dark:hover:border-purple-500 group"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    #{run.run_number}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 break-words group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {run.name}
                </h3>
                {run.display_title && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {run.display_title}
                  </p>
                )}
                {inProgressJobs.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {inProgressJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-2 bg-yellow-500/20 dark:bg-yellow-600/20 rounded-lg border border-yellow-400/30 dark:border-yellow-500/30"
                      >
                        <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                          Runner: {job.runner_name || "Waiting..."}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap shadow-sm ${getStatusColor(
                  run.status,
                  run.conclusion
                )}`}
              >
                {getStatusLabel(run.status, run.conclusion)}
              </span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded">
                  {run.head_branch}
                </span>
                <span>•</span>
                <span className="font-medium">{run.event}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(run.run_started_at || run.created_at).toLocaleString()}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
