import { NextRequest, NextResponse } from "next/server";
import { GitHubApiClient } from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const token = searchParams.get("token");

    if (!owner || !repo || !token) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const client = new GitHubApiClient({ owner, repo, token });
    const jobs = await client.getJobs();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
