"use client";

import { useState, useEffect } from "react";
import ConfigForm from "@/components/ConfigForm";
import Dashboard from "@/components/Dashboard";
import { getConfigStorage } from "@/lib/storage";

export default function Home() {
  const [config, setConfig] = useState<{
    owner: string;
    repo: string;
    token: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved config on mount
  useEffect(() => {
    const loadConfig = async () => {
      const storage = getConfigStorage();
      const savedConfig = await storage.load();
      if (savedConfig) {
        setConfig(savedConfig);
      }
      setIsLoading(false);
    };
    loadConfig();
  }, []);

  const handleConfigSubmit = async (newConfig: {
    owner: string;
    repo: string;
    token: string;
  }) => {
    // Save config to storage
    const storage = getConfigStorage();
    await storage.save(newConfig);
    setConfig(newConfig);
  };

  const handleReset = () => {
    setConfig(null);
  };

  // Show loading state while checking for saved config
  if (isLoading) {
    return (
      <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

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
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Vibe Monitor</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Monitor your GitHub repository activity in real-time
        </p>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Configure Repository</h2>
          <ConfigForm onSubmit={handleConfigSubmit} initialConfig={config} />
        </div>

        <div className="mt-8 p-4 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Getting Started</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
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
            <li>Grant <code className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1 py-0.5 rounded">repo</code> and <code className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1 py-0.5 rounded">workflow</code> scopes</li>
            <li>Enter your repository details and token above</li>
            <li>Start monitoring!</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
