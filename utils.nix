{ runCommandNoCC
, linkFarm
, nix-gitignore
, nodejs
, nodePackages
, electron
, pkgs
, lib
, fetchurl
, fetchFromGitHub
}:

rec {
  # This removes the org scoping
  basename = builtins.baseNameOf node2nixDev.packageName;
  # Filter source to only what's necessary for building
  src = nix-gitignore.gitignoreSource [
    # The `.git` itself should be ignored
    ".git"
    # Hidden files
    "/.*"
    # Nix files
    "/*.nix"
    # Benchmarks
    "/benches"
    # Docs
    "/docs"
    # Tests
    "/tests"
    "/jest.config.js"
  ] ./.;
  nodeVersion = builtins.elemAt (lib.versions.splitVersion nodejs.version) 0;
  # Custom node2nix directly from GitHub
  node2nixSrc = fetchFromGitHub {
    owner = "svanderburg";
    repo = "node2nix";
    rev = "9377fe4a45274fab0c7faba4f7c43ffae8421dd2";
    sha256 = "15zip9w9hivd1p6k82hh4zba02jj6q0g2f1i9b7rrn2hs70qdlai";
  };
  node2nix = (import "${node2nixSrc}/release.nix" {}).package.x86_64-linux;
  node2nixDrv = dev: runCommandNoCC "node2nix" {} ''
    mkdir $out
    ${node2nix}/bin/node2nix \
      ${lib.optionalString dev "--development"} \
      --input ${src}/package.json \
      --lock ${src}/package-lock.json \
      --node-env $out/node-env.nix \
      --output $out/node-packages.nix \
      --composition $out/default.nix \
      --nodejs-${nodeVersion}
  '';
  node2nixProd = (import (node2nixDrv false) { inherit pkgs nodejs; }).nodeDependencies.override (attrs: {
    # Use filtered source
    src = src;
    # Do not run build scripts during npm rebuild and npm install
    npmFlags = "--ignore-scripts";
    # Do not run npm install, dependencies are installed by nix
    dontNpmInstall = true;
  });
  node2nixDev = (import (node2nixDrv true) { inherit pkgs nodejs; }).package.override (attrs: {
    buildInputs = attrs.buildInputs ++ [
      # needed to compile lzma-native
      nodePackages.node-pre-gyp
      nodePackages.rimraf
    ];
    # Use filtered source
    src = src;
    # Do not run build scripts during npm rebuild and npm install
    # They will be executed in the postInstall hook
    npmFlags = "--ignore-scripts";
    # Show full compilation flags
    NIX_DEBUG = 1;
    # Don't set rpath for native addons
    # Native addons do not require their own runtime search path
    # because they dynamically loaded by the nodejs runtime
    NIX_DONT_SET_RPATH = true;
    NIX_NO_SELF_RPATH = true;
    # Prevent electron download from electron in package.json
    ELECTRON_SKIP_BINARY_DOWNLOAD = "1";
    postInstall = ''
      # Path to headers used by node-gyp for native addons
      export npm_config_nodedir="${nodejs}"
      # This will setup the typescript build
      npm run build
    '';
  });
  electronBuilds = {
    "${electron.version}" = {
      "linux-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v${electron.version}/electron-v${electron.version}-linux-x64.zip";
        sha256 = "1flzjcxxhs1jj05ykmjvqfs7vvywshcjdw5qw9m3x176b2fhd5bz";
      };
      "win32-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v${electron.version}/electron-v${electron.version}-win32-x64.zip";
        sha256 = "1kky2rpch1vd4fgqfy6k31y36cibx4i2g5d1ghk8q23n4v6hwy0x";
      };
      "darwin-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v${electron.version}/electron-v${electron.version}-darwin-x64.zip";
        sha256 = "056bb4b8yalw5c3rib1zsc4fi63cv83hjmz5qm9ra342dfk69p94";
      };
      "darwin-arm64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v${electron.version}/electron-v${electron.version}-darwin-arm64.zip";
        sha256 = "0278r4y2y63i6r712hhkkafbgfbzby7zdpg9sc2b7cy90qrz3bcp";
      };
    };
  };
  electronZipDir =
    let
      electronBuild = electronBuilds."${electron.version}";
    in
      linkFarm "electron-zip-dir"
        [
          {
            name = "${electronBuild.linux-x64.name}";
            path = electronBuild.linux-x64;
          }
          {
            name = "${electronBuild.win32-x64.name}";
            path = electronBuild.win32-x64;
          }
          {
            name = "${electronBuild.darwin-x64.name}";
            path = electronBuild.darwin-x64;
          }
          {
            name = "${electronBuild.darwin-arm64.name}";
            path = electronBuild.darwin-arm64;
          }
        ];
}
