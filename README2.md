PolyKey
=======

https://github.com/benoitvallon/react-native-nw-react-calculator
https://github.com/open-keychain/open-keychain/wiki#internal-design-decisions
https://github.com/open-keychain/openpgp-api

First we need to look at how the app runs, and then see how to integrate libgit2 into the node code for electron, while also building off nexe to create a compiled cli executable as well.

flow - type checking
sweet - macros
prepack - supercompilation
styled-components - for styling!
react-router 4 - for routing: https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf

Electron app is for making GPG easier!!

Electron is based on 2 processes, a main process and a render process. There can be multiple render processes, and they all communicate over ipc. The main node process is where we will implement the native bindings to git and gpg. Git is via libgit2, and gpg is via gpgme.

* Node git bindings: https://github.com/nodegit/nodegit (supported: electron windows linux osx, unknown: ios, android)
* OpenPGP.js: https://github.com/openpgpjs/openpgpjs
* tar bindings: https://github.com/npm/node-tar 

Or.. direct openpgp implementation in javascript using OpenPGP.js and then we're not use gpgme bindings directly. Oh cool, I think it is actually compatible, then we can drop the gpg requirement, which makes it easier to deploy.


Secret folders need to be encrypted at rest, this requires them to be a tar file. But they also need to be a git repository, and git only works on real posix files.

One way is to use fuse, fuse on osx, and dokany, and port archivemount to all 3 platforms. This exposes a tar archive as a single folder. But this does not work in Android or iOS, another way is needed.

As a secret "track" is encrypted, it needs to be decrypted for usage when necessary. Can this decryption be performed safely? One way is to only decrypt in RAM, so no unencrypted contents ever is on disk. But this complicates the need for encrypted tar files. Perhaps an in-memory filesystem can be exposed to git directly?

It might be possible to expose a virtual filesystem to the git adapter in Nodejs, this would require a well implemented virtual filesystem that is compatible to all the posix features that git expects, and that the git system can work with a virtual filesystem. This means, we would tar and untar this virtual filesystem, and then encrypt it.

Leaving clear text in the filesystem is dangerous. This is called the decrypt -> edit -> encrypt cycle. So a decent password manager takes steps to store the data in locked pages and make sure its memory doesn't get swapped to disk. You can use mlock and mlockall which locks the memory from being swapped. However it seems this may not always be available in Android or iOS. I am not sure about this. On windows this is exposed as virtuallock. To access these syscalls, we need syscall vbindings. It appears there's some work on this including libjs and jskernel and jskernel-sys.

Shell controls must be careful, especially in the case of the CLI app. Output history isn't meant to be saved by the shell, but could be, but we can't really do anything about this. But we can make sure that password inputs are also saved.

If each file history could be tracked independently and didn't need to be it's own git repository, this problem could be more easily solved with just tar indexing. However this brings up a different problem, a problem of distributed sharing, and figuring out how to shard git. This might actually be a simpler problem.

Another problem is if it just one big git repository, then you don't want to version the encrypted tar files, but rather the encrypted clear text. This also requires hacking around the git filters, so that certain files are auto decrypted. And this is more advanced than the idea of remote git repo encrypted while local repository isn't, we need encryption at rest.

So if I have bindings to libgit2, native tar code, and native openpgp.js, maybe there's a way around this and make it all work.

---

Building this requires:

```
nix-shell --packages nodePackages.node2nix
node2nix --nodejs-6 --development --composition ./node.nix
exit
nix-shell --attr shell
```

It may not be necessary to have the bootstrap shell, if all the generated files are saved in git already. This is necessary to have a content addressed reproducible nix package. But even more, the `<nixpkgs>` needs to be replaced with a content addressed nix package set when this all builds.

During development it can be left as `<nixpkgs>`.

After updating the package.json, you can then regenerate the dependencies for nix rerunning node2nix with the same flags.

React, React Native all need exact versions, since they have very specific compatibility pairings. This is also due to the flattened dependency tree of npm 3.x. So we cannot have any kind of `~` or `^` magic in those versions. This might also apply to electron, but I have not encountered any npm complaints yet.

Also nodegit is not really easily installable, instead of putting it inside my package.json, I am going to investigate how to override the configure script using the nixpkgs buildNodePackage toolchain.
