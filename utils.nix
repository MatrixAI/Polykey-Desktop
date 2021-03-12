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
      --strip-optional-dependencies \
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
      "linux-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-linux-x64.zip";
        sha256 = "1wciz9bzzng390iw49l3g64c6pjmq8mvfp526qz7h3jh107ahcni";
      };
      "linux-ia32" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-linux-ia32.zip";
        sha256 = "10wl7c8vmylrn63md13024skikz2yx3361ddqrhciy2px0v1hrbr";
      };
      "win32-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-win32-x64.zip";
        sha256 = "0xwhvm2z7d6qd0724dp7hj0vb3iicxkrmm4fx91kdz3sgsaddcaj";
      };
      "win32-ia32" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-win32-ia32.zip";
        sha256 = "0pdfikcmwl7amm0gij0asn61widfdrqrb8f4gy53h2a75zh4j7nj";
      };
      "darwin-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-darwin-x64.zip";
        sha256 = "1hmglyq9ndw18s90b8kwizh21f7vhny00bkng6kd2qyc1vn6sm0q";
      };
      "darwin-arm64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.0/electron-v12.0.0-darwin-arm64.zip";
        sha256 = "17nn5rg4rf1y9rn7hf1bmmlr6dc9vqfd8ypv82kghh2lhm25hlf6";
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
            name = "${electronBuild.linux-ia32.name}";
            path = electronBuild.linux-ia32;
          }
          {
            name = "${electronBuild.win32-x64.name}";
            path = electronBuild.win32-x64;
          }
          {
            name = "${electronBuild.win32-ia32.name}";
            path = electronBuild.win32-ia32;
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
