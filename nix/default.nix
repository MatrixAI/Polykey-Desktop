# Adapted from https://github.com/NixOS/nixpkgs/pull/86169/commits/5e1cf2dbc31ad4fffa3e019b33f696da76eefcbe

{ lib
, system
, stdenv
, fetchgit
, fetchurl
, fetchFromGitHub
, makeDesktopItem
, makeWrapper
, runCommand
, writeTextFile
, electron_9
, electron-chromedriver_3 ? null
, gifsicle
, jq
, libwebp
, mozjpeg
, nix-gitignore
, nodejs-12_x
, nodePackages
, optipng
, gnutar
, pngquant
, python2
, utillinux
, darwin
, xcbuild
, bash
, symlinkJoin
, callPackage
} @ args:

let
  electron = electron_9;

  # Optimize the final space taken by our derivation
  # by feeding electron builder with a tree of symlink
  # instead of real file.
  # It seem to effectively copy these symlink whenever no
  # changes are made to the file.
  symlinkedElectron = symlinkJoin {
    name = "symlinked-electron";
    paths = [ electron ];
  };

  # We found no sensible way to control electron-builder's
  # unpacked dir output location. We thus need way to
  # match what it will be on a per platform basis.
  electronBuilderUnpackedDirname =
    let
      platform = stdenv.hostPlatform.system;
      p2dn = {
        i686-linux = "linux-ia32-unpacked";
        x86_64-linux = "linux-unpacked";
        armv7l-linux = "linux-armv7l-unpacked";
        aarch64-linux = "linux-arm64-unpacked";
        x86_64-darwin = "mac";
      };
    in
    assert p2dn ? "${platform}";
    p2dn."${platform}";

in

stdenv.mkDerivation rec {
  pname = "polykey";
  version = "0.0.1";
  name = "${pname}-${version}";

  nativeBuildInputs = [
    makeWrapper
    nodejs-12_x
  ];

  src = ../.;

  nodeDeps = (import ./node-dependencies.nix {
    inherit system;
    pkgs = args // { inherit electron-chromedriver_3; };
    polykey-src = src;
  }).package;

  buildInputs = [
    electron
  ] ++ stdenv.lib.optionals stdenv.isDarwin [ xcbuild darwin.DarwinTools ];

  # TODO: Fix buildphase
  buildPhase = ''
    dev_node_modules="${nodeDeps}/lib/node_modules/${pname}/node_modules"
    rm -rf ./node_modules
    ln -s -t "." "$dev_node_modules"
    export PATH="$dev_node_modules/.bin:$PATH"
    # Expansion of 'npm run build'.
    electron-webpack
  '';

  # doCheck = true;

  # checkPhase = ''
  #   # Expansion of 'npm run release:check'.
  #   tslint '{src,test,mocks}/**/*.{ts,tsx,js,jsx}' --project ./tsconfig.json
  #   jest --testRegex '\.test\.tsx?$'
  # '';

  installPhase = ''
    declare out_elec_bundle_dir="$out/lib/${pname}"
    declare out_elec_exe="$out_elec_bundle_dir/${pname}"
    declare out_elec_asar="$out_elec_bundle_dir/resources/app.asar"

    mkdir -p "$(dirname "$out_elec_bundle_dir")"
    declare unpacked_bundle_dir="$PWD/dist/${electronBuilderUnpackedDirname}"

    # Linux electron-builder pass reusing existing nixpkgs electron build
    # and optimized to prevent files copies whenever possible (see '
    # symlinkedElectron').
    # Note that from what I can see to date, nothing we could not
    # easily replace without 'electron-builder'.
    # It simply:
    # -  creates an asar of the dist / build folder
    # -  rename the some electron files to our app's name
    # -  rm the existing default asar
    # -  copy its asar to the expected location
    declare nix_elec_path="${symlinkedElectron}/lib/electron"
    declare nix_elec_v
    nix_elec_v="${electron.version}"
    electron-builder build --dir --linux -c.electronVersion="$nix_elec_v" -c.electronDist="$nix_elec_path"

    mv "$unpacked_bundle_dir" "$out_elec_bundle_dir"
    wrapProgram "$out_elec_exe" --add-flags "'$out_elec_asar'"

    # Linux only.
    mkdir -p "$out/bin"

    # For exposing the polykey cli
    mv "$PWD/node_modules" "$out/lib/"
    declare target="$(readlink -f "$out/lib/node_modules")"
    ln -s -T "$target/js-polykey/bin/polykey" "$out/bin/pk"
    ln -s -T "$target/js-polykey/bin/polykey" "$out/bin/polykey-cli"
    rm -r "$out/lib/node_modules"

    ln -s -t "$out/bin" "$out_elec_exe"
  '';

  desktopItem = makeDesktopItem {
    name = pname;
    desktopName = pname;
    genericName = "Graphical user interface to PolyKey";
    icon = pname;
    exec = pname;
    categories = "Utility;";
  };

  passthru = {
    inherit nodeDeps;
    nixifyNodeDeps = runCommand "nixify-node-deps" {
        nativeBuildInputs = [ makeWrapper ];
      } ''
      makeWrapper "${bash}/bin/bash" "$out" \
        --add-flags "'${./nixify-node-deps.sh}' ${src}" \
        --prefix PATH : "${nodePackages.node2nix}/bin"
    '';
  };

  meta = {
    description = "Graphical user interface to PolyKey";
    homepage = "https://github.com/codecentric/gopass-ui";
    license = lib.licenses.agpl3;
    maintainers = with lib.maintainers; [ CMCDragonkai robert-cronin ];
    platforms = [ "x86_64-darwin" "x86_64-linux" "i686-linux" "armv7l-linux" "aarch64-linux" ];
  };
}
