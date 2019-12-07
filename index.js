const { app, BrowserWindow, ipcMain } = require('electron');
const { getVideoMetadata } = require('./utils/videoHelper');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

ipcMain.on('videos:added', (event, videos) => {
  Promise.all(
    videos.map(video => getVideoMetadata(video))
  ).then(results => {
    mainWindow.webContents.send('metadata:complete', results);
  });
});
