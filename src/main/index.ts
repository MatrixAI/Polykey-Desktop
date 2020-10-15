
import url from 'url';
import path from 'path';
import { app, BrowserWindow, Menu, Tray, shell } from "electron";
import startModel from './startModel'

startModel()

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

// Make tray
let tray

function createWindow() {
  // Create the browser window.
  let window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

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

  // window.on('minimize', function (event) {
  //     event.preventDefault()
  //     mainWindow.hide()
  // })

  return window
}

// function createTray() {
//   const logoPath = path.join(__static, 'logo.png')

//   tray = new Tray(logoPath)

//   const contextMenu = Menu.buildFromTemplate([
//     {
//       label: 'Show App', click: function () {
//         mainWindow = createWindow()
//         mainWindow.show()
//       }
//     },
//     {
//       label: 'Quit', click: function () {
//         app.quit()
//       }
//     }
//   ])

//   tray.setContextMenu(contextMenu)
// }

app.on("ready", () => {
  mainWindow = createWindow()
  // createTray()
});


//quit the app once closed
app.on("window-all-closed", function () {
  if (process.platform != "darwin") {
    app.quit();
  }
});
