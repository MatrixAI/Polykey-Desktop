import os from 'os'
function getDefaultNodePath(prefix = '.polykey'): string {
  const platform = os.platform()
  let p
  if (platform === 'linux') {
    const homeDir = os.homedir()
    const dataDir = process.env.XDG_DATA_HOME
    if (dataDir != null) {
      p = `${dataDir}/${prefix}`
    } else {
      p = `${homeDir}/.local/share/${prefix}`
    }
  } else if (platform === 'darwin') {
    const homeDir = os.homedir()
    p = `${homeDir}/Library/Application Support/${prefix}`
  } else if (platform === 'win32') {
    const homeDir = os.homedir()
    const appDataDir = process.env.LOCALAPPDATA
    let p
    if (appDataDir != null) {
      p = `${appDataDir}/${prefix}`
    } else {
      p = `${homeDir}/AppData/Local/${prefix}`
    }
  }
  return p
}

export { getDefaultNodePath }
