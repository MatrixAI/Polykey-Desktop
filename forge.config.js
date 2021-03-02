const isWin = process.platform === 'win32';
const isDarwin = process.platform === 'darwin';

let packagerConfig = {};
const makers = [];

if (isWin) {
  packagerConfig = {
    asar: true,
    icon: 'icons/icons/win/icon.ico'
  };
  makers.push({
    name: '@electron-forge/maker-squirrel',
    config: {}
  });
}

if (isDarwin) {
  const { OSX_IDENTITY, OSX_APPLE_ID, OSX_APPLE_ID_PASSWORD } = process.env;

  packagerConfig = {
    osxSign: {
      identity: OSX_IDENTITY,
      'hardened-runtime': true,
      entitlements: 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
      'signature-flags': 'library'
    },
    osxNotarize: {
      appleId: OSX_APPLE_ID,
      appleIdPassword: OSX_APPLE_ID_PASSWORD
    },
    icon: 'icons/icons/mac/icon.icns'
  };

  makers.push({
    name: '@electron-forge/maker-dmg',
    config: {
      background: './static/logo-big.png',
      format: 'ULFO'
    }
  });
}

module.exports = {
  packagerConfig,
  makers
};
