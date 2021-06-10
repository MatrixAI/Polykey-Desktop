import fs from 'fs';
import path from 'path';
import { app, Menu, BrowserWindow, Tray } from 'electron';

import { polykeyPath } from './server';

type CreateWinow = () => BrowserWindow;

export default class TrayComponent {
  public mainWindow: BrowserWindow | null = null;
  public createWindow!: CreateWinow;
  public tray!: Tray;

  setMainWindow(mainWindow) {
    this.mainWindow = mainWindow;
  }

  attachRecreateWindow(createWindow) {
    this.createWindow = createWindow;
  }

  createMenu() {
    const dirname = path.dirname(__filename);
    const prodPath = path.join(dirname, 'static', 'logo.png');
    const devPath = path.join('..', '..', 'static', 'logo.png');
    if (fs.existsSync(prodPath)) {
      this.tray = new Tray(prodPath);
    } else if (fs.existsSync(devPath)) {
      this.tray = new Tray(devPath);
    } else {
      throw Error('logo not found');
    }

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: this.showApp.bind(this),
      },
      {
        label: 'Kill Agent',
        click: this.killAgent.bind(this),
      },
      {
        label: 'Quit App',
        click: this.quitApp.bind(this),
      },
    ]);

    this.tray.setContextMenu(contextMenu);

    return this.tray;
  }

  showApp() {
    if (this.mainWindow !== null) {
      this.createWindow();
    }
  }

  async killAgent() {
    // kill polykey-agent process
    try {
      // const client = PolykeyAgent.connectToAgent(polykeyPath);
      // const successful = await promisifyGrpc(client.stopAgent.bind(client))(
      //   new pb.EmptyMessage(),
      // );
      // eslint-disable-next-line no-constant-condition
      if (true /*successful*/) {
        console.log('agent has been stopped');
      } else {
        console.log('agent could not be stopped');
      }
    } catch (error) {
      console.log('agent could not be stopped');
    }
    app.quit();
    this.tray.destroy();
  }

  quitApp() {
    app.quit();
    this.tray.destroy();
  }
}
