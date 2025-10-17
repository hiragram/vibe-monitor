"use client";

import { useState } from "react";
import ConfigForm from "@/components/ConfigForm";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [config, setConfig] = useState<{
    owner: string;
    repo: string;
    token: string;
  } | null>(null);

  const handleConfigSubmit = (newConfig: {
    owner: string;
    repo: string;
    token: string;
  }) => {
    setConfig(newConfig);
  };

  const handleReset = () => {
    setConfig(null);
  };

  if (config) {
    return (
      <Dashboard
        owner={config.owner}
        repo={config.repo}
        token={config.token}
        onReset={handleReset}
      />
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Vibe Monitor</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Monitor your GitHub repository activity in real-time
        </p>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Configure Repository</h2>
          <ConfigForm onSubmit={handleConfigSubmit} />
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold mb-2">Getting Started</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>
              Create a{" "}
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub Personal Access Token
              </a>
            </li>
            <li>Grant <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">repo</code> and <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">workflow</code> scopes</li>
            <li>Enter your repository details and token above</li>
            <li>Start monitoring!</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
