"use client";

import { GitHubRunner, GitHubJob, GitHubWorkflowRun } from "@/types/github";

interface RunnerListProps {
  runners: GitHubRunner[];
  jobs: GitHubJob[];
  runs: GitHubWorkflowRun[];
}

function getStatusColor(status: string, busy: boolean) {
  if (status === "offline") {
    return "bg-gradient-to-r from-slate-400 to-slate-500 text-white";
  }
  if (busy) {
    return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white";
  }
  return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
}

function getStatusLabel(status: string, busy: boolean) {
  if (status === "offline") return "Offline";
  if (busy) return "Busy";
  return "Online";
}

export default function RunnerList({ runners, jobs, runs }: RunnerListProps) {
  // Find the job that each runner is executing
  const getRunnerJob = (runnerId: number) => {
    return jobs.find(
      (job) => job.runner_id === runnerId && job.status === "in_progress"
    );
  };

  // Find workflow run from job
  const getWorkflowRun = (job: GitHubJob) => {
    return runs.find((r) => r.id === job.run_id);
  };
  if (runners.length === 0) {
    return (
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">No runners configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {runners.map((runner) => {
        const currentJob = getRunnerJob(runner.id);
        return (
          <div
            key={runner.id}
            className={`p-4 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-200 ${
              runner.busy
                ? "bg-gradient-to-br from-blue-400/30 to-cyan-500/30 dark:from-blue-500/30 dark:to-cyan-600/30 border-2 border-blue-400 dark:border-blue-500 animate-pulse shadow-lg shadow-blue-400/50 dark:shadow-blue-500/50"
                : "bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 break-words">
                  {runner.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  {runner.os}
                </p>
                {currentJob && (() => {
                  const workflowRun = getWorkflowRun(currentJob);
                  return (
                    <div className="mt-2 p-2 bg-blue-500/20 dark:bg-blue-600/20 rounded-lg border border-blue-400/30 dark:border-blue-500/30">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                        Running:
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {workflowRun?.name || "Unknown"} #{workflowRun?.run_number || "?"}
                      </p>
                    </div>
                  );
                })()}
              </div>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap shadow-sm ${getStatusColor(
                  runner.status,
                  runner.busy
                )}`}
              >
                {getStatusLabel(runner.status, runner.busy)}
              </span>
            </div>
            {runner.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {runner.labels.map((label, index) => (
                  <span
                    key={`${runner.id}-${label.id}-${index}`}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-full"
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
