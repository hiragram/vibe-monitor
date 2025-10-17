"use client";

import { useState, useEffect } from "react";
import { GitHubPullRequest, GitHubWorkflowRun } from "@/types/github";
import PullRequestList from "./PullRequestList";
import WorkflowRunList from "./WorkflowRunList";
import PollingControl from "./PollingControl";

interface DashboardProps {
  owner: string;
  repo: string;
  token: string;
  onReset: () => void;
}

export default function Dashboard({ owner, repo, token, onReset }: DashboardProps) {
  const [pulls, setPulls] = useState<GitHubPullRequest[]>([]);
  const [runs, setRuns] = useState<GitHubWorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState(30000); // 30 seconds default
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [pullsRes, runsRes] = await Promise.all([
        fetch(`/api/github/pulls?owner=${owner}&repo=${repo}&token=${token}`),
        fetch(`/api/github/actions?owner=${owner}&repo=${repo}&token=${token}`),
      ]);

      if (!pullsRes.ok || !runsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [pullsData, runsData] = await Promise.all([
        pullsRes.json(),
        runsRes.json(),
      ]);

      setPulls(pullsData);
      setRuns(runsData);
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vibe Monitor</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitoring: <span className="font-mono">{owner}/{repo}</span>
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-4 items-center">
            <PollingControl
              interval={pollingInterval}
              onChange={setPollingInterval}
            />
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Change Repository
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Pull Requests</h2>
              <PullRequestList pulls={pulls} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Workflow Runs</h2>
              <WorkflowRunList runs={runs} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
