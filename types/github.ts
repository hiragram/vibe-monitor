// GitHub API response types

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  draft: boolean;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  mergeable_state?: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  display_title: string;
  status: "queued" | "in_progress" | "completed";
  conclusion: "success" | "failure" | "cancelled" | "skipped" | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_started_at: string;
  event: string;
  head_branch: string;
  head_sha: string;
  workflow_id: number;
  path: string;
}

export interface GitHubRunner {
  id: number;
  name: string;
  os: string;
  status: "online" | "offline";
  busy: boolean;
  labels: Array<{
    id: number;
    name: string;
    type: string;
  }>;
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
}

export interface PollingConfig {
  interval: number; // in milliseconds
}
