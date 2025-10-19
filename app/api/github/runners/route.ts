import { NextRequest, NextResponse } from "next/server";
import { GitHubApiClient } from "@/lib/github";

export const dynamic = "force-static";
export const revalidate = 0;

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
    const runners = await client.getRunners();
    return NextResponse.json(runners);
  } catch (error) {
    console.error("Error fetching runners:", error);
    return NextResponse.json(
      { error: "Failed to fetch runners" },
      { status: 500 }
    );
  }
}
