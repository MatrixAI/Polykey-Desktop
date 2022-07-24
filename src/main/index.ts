import { app, BrowserWindow } from 'electron';
import process from 'process';

// const createMainWindow = () => {
// };

// even if ts-node is used on the main process
// that doesn't change the fact that the "loader"
// will be affected
// BUT I AM still confused HOW
// does the index.html end up running the "renderer" process

let mainWindow: BrowserWindow;

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
}

/**
 * Main function
 * This function returns, but the process is still alive
 * All this function does is do initial setup
 * The lifetime is maintained by Electron itself
 */
async function main(argv = process.argv): Promise<void> {
  argv = argv.slice(2);

  console.log(argv);

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows
  // Some APIs can only be used after this event occurs
  app.on('ready', createMainWindow);

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

}

void main();
