import server from './server';
import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
import { app } from 'electron';
import WindowApp from './window';
import TrayComponent from './tray';

let mainWindow;
let tray;

// Initialize the server
server();

app.on('ready', () => {
  const windowApp = new WindowApp();
  const trayComponent = new TrayComponent();

  const newWindow = () => {
    mainWindow = windowApp.createWindow();
    trayComponent.setMainWindow(mainWindow);
    trayComponent.attachRecreateWindow(newWindow);
    tray = trayComponent.createMenu();
    return mainWindow;
  };

  newWindow();
});

// quit the app once closed
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
