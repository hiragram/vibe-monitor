const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  config: {
    save: (config) => ipcRenderer.invoke('config:save', config),
    load: () => ipcRenderer.invoke('config:load'),
    clear: () => ipcRenderer.invoke('config:clear'),
  },
});
