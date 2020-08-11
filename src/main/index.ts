
import url from 'url';
import path from 'path';
import { app, BrowserWindow, Menu, Tray, shell } from "electron";
import startModel from './startModel'

startModel()

const isDevelopment = process.env.NODE_ENV !== 'production'
console.log(process.env.NODE_ENV);


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








import WebRTC from 'electron-webrtc'
import twilio, { Twilio } from 'twilio'
const wrtc = WebRTC()

class NATBusting {
  private client: Twilio
  constructor() {
    // Your Account Sid and Auth Token from twilio.com/console
    // DANGER! This is insecure. See http://twil.io/secure
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.client = twilio(accountSid, authToken)
  }

  private async getToken() {
    return await this.client.tokens.create()
  }

  async createRTCPeerConnection() {
    const token = await this.getToken()
    console.log(token);
    console.log(token.iceServers);


    const iceServers: RTCIceServer[] = [...<any>token.iceServers]
    console.log(iceServers);

    console.log(RTCPeerConnection);

    const configuration: RTCConfiguration = {
      iceServers
    }





    // handle errors that may occur when trying to communicate with Electron
    wrtc.on('error', function (err) { console.log(err) })

    // uses the same API as the `wrtc` package
    const pc = new wrtc.RTCPeerConnection(configuration)

    // // compatible with `simple-peer`
    // const peer = new SimplePeer({
    //   initiator: true,
    //   wrtc: wrtc
    // })

    // // listen for errors
    // wrtc.on('error', function (err, source) {
    //   console.error(err)
    // })







    // const pc = new RTCPeerConnection(configuration)
    // const dataChannel = pc.createDataChannel('myLabel', {
    // })

    //     dataChannel.onerror = (error) => {
    //       console.log("Data Channel Error:", error);
    //     };

    //     dataChannel.onmessage = (event) => {
    //       console.log("Got Data Channel Message:", event.data);
    //     };

    //     dataChannel.onopen = () => {
    //       dataChannel.send("Hello World!");
    //     };

    //     dataChannel.onclose = () => {
    //       console.log("The Data Channel is Closed");
    //     };

  }



}


async function main() {
  const nb = new NATBusting()
  nb.createRTCPeerConnection()
  // var socket = require('socket.io-client')('http://localhost');
  // socket.on('connect', function(){});
  // socket.on('event', function(data){});
  // socket.on('disconnect', function(){});

}

main()
