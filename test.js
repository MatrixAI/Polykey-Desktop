
const { app, BrowserWindow } = require('electron');
const process = require('process');


const argv = process.argv.slice(2);
console.log(argv);

app.on('ready', () => {
  // const window = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  // });

  // const window2 = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  // });

  // window.close();
  // app.quit();
});
