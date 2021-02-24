import { BrowserWindow } from 'electron';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default class WindowApp {
  public mainWindow!: BrowserWindow | null;

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 900,
      height: 700,
      // icon: prodPath,
      // frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    /** Load the vuew app */
    this.mainWindow.loadFile('dist/index.html');

    /** Attach listeners */
    console.log('attaching listenere');
    this.mainWindow.on('close', this.close.bind(this));
    this.mainWindow.on('minimize', this.minimize.bind(this));

    if (isDevelopment) {
      this.mainWindow.webContents.openDevTools();
    }

    return this.mainWindow;
  }

  close(event) {
    event.preventDefault();
    console.log('closing', this.mainWindow);
    if (this.mainWindow) {
      this.mainWindow.hide();
      this.mainWindow = null;
    }
  }

  minimize(event) {
    event.preventDefault();
    this.mainWindow?.hide();
  }
}
