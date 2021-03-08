{ pkgs ? import ./pkgs.nix {} }:

with pkgs;
pkgs.mkShell {
  nativeBuildInputs = [
    nodejs
    nodePackages.node2nix
    # electron is also installed in package.json
    # electron-forge demands this
    # but we make nix electron priority
    electron
    nodePackages."@electron-forge/cli"
    dpkg
    fakeroot
    rpm
    wineWowPackages.full
    mono
    zip
  ];
  # prevent electron download from electron in package.json
  ELECTRON_SKIP_BINARY_DOWNLOAD = "1";
  shellHook = ''
    echo 'Entering Polykey'
    set -o allexport
    . ./.env
    set +o allexport
    set -v

    export PATH="${electron}/bin:$(pwd)/dist/bin:$(npm bin):$PATH"
    npm install
    mkdir --parents "$(pwd)/tmp"

    # needed to use fakeroot
    # otherwise the electron-forge complains
    # umask 022

    set +v
  '';
}
