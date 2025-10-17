"use client";

import { useState, useEffect } from "react";
import { GitHubPullRequest, GitHubWorkflowRun, GitHubRunner, GitHubJob } from "@/types/github";
import PullRequestList from "./PullRequestList";
import WorkflowRunList from "./WorkflowRunList";
import RunnerList from "./RunnerList";
import PollingControl from "./PollingControl";
import ThemeToggle from "./ThemeToggle";

interface DashboardProps {
  owner: string;
  repo: string;
  token: string;
  onReset: () => void;
}

export default function Dashboard({ owner, repo, token, onReset }: DashboardProps) {
  const [pulls, setPulls] = useState<GitHubPullRequest[]>([]);
  const [runs, setRuns] = useState<GitHubWorkflowRun[]>([]);
  const [runners, setRunners] = useState<GitHubRunner[]>([]);
  const [jobs, setJobs] = useState<GitHubJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState(30000); // 30 seconds default
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [pullsRes, runsRes, runnersRes, jobsRes] = await Promise.all([
        fetch(`/api/github/pulls?owner=${owner}&repo=${repo}&token=${token}`),
        fetch(`/api/github/actions?owner=${owner}&repo=${repo}&token=${token}`),
        fetch(`/api/github/runners?owner=${owner}&repo=${repo}&token=${token}`),
        fetch(`/api/github/jobs?owner=${owner}&repo=${repo}&token=${token}`),
      ]);

      if (!pullsRes.ok || !runsRes.ok || !runnersRes.ok || !jobsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [pullsData, runsData, runnersData, jobsData] = await Promise.all([
        pullsRes.json(),
        runsRes.json(),
        runnersRes.json(),
        jobsRes.json(),
      ]);

      setPulls(pullsData);
      setRuns(runsData);
      setRunners(runnersData);
      setJobs(jobsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval, owner, repo, token]);

  const onlineRunners = runners.filter((r) => r.status === "online").length;
  const busyRunners = runners.filter((r) => r.busy).length;
  const queuedRuns = runs.filter((r) => r.status === "queued").length;

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Vibe Monitor
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Monitoring: <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{owner}/{repo}</span>
              </p>
              {lastUpdated && (
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <ThemeToggle />
              <PollingControl
                interval={pollingInterval}
                onChange={setPollingInterval}
              />
              <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700"
              >
                Change Repository
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Open Pull Requests</p>
                  <p className="text-4xl font-bold">{pulls.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Runners Busy</p>
                  <p className="text-4xl font-bold">{busyRunners}</p>
                  <p className="text-green-100 text-xs mt-1">{onlineRunners} online</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Queued Jobs</p>
                  <p className="text-4xl font-bold">{queuedRuns}</p>
                  <p className="text-purple-100 text-xs mt-1">{runs.length} total</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg shadow-sm">
            <p className="text-red-800 dark:text-red-300 font-medium">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
                Pull Requests
              </h2>
              <PullRequestList pulls={pulls} />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></span>
                Runners
              </h2>
              <RunnerList runners={runners} jobs={jobs} runs={runs} />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></span>
                Workflow Runs
              </h2>
              <WorkflowRunList runs={runs} jobs={jobs} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
