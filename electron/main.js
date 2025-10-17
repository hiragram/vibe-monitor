const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

let mainWindow;
let nextDevReady = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#f8fafc',
  });

  // In development, wait for Next.js dev server
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built Next.js app
    mainWindow.loadURL(`file://${path.join(__dirname, '../out/index.html')}`);
  }

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Allow navigation within the app (localhost in dev, file:// in production)
    if (isDev && url.startsWith('http://localhost:3000')) {
      return;
    }
    if (!isDev && url.startsWith('file://')) {
      return;
    }

    // Open external URLs in the default browser
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Wait for Electron to be ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
