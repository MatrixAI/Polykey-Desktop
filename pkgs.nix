import (
  let rev = "dcb64ea42e64aaecd8e6fef65cc86245c9666818"; in
  fetchTarball "https://github.com/NixOS/nixpkgs-channels/archive/${rev}.tar.gz"
) {}
