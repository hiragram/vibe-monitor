"use client";

import { GitHubPullRequest } from "@/types/github";

interface PullRequestListProps {
  pulls: GitHubPullRequest[];
}

export default function PullRequestList({ pulls }: PullRequestListProps) {
  if (pulls.length === 0) {
    return (
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">No open pull requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pulls.map((pr) => (
        <a
          key={pr.id}
          href={pr.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-400 dark:hover:border-blue-500 group"
        >
          <div className="flex items-start gap-3">
            <img
              src={pr.user.avatar_url}
              alt={pr.user.login}
              className="w-10 h-10 rounded-full ring-2 ring-blue-100 dark:ring-blue-900/30"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  #{pr.number}
                </span>
                {pr.draft && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                    Draft
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 break-words group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {pr.title}
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span className="font-medium">{pr.user.login}</span>
                <span>•</span>
                <span className="font-mono text-xs">
                  {pr.head.ref} → {pr.base.ref}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                  <span>+{pr.additions ?? 0}</span>
                </span>
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                  <span>-{pr.deletions ?? 0}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <span>{pr.changed_files ?? 0}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                {pr.check_status === "success" && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {pr.check_status === "pending" && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
                {pr.check_status === "failure" && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              {pr.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {pr.labels.map((label) => (
                    <span
                      key={label.name}
                      className="px-2.5 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: `#${label.color}25`,
                        color: `#${label.color}`,
                        border: `1px solid #${label.color}40`,
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
