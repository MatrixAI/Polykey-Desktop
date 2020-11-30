import fs from 'fs';
import path from 'path';
import { promisifyGrpc } from './utils';
import { PolykeyAgent } from '@matrixai/polykey';
import setHandlers, { polykeyPath } from './setHandlers'
import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
import { app, BrowserWindow, Menu, Tray, shell } from "electron";

setHandlers()

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

// Make tray
let tray: Tray

function createWindow() {
  // Create the browser window.
  let window = new BrowserWindow({
    width: 900,
    height: 700,
    // frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadFile('dist/index.html');

  window.on('close', function (event) {
    event.preventDefault()
    if (mainWindow) {
      mainWindow.hide()
      mainWindow = null
    }
  })

  window.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  window.on('minimize', function (event) {
    event.preventDefault()
    mainWindow?.hide()
  })

  if (isDevelopment) {
    window.webContents.openDevTools()
  }
  return window
}

function createTray() {
  const dirname = path.dirname(__filename)
  const prodPath = path.join(dirname, 'static', 'logo.png')
  const devPath = path.join('..', '..', 'static', 'logo.png')

  if (fs.existsSync(prodPath)) {
    tray = new Tray(prodPath)
  } else if (fs.existsSync(devPath)) {
    tray = new Tray(devPath)
  } else {
    throw Error('logo not found')
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: () => {
        if (mainWindow === null) {
          mainWindow = createWindow()
          mainWindow.show()
        } else {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      label: 'Kill Agent', click: async () => {
        // kill polykey-agent process
        try {
          const client = PolykeyAgent.connectToAgent(polykeyPath);
          const successful = await promisifyGrpc(client.stopAgent.bind(client))(new pb.EmptyMessage)
          if (successful) {
            console.log('agent has been stopped');
          } else {
            console.log('agent could not be stopped');
          }
        } catch (error) {
          console.log('agent could not be stopped');
        }
        app.quit()
        tray.destroy()
      }
    },
    {
      label: 'Quit App', click: () => {
        app.quit()
        tray.destroy()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
}

app.on('ready', () => {
  mainWindow = createWindow()

  createTray()
});

//quit the app once closed
app.on("window-all-closed", async () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});
