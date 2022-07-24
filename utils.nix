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
  electronVersion = "12.0.9";
  electronBuilds = {
    "12.0.9" = {
      "linux-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.9/electron-v12.0.9-linux-x64.zip";
        sha256 = "0vbg2b1lr7l2l2f6b3vr40wq8mmrv3wipjp6ribbzlr0yxrsic1s";
      };
      "linux-ia32" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.9/electron-v12.0.9-linux-ia32.zip";
        sha256 = "1rn6ws7gqd2wb3rdh2lajmn1574n1mzjshxfqcbx96kp4wxmnh1p";
      };
      "win32-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.9/electron-v12.0.9-win32-x64.zip";
        sha256 = "0x62k8adc372d22zx4f32msccfpddl74ccfmvdbipn8283wzis9s";
      };
      "win32-ia32" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.9/electron-v12.0.9-win32-ia32.zip";
        sha256 = "0v9rqr1y5516mwk8lpwn5d11rcrv234529nfg3b826q797b1ylbr";
      };
      "darwin-x64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.9/electron-v12.0.9-darwin-x64.zip";
        sha256 = "0wn86xbrddlh0zmy2x3rh9vh4dywb94a7iai8jskcz4fymwf7wdk";
      };
      "darwin-arm64" = fetchurl {
        url = "https://github.com/electron/electron/releases/download/v12.0.9/electron-v12.0.9-darwin-arm64.zip";
        sha256 = "1sys643ng4bj65kxhlhibcs1f0mgar6p3sw22600vsh560asi2nb";
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
