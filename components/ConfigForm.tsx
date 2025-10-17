"use client";

import { useState } from "react";

interface ConfigFormProps {
  onSubmit: (config: { owner: string; repo: string; token: string }) => void;
}

export default function ConfigForm({ onSubmit }: ConfigFormProps) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (owner && repo && token) {
      onSubmit({ owner, repo, token });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <label
          htmlFor="owner"
          className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
        >
          Repository Owner
        </label>
        <input
          type="text"
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="octocat"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label
          htmlFor="repo"
          className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
        >
          Repository Name
        </label>
        <input
          type="text"
          id="repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="hello-world"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label
          htmlFor="token"
          className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
        >
          GitHub Personal Access Token
        </label>
        <input
          type="password"
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxx"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Token needs: <code className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1 py-0.5 rounded">repo</code> and{" "}
          <code className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1 py-0.5 rounded">workflow</code> scopes
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Start Monitoring
      </button>
    </form>
  );
}
