{ pkgs ? import <nixpkgs> {} }:
  with pkgs;
  stdenv.mkDerivation {
    name = "polykey";
    src = ./.;
    buildInputs = [ python2 nodejs nodePackages.node2nix ];
  }
