import { GitHubPullRequest, GitHubWorkflowRun } from "@/types/github";

interface GitHubApiOptions {
  owner: string;
  repo: string;
  token: string;
}

export class GitHubApiClient {
  private baseUrl = "https://api.github.com";
  private owner: string;
  private repo: string;
  private token: string;

  constructor(options: GitHubApiOptions) {
    this.owner = options.owner;
    this.repo = options.repo;
    this.token = options.token;
  }

  private async fetch<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getPullRequests(): Promise<GitHubPullRequest[]> {
    return this.fetch<GitHubPullRequest[]>(
      `/repos/${this.owner}/${this.repo}/pulls?state=open&sort=updated&direction=desc`
    );
  }

  async getWorkflowRuns(): Promise<GitHubWorkflowRun[]> {
    const data = await this.fetch<{ workflow_runs: GitHubWorkflowRun[] }>(
      `/repos/${this.owner}/${this.repo}/actions/runs?per_page=20`
    );
    return data.workflow_runs;
  }
}
