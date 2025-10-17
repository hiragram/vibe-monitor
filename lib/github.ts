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
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getPullRequests(): Promise<GitHubPullRequest[]> {
    const pulls = await this.fetch<GitHubPullRequest[]>(
      `/repos/${this.owner}/${this.repo}/pulls?state=open&sort=updated&direction=desc`
    );

    // Fetch detailed info for each PR to get additions, deletions, changed_files, and check status
    const detailedPulls = await Promise.all(
      pulls.map(async (pr) => {
        try {
          const detailed = await this.fetch<GitHubPullRequest>(
            `/repos/${this.owner}/${this.repo}/pulls/${pr.number}`
          );

          // Fetch check runs status
          let checkStatus: "success" | "pending" | "failure" | undefined;
          try {
            const checkRuns = await this.fetch<{
              total_count: number;
              check_runs: Array<{
                status: string;
                conclusion: string | null;
              }>;
            }>(`/repos/${this.owner}/${this.repo}/commits/${pr.head.sha}/check-runs`);

            if (checkRuns.total_count === 0) {
              checkStatus = undefined;
            } else {
              const hasInProgress = checkRuns.check_runs.some(
                (run) => run.status !== "completed"
              );
              const hasFailed = checkRuns.check_runs.some(
                (run) => run.conclusion === "failure" || run.conclusion === "cancelled"
              );

              if (hasInProgress) {
                checkStatus = "pending";
              } else if (hasFailed) {
                checkStatus = "failure";
              } else {
                checkStatus = "success";
              }
            }
          } catch (error) {
            console.error(`Failed to fetch check runs for PR #${pr.number}:`, error);
          }

          return { ...detailed, check_status: checkStatus };
        } catch (error) {
          console.error(`Failed to fetch details for PR #${pr.number}:`, error);
          return pr; // Return basic PR info if detailed fetch fails
        }
      })
    );

    return detailedPulls;
  }

  async getWorkflowRuns(): Promise<GitHubWorkflowRun[]> {
    const data = await this.fetch<{ workflow_runs: GitHubWorkflowRun[] }>(
      `/repos/${this.owner}/${this.repo}/actions/runs?per_page=20`
    );
    return data.workflow_runs;
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
