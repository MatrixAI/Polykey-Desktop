
with import ( builtins.fetchGit {
  url = "https://github.com/nixos/nixpkgs-channels/";
  rev = "dcb64ea42e64aaecd8e6fef65cc86245c9666818";

}) {};

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
