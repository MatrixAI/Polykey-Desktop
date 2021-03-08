{ runCommandNoCC
, linkFarm
, nix-gitignore
, nodejs
, nodePackages
, pkgs
, lib
, fetchurl
}:

rec {
  basename = builtins.baseNameOf node2nixDev.packageName;
  src = nix-gitignore.gitignoreSource [".git"] ./.;
  nodeVersion = builtins.elemAt (lib.versions.splitVersion nodejs.version) 0;
  node2nixDrv = dev: runCommandNoCC "node2nix" {} ''
    mkdir $out
    ${nodePackages.node2nix}/bin/node2nix \
      ${lib.optionalString dev "--development"} \
      --input ${src}/package.json \
      --lock ${src}/package-lock.json \
      --node-env $out/node-env.nix \
      --output $out/node-packages.nix \
      --composition $out/default.nix \
      --nodejs-${nodeVersion}
  '';
  # the shell attribute has the nodeDependencies, whereas the package does not
  node2nixProd = (
    (import (node2nixDrv false) { inherit pkgs nodejs; }).shell.override {
      dontNpmInstall = true;
    }
  ).nodeDependencies;
  node2nixDev = (import (node2nixDrv true) { inherit pkgs nodejs; }).package.overrideAttrs (attrs: {
    buildInputs = attrs.buildInputs ++ [
      # needed to compile lzma-native
      nodePackages.node-pre-gyp
      nodePackages.rimraf
    ];
    src = src;
    dontNpmInstall = true;
    # prevent electron download from electron in package.json
    ELECTRON_SKIP_BINARY_DOWNLOAD = "1";
    postInstall = ''
      # The dependencies were prepared in the install phase
      # See `node2nix` generated `node-env.nix` for details.
      npm run build

      # This call does not actually install packages. The dependencies
      # are present in `node_modules` already. It creates symlinks in
      # $out/lib/node_modules/.bin according to `bin` section in `package.json`.
      npm install
    '';
  });
  electronVersion = "12.0.0";
  electronBuilds = {
    "12.0.0" = {
      "shasum256" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/SHASUMS256.txt";
        sha256 = "07xxam8dvn1aixvx39gd5x3yc1bs6i599ywxwi5cbkpf957ilpcx";
      };
      "linux-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-linux-x64.zip";
        sha256 = "1wciz9bzzng390iw49l3g64c6pjmq8mvfp526qz7h3jh107ahcni";
      };
      "win32-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-win32-x64.zip";
        sha256 = "0xwhvm2z7d6qd0724dp7hj0vb3iicxkrmm4fx91kdz3sgsaddcaj";
      };
      "darwin-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-darwin-x64.zip";
        sha256 = "1hmglyq9ndw18s90b8kwizh21f7vhny00bkng6kd2qyc1vn6sm0q";
      };
    };
  };
  electronZipDir =
    let
      electronBuild = electronBuilds."${electronVersion}";
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
        ];
  electronBuildsCache =
    let
      electronBuild = electronBuilds."${electronVersion}";
    in
      runCommandNoCC
        "electron-builds-cache"
        {}
        ''
        mkdir $out;
        build="$(
          printf 'https://github.com/electron/electron/releases/download/v${electronVersion}' \
          | sha256sum \
          | cut -d' ' -f1
        )"
        mkdir $out/$build
        ln -s ${electronBuild.shasum256} $out/$build/${electronBuild.shasum256.name}
        ln -s ${electronBuild.linux-x64} $out/$build/${electronBuild.linux-x64.name}
        ln -s ${electronBuild.win32-x64} $out/$build/${electronBuild.win32-x64.name}
        ln -s ${electronBuild.darwin-x64} $out/$build/${electronBuild.darwin-x64.name}
        '';
}
