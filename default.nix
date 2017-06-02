{ pkgs ? import <nixpkgs> { inherit system; }, system ? builtins.currentSystem }:
  let
    # this exposes 3 overridable attributes: shell, package, tarball
    nodeEnv = import ./node.nix { inherit pkgs system; };
  in
    # override the shell attribute with an extra build input, which is node2nix
    nodeEnv // (with pkgs; {
      shell = nodeEnv.shell.override (oldAttrs: {
        buildInputs = oldAttrs.buildInputs ++ [
          # add extra build inputs (existing) at the build phase
          # as necessary, here we can add any nix packages
          nodePackages.node2nix
        ];
      });
    })
