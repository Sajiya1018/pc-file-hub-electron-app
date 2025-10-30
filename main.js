//
// 1. --- main.js (සම්පූර්ණ Code එක) ---
//
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const ip = require('ip');

let serverProcess;
let win;

// Server එක Ready වෙනකල් Retry කරන Function එක
const loadAppUrl = () => {
  if (!win) return;
  
  win.loadURL('http://localhost:5000')
    .catch(err => {
      if (err.code === 'ERR_CONNECTION_REFUSED') {
        console.log('Server එක තවම start වෙනවා... තත්පර 0.5කින් ආයෙ try කරනවා...');
        setTimeout(loadAppUrl, 500);
      } else {
        console.error('URL එක load කරන්න බැරි උනා:', err.message);
      }
    });
};

// React App එකෙන් කතා කරාම, IP එක හොයලා දෙන function එක
ipcMain.handle('get-ip-address', () => {
  const serverPort = 5000;
  const networkIp = ip.address();
  const connectUrl = `http://${networkIp}:${serverPort}`;
  return connectUrl;
});

function createWindow() {
  // Server එක Run කරමු
  serverProcess = fork(path.join(__dirname, 'file-server/server.js'));
  console.log('Node.js Server එක ආරම්භ විය...');

  // App Window එක හදමු
  win = new BrowserWindow({
    width: 840,       // <-- Size එක UI එකට ගැලපෙන්න හැදුවා
    height: 750,
    minWidth: 800,
    minHeight: 600,
    // --- මෙන්න මේක තමයි වැදගත්ම දේ ---
    // 'පාලම' (preload) හදන තැන
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    // --- webPreferences ඉවරයි ---
  });

  // UI එක Load කරමු
  loadAppUrl();

  // DevTools (Error බලන්න ඕන නම් මේක uncomment කරන්න)
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  console.log('Window වැසී ගියා. Server එක නවත්වනවා...');
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});