{
  pkgs ? import ./pkgs.nix
}:

with pkgs;
let
  nodeVersion = "12";
  drv = callPackage ./default.nix {};
in
  drv.overrideAttrs (attrs: {
    src = null;
    nativeBuildInputs = [
      nodePackages.node2nix
      electron_9
      unzip
      wine
      p7zip # Insecure package but needed for electron-builder
    ] ++ (lib.attrByPath [ "nativeBuildInputs" ] [] attrs);
    shellHook = ''
      echo 'Entering ${attrs.name}'
      set -o allexport
      . ./.env
      set +o allexport
      set -v

      export PATH="$(pwd)/dist/bin:$(npm bin):$PATH"

      # setting up for nix-build
      npm install --package-lock-only

      mkdir --parents "$(pwd)/nix/generated"
      node2nix -d \
        --input package.json \
        --lock package-lock.json \
        --node-env ./nix/generated/node-env.nix \
        --output ./nix/generated/node-packages.nix \
        --composition ./nix/generated/node-composition.nix \
        --nodejs-${nodeVersion}

      mkdir --parents "$(pwd)/tmp"

      set +v
    '';
  })
