const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { getVideoMetadata, convertVideo } = require('./utils/videoHelper');

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

ipcMain.on('conversion:start', (event, videos) => {
  videos.forEach(video => {
    convertVideo(
      video, 
      (outputPath) => {
        mainWindow.webContents.send('conversion:end', { video, outputPath });
      },
      (timemark) => {
        mainWindow.webContents.send('conversion:progress', { video, timemark });
      }
    );
  });
});

ipcMain.on('folder:open', (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});
