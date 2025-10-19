interface Config {
  owner: string;
  repo: string;
  token: string;
}

// Extend Window interface to include our Electron API
declare global {
  interface Window {
    electronAPI?: {
      config: {
        save: (config: Config) => Promise<{ success: boolean }>;
        load: () => Promise<Config | null>;
        clear: () => Promise<{ success: boolean }>;
      };
    };
  }
}

// Storage interface using Electron IPC
// Falls back to localStorage for browser development
class ConfigStorage {
  private isElectron(): boolean {
    return typeof window !== 'undefined' && window.electronAPI !== undefined;
  }

  async save(config: Config): Promise<void> {
    if (this.isElectron()) {
      // Use Electron IPC
      await window.electronAPI!.config.save(config);
    } else {
      // Fallback to localStorage for browser development
      if (typeof window !== 'undefined') {
        localStorage.setItem('vibe-monitor-config', JSON.stringify(config));
      }
    }
  }

  async load(): Promise<Config | null> {
    if (this.isElectron()) {
      // Use Electron IPC
      return await window.electronAPI!.config.load();
    } else {
      // Fallback to localStorage for browser development
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem('vibe-monitor-config');
        return data ? JSON.parse(data) : null;
      }
      return null;
    }
  }

  async clear(): Promise<void> {
    if (this.isElectron()) {
      // Use Electron IPC
      await window.electronAPI!.config.clear();
    } else {
      // Fallback to localStorage for browser development
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vibe-monitor-config');
      }
    }
  }
}

// Singleton instance
let storage: ConfigStorage | null = null;

export const getConfigStorage = (): ConfigStorage => {
  if (!storage) {
    storage = new ConfigStorage();
  }
  return storage;
};
