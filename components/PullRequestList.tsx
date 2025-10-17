"use client";

import { GitHubPullRequest } from "@/types/github";

interface PullRequestListProps {
  pulls: GitHubPullRequest[];
}

export default function PullRequestList({ pulls }: PullRequestListProps) {
  if (pulls.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No open pull requests
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pulls.map((pr) => (
        <a
          key={pr.id}
          href={pr.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-800"
        >
          <div className="flex items-start gap-3">
            <img
              src={pr.user.avatar_url}
              alt={pr.user.login}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  #{pr.number}
                </span>
                {pr.draft && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">
                    Draft
                  </span>
                )}
              </div>
              <h3 className="font-medium mb-1 break-words">{pr.title}</h3>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{pr.user.login}</span>
                <span>•</span>
                <span>
                  {pr.head.ref} → {pr.base.ref}
                </span>
              </div>
              {pr.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {pr.labels.map((label) => (
                    <span
                      key={label.name}
                      className="px-2 py-0.5 text-xs rounded"
                      style={{
                        backgroundColor: `#${label.color}30`,
                        color: `#${label.color}`,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
