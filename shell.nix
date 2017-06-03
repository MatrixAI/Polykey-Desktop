{ pkgs ? import <nixpkgs> { inherit system; }, system ? builtins.currentSystem }:
  let
    # this exposes 3 overridable attributes: shell, package, tarball
    nodeEnv = import ./node.nix { inherit pkgs system; };
  in
    # override the shell attribute with an extra build input, which is node2nix
    nodeEnv // (with pkgs; {
      shell = nodeEnv.shell.override (oldAttrs: {
        buildInputs = oldAttrs.buildInputs ++ [
          nodePackages.node2nix
        ];
        shellHook = oldAttrs.shellHook + ''
          export PATH="$NODE_PATH/.bin:$PATH"
        '';
      });
    })
