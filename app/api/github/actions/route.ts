import { NextRequest, NextResponse } from "next/server";
import { GitHubApiClient } from "@/lib/github";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const token = searchParams.get("token");

  if (!owner || !repo || !token) {
    return NextResponse.json(
      { error: "Missing required parameters: owner, repo, token" },
      { status: 400 }
    );
  }

  try {
    const client = new GitHubApiClient({ owner, repo, token });
    const runs = await client.getWorkflowRuns();
    return NextResponse.json(runs);
  } catch (error) {
    console.error("Error fetching workflow runs:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow runs" },
      { status: 500 }
    );
  }
}
