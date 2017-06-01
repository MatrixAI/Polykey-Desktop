with import <nixpkgs> {};
(pkgs.python35.withPackages (ps: [
ps.pygpgme
ps.pygit2
])).env
