import path from 'path';
import { promisifyGrpc } from './utils';
import setHandlers, { polykeyPath } from './setHandlers'
import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
import { app, BrowserWindow, Menu, Tray, shell } from "electron";
import { PolykeyAgent } from '@matrixai/polykey';

setHandlers()

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

// Make tray
let tray: Tray

function createWindow() {
  // Create the browser window.
  let window = new BrowserWindow({
    width: 800,
    height: 600,
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
  const logoPath = path.join(__static, 'logo.png')

  tray = new Tray(logoPath)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: () => {
        if (mainWindow === null) {
          mainWindow = createWindow()
          mainWindow.show()
        } else {
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
