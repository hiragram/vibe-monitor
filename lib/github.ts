import { GitHubPullRequest, GitHubWorkflowRun, GitHubRunner, GitHubJob } from "@/types/github";

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
      const errorBody = await response.text();
      console.error(`GitHub API error for ${path}:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    return response.json();
  }

  async getPullRequests(): Promise<GitHubPullRequest[]> {
    const pulls = await this.fetch<GitHubPullRequest[]>(
      `/repos/${this.owner}/${this.repo}/pulls?state=open&sort=updated&direction=desc`
    );

    return pulls;
  }

  async getWorkflowRuns(): Promise<GitHubWorkflowRun[]> {
    // Fetch only in_progress and queued runs
    const [inProgressData, queuedData] = await Promise.all([
      this.fetch<{ workflow_runs: GitHubWorkflowRun[] }>(
        `/repos/${this.owner}/${this.repo}/actions/runs?status=in_progress&per_page=50`
      ),
      this.fetch<{ workflow_runs: GitHubWorkflowRun[] }>(
        `/repos/${this.owner}/${this.repo}/actions/runs?status=queued&per_page=50`
      ),
    ]);

    // Combine and deduplicate by run_id
    const allRuns = [
      ...inProgressData.workflow_runs,
      ...queuedData.workflow_runs,
    ];

    const uniqueRuns = Array.from(
      new Map(allRuns.map(run => [run.id, run])).values()
    );

    return uniqueRuns;
  }

  async getRunners(): Promise<GitHubRunner[]> {
    const data = await this.fetch<{ runners: GitHubRunner[] }>(
      `/repos/${this.owner}/${this.repo}/actions/runners`
    );
    return data.runners;
  }

  async getJobs(): Promise<GitHubJob[]> {
    // Get recent workflow runs first
    const runs = await this.getWorkflowRuns();
    const allJobs: GitHubJob[] = [];

    // Fetch jobs for each run (limit to first 10 runs to avoid too many API calls)
    for (const run of runs.slice(0, 10)) {
      try {
        const data = await this.fetch<{ jobs: GitHubJob[] }>(
          `/repos/${this.owner}/${this.repo}/actions/runs/${run.id}/jobs`
        );
        allJobs.push(...data.jobs);
      } catch (error) {
        console.error(`Failed to fetch jobs for run ${run.id}:`, error);
      }
    }

    return allJobs;
  }
}
