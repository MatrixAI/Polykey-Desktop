{ pkgs ? import ./pkgs.nix }:
with pkgs;
let
in
  rec {
    application = callPackage ./nix/default.nix {};
    docker = dockerTools.buildImage {
      name = application.name;
      contents = [ application bash ];
      extraCommands = ''
        mkdir -m 1777 tmp
      '';
      config = {
        Cmd = [
          "/bin/polykey"
        ];
      };
    };
  }
