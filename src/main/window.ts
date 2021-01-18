import { BrowserWindow } from 'electron';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default class WindowApp {
  public mainWindow!: BrowserWindow | null;

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 900,
      height: 700,
      // frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    /** Load the vuew app */
    this.mainWindow.loadFile('dist/index.html');

    /** Attach listeners */
    this.mainWindow.on('close', this.close.bind(this));
    this.mainWindow.on('minimize', this.minimize.bind(this));

    if (isDevelopment) {
      this.mainWindow.webContents.openDevTools();
    }

    return this.mainWindow;
  }

  close(event) {
    event.preventDefault();
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
