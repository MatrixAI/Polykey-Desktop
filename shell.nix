{ pkgs ? import ./pkgs.nix {}, ci ? false }:

with pkgs;
let
  utils = callPackage ./utils.nix {};
in
  pkgs.mkShell {
    nativeBuildInputs = [
      nodejs
      shellcheck
      # electron
      electron
      # debian builds
      dpkg
      fakeroot
      # rpm builds
      rpm
      # exe builds
      wineWowPackages.full
      mono
      # zip builds
      zip
      # github releases
      gitAndTools.gh
    ];
    # prevent electron download from electron in package.json
    ELECTRON_SKIP_BINARY_DOWNLOAD = "1";
    # use the electron builds from here
    electron_zip_dir = utils.electronZipDir;
    shellHook = ''
      echo "Entering $(npm pkg get name)"
      set -o allexport
      . ./.env
      set +o allexport
      set -v
      ${
        lib.optionalString ci
        ''
        set -o errexit
        set -o nounset
        set -o pipefail
        shopt -s inherit_errexit
        ''
      }
      mkdir --parents "$(pwd)/tmp"

      # Built executables and NPM executables
      export PATH="$(pwd)/dist/bin:$(npm bin):$PATH"

      # Override `electron` as a development dependency
      export PATH="${lib.makeBinPath
        [
          electron
        ]
      }:$PATH"

      npm install --ignore-scripts

      # force 022 when using fakeroot
      umask 022

      set +v
    '';
  }
