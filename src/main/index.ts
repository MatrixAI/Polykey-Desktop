// import server from './server';
// import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
// import { app } from 'electron';
// import WindowApp from './window';
// import TrayComponent from './tray';

// let mainWindow;
// let tray;

// // Initialize the server
// server();

// app.on('ready', () => {
//   const windowApp = new WindowApp();
//   const trayComponent = new TrayComponent();

//   const newWindow = () => {
//     /** Cleanup */
//     mainWindow = null;
//     mainWindow = windowApp.createWindow();
//     trayComponent.setMainWindow(mainWindow);
//     trayComponent.attachRecreateWindow(newWindow);

//     /** If tray is existing dont recreate */
//     if (!tray) {
//       tray = trayComponent.createMenu();
//     }

//     return mainWindow;
//   };

//   app.on('activate', (event, hasVisibleWindows) => {
//     if (!hasVisibleWindows) {
//       if (mainWindow !== null) {
//         newWindow();
//       }
//     }
//   });

//   newWindow();
// });

// // quit the app once closed
// app.on('window-all-closed', async () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });
import server from './server'
import * as pb from '@matrixai/polykey/proto/js/Agent_pb'
import { app, BrowserWindow } from 'electron'
import path from 'path'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

const createWindow = () => {
  server()
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile('dist/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
