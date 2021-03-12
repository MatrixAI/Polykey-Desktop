{ pkgs ? import ./pkgs.nix {} }:

with pkgs;
let
  utils = callPackage ./utils.nix {};
  buildDeb = arch:
    stdenv.mkDerivation rec {
      name = "${utils.basename}-${version}-linux-${arch}.deb";
      version = utils.node2nixDev.version;
      src = "${utils.node2nixDev}/lib/node_modules/${utils.node2nixDev.packageName}";
      buildInputs = [
        nodePackages."@electron-forge/cli"
        dpkg
        fakeroot
      ];
      electron_zip_dir = utils.electronZipDir;
      # DEBUG = "*" # uncomment to see electron-forge debug logs
      buildPhase = ''
        # skip check for node, npm and git
        mkdir home
        touch home/.skip-forge-system-check
        export HOME="$(realpath home)"
        cp ${./package.json} package.json
        cp ${./forge.config.js} forge.config.js
        electron-forge make \
          --arch ${arch} \
          --platform linux \
          --targets @electron-forge/maker-deb
      '';
      installPhase = ''
        cp out/make/deb/${arch}/*.deb $out
      '';
    };
  buildRpm = arch:
    let
      builtRpm = vmTools.runInLinuxVM (stdenv.mkDerivation rec {
        memSize = 2048; # 2 GiB for the VM
        name = "${utils.basename}-${version}-linux-${arch}.rpm";
        version = utils.node2nixDev.version;
        src = "${utils.node2nixDev}/lib/node_modules/${utils.node2nixDev.packageName}";
        buildInputs = [
          nodePackages."@electron-forge/cli"
          rpm
        ];
        electron_zip_dir = utils.electronZipDir;
        # DEBUG = "*" # uncomment to see electron-forge debug logs
        buildPhase = ''
          # skip check for node, npm and git
          mkdir home
          touch home/.skip-forge-system-check
          export HOME="$(realpath home)"
          cp ${./package.json} package.json
          cp ${./forge.config.js} forge.config.js
          electron-forge make \
            --arch ${arch} \
            --platform linux \
            --targets @electron-forge/maker-rpm
        '';
        installPhase = ''
          cp out/make/rpm/${arch}/*.rpm $out
        '';
        dontFixup = true;
      });
    in
      runCommand builtRpm.name { version = builtRpm.version; } ''
        cp ${builtRpm}/* $out
      '';
  buildExe = arch:
    stdenv.mkDerivation rec {
      name = "${utils.basename}-${version}-win32-${arch}.exe";
      version = utils.node2nixDev.version;
      src = "${utils.node2nixDev}/lib/node_modules/${utils.node2nixDev.packageName}";
      buildInputs = [
        nodePackages."@electron-forge/cli"
        wineWowPackages.full
        mono
      ];
      electron_zip_dir = utils.electronZipDir;
      # DEBUG = "*" # uncomment to see electron-forge debug logs
      buildPhase = ''
        # wine needs a home
        mkdir home
        # skip check for node, npm and git
        touch home/.skip-forge-system-check
        export HOME="$(realpath home)"
        cp ${./package.json} package.json
        cp ${./forge.config.js} forge.config.js
        electron-forge make \
          --arch ${arch} \
          --platform win32 \
          --targets @electron-forge/maker-squirrel
      '';
      installPhase = ''
        cp out/make/squirrel.windows/${arch}/*.exe $out
      '';
    };
  buildZip = arch:
    stdenv.mkDerivation rec {
      name = "${utils.basename}-${version}-darwin-${arch}.zip";
      version = utils.node2nixDev.version;
      src = "${utils.node2nixDev}/lib/node_modules/${utils.node2nixDev.packageName}";
      buildInputs = [
        nodePackages."@electron-forge/cli"
        zip
      ];
      electron_zip_dir = utils.electronZipDir;
      # DEBUG = "*" # uncomment to see electron-forge debug logs
      buildPhase = ''
        # skip check for node, npm and git
        mkdir home
        touch home/.skip-forge-system-check
        export HOME="$(realpath home)"
        cp ${./package.json} package.json
        cp ${./forge.config.js} forge.config.js
        electron-forge make \
          --arch ${arch} \
          --platform darwin \
          --targets @electron-forge/maker-zip
      '';
      installPhase = ''
        cp out/make/zip/darwin/${arch}/*.zip $out
      '';
    };
in
  rec {
    application = callPackage ./default.nix {};
    docker = dockerTools.buildImage {
      name = application.name;
      contents = [ application ];
      keepContentsDirlinks = true;
      extraCommands = ''
        mkdir -m 1777 tmp
      '';
      config = {
        Cmd = [ "/bin/${utils.basename}" ];
      };
    };
    package = {
      linux = {
        x64 = {
          deb = buildDeb "x64";
          rpm = buildRpm "x64";
        };
        ia32 = {
          deb = buildDeb "ia32";
          rpm = buildRpm "ia32";
        };
      };
      windows = {
        x64 = {
          exe = buildExe "x64";
        };
        ia32 = {
          exe = buildExe "ia32";
        };
      };
      darwin = {
        x64 = {
          zip = buildZip "x64";
        };
        arm64 = {
          zip = buildZip "arm64";
        };
      };
    };
  }
