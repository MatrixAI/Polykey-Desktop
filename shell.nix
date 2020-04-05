{
  pkgs ? import ./pkgs.nix,
  nodeVersion ? "8_x",
}:
  with pkgs;
  let
    drv = import ./default.nix { inherit pkgs nodeVersion; };
    nodePackages = lib.getAttrFromPath
                   (lib.splitString "." ("nodePackages_" + nodeVersion))
		   pkgs;
  in
    drv.overrideAttrs (attrs: {
      src = null;
      buildInputs = [ nodePackages.node2nix ] ++
                    attrs.buildInputs;
      shellHook = ''
        echo 'Entering ${attrs.name}'
        set -v

        export PATH="$(pwd)/dist/bin:$(npm bin):$PATH"

        set +v
      '';
    })
