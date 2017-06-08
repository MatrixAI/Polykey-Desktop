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

---

Constraints:

1. No plaintext at all in the filesystem during operations, this is dangerous because it is a compromise if the process dies for whatever reason.
2. Version history on a per-key basis. Each key is a directory containing subkeys.
3. Key sharing based on pub key signatures, imported from gnupg. Maintains its own contact list to be portable. Not every system will have gpg installed.
4. Portable to all major platforms: windows, linux, osx, ios, android
5. CLI usable, don't need to invoke the gui when not needed
6. Can work with a readonly filesystem, this just means no changing of keys can be applied, and no logs can only be sent to external sources (accounting), so only read operations can be applied
7. Encryption and decryption needs to be compatible with gpg.
8. Partial sharing
9. Version history of keys is based on plaintext history, so that means committing to git is done before encryption.
10. Nested git repository, the master keynode is always a git repository thus contains the history of manipulations on encrypted keynodes, it cannot view the plaintext of each subkey. So you maintain history of the entire keynode. But each individual keyset has its own history maintained in its own git repository.
11. The need to maintain all operations in memory, means we need to use an in-memory implementation of git, which means js-git needs to be extended with what we are doing.

There's js-git official and this fork with much more recent commits extended with es6 support and promises? https://github.com/strangesast/js-git

---

http://www.jedi.be/blog/2013/05/14/Compiling%20-%20packaging%20a%20nodejs%20project%20as%20a%20single%20binary/

---

The CLI interface should be both automatable and interactive. For interactivity, one can use the vorpal library. For single one-off commands one can use:

---

We need to try js-git and create some stuff.

loadAs always returns an array, with the second element undefined, why?

Syncing and merging will the most stuff that still needs to be implemented with js-git.

commit:
  tree,
  parents,
  author:
    name,
    email,
    date
  commiter:
    name,
    email,
    date
  message

tree:
  'filename':
    mode,
    hash
  'filename':
    mode,
    hash

array:
  {
    name,
    mode,
    hash
  }
  
To get anything done we must always have access to the commithash.

When going through a tree stream, it's a depth first traversal of the commit's tree. It starts at the root of the tree with:

  mode,
  hash,
  body,
  path
  
That is the path starts at '/'.

And then it goes down the first path.

Whenever we are creating a commit, we create a tree. That tree is basically a snapshot of the state of the filesystem or repo. But does this mean we don't save the entire state in the tree, what performs the minimal diff for the tree? Something after the commit, or only the changes?

Each tree only has 1 child level, so creating deeply nested folder structure relies on creating blobs for each level and then encapsulating it in a tree datastructure.

---

Ok so we have to figure out these supporting functionalities for git:

1. The ability to create a new repository on the disk (init)

What id the difference between git-fs-db and git-db-fs and js-git's db fs mixin?

Also git-node-fs...?

Every mixin adds in extra functions to the repo object. The fs-db mixin adds in functions relating to filesystem operations of git.

So the different backing stores like mem-db also implements these operations, but do it differently like in being in ram.

Fs-db also relies on an underlying filesystem abstraction system, which implements the functions readFile, readChunk, writeFile, readDir, so all of this is duck typed, there is no type checking using the interfaces.

It appears that the packages that define these functions are also git-fs-db and git-node-fs, I'm not sure what the difference between the 2 are. There's also git-chrome-db, which appears to use localstorage to store it in the browser.

Ok so 

js-git/mixins/fs-db relies on:

* git-node-fs
* git-chrome-fs (chrome specific implementation of the filesystem api, not a web standard, probably used by electron apps and chrome apps)

The git-fs-db does not appear to be applicable here.

Cool so the one I need is basically js-git/mixins/fs-db + git-node-fs AND js-git/mixins/mem-db.

I don't it's proper to add both mixins. Also the order of adding mixins doesn't seem to apply.

The fs-db and mem-db mixins provide the functions:

* saveAs - saving an object of some sort
* loadAs - read an object of some sort
* saveRaw - save an object with a binary value
* loadRaw - read an object as binary
* hasHash - check if a object with a hash exists
* readRef - reads a ref (not sure what this is)
* updateRef - updates a ref (not sure what this is)
* listRefs - list all refs with a search prefix (not sure what this is)

This is what sucks about this shit! Duck typing sucks without good documentation.

The db mixins maintain a map of objects, and a map of refs. The objects are indexed hashes. That's what the hash is used to lookup objects.

What are refs? 

However using the fs-db mixin also provides these extra functions:

* init - init a git repository onto disk?
* setShallow - shallow git repository?

The init function takes a ref (or not), and creates a new .git folder in some path set by the rootPath, and creates a HEAD file, with the contents 'ref: refs/heads/master'. Or the ref specified. Now this is not enough to be constituting a git repository. It is missing the config file, the description file, and the directories of hooks, info, objects, and refs.

Ok i get it now, objects match the same object structure in the mem-fs, and refs are basically things like tags and branches and the current default reference. They are pointers to the version history of the repository.

So what do we need to create the minimal git repository that `git status` says it is a repository? ALL we need is:

1. HEAD
2. empty objects directory
3. empty refs directory

That's it!!

So are these extra directories meant to be created by init or some later functionality?

Upon creating a blob object, this now creates an object directory and a subsequent object inside it. However without a ref directory, it is not yet a git repository.

The object file format is specialised however.

Without extra mixins, the saveAs only takes binary buffers, provided by the Buffer class. We can pack strings into a buffer using Buffer.from("Hello World\n").

The hash being returned by blobHash is EQUAL to the file path to the object itself, except that the first 2 characters are separated in this own directory, could be for performance reasons.

It appears that with only mixInCreateTree and mixInFsDb, the loadAs functions do not return an array unlike before, instead they return exactly what we expect. One of the mixins is screwing up the API behaviour I think.

Furthermore performing the loadAs functions do not create the ref directory, so it's still not a proper git repository. Before we attemp to PR this repository, or just add in our own additions, we should check what happens if we perform a commit, perhaps this will create the relevant ref directory.

However this is just a binary blob, how does this map to files? The hash is a SHA1 hash.

The equivalent of saveAs with blob is `git hash-object -w --stdin`.

Then of course loadAs with blob is then `git cat-file -p ...` where `...` is the hash.

Each object is just like a key-value data store, git uses this to represent versions of content. So if you create a file, and write some stuff into it, you can create a git object and store it in there, but if you write some other content, you can store that content as a git object as well, and all of this can be manipulated using the above two commands, and this is not only it, you also have the tree objects and possibly commit objects.

The actual objects, are encoded using a special encoder, and also compressed.

We can also create tree objects immediately using the saveAs tree option, but we just need to specify that the hash points to the blobHash that we previously created. But does this actually create a file in our repository?

This does not create a file in our repository, all we get is the version history being created.

Trees are how git's database tracks directories and filenames, the objects are just content, without any names.

Git normally takes the state of your index/staging area and writing a series of tree objects from it. Oh.. so this is what git add and finally git commit does. But probably git add specifically. And we need to analogue of git add, otherwise we're not going anywhere with this.

Wait a minute, the reason why this doesn't have a git add, is because, and in-memory version of git, the index is just your in-memory objects. But we are going to untar a bunch of files in-memory, including the .git directory, and the whole thing will be loaded into memory (actually is there a way to do this?) Make changes to it, which changes the .git history (which is mem-fs), and then repack it into an encrypted tar, and then resave it onto disk?

The commit saving requires the usage of mixInFormats. I believe this is due to the commit message which is a normal string, and not a buffer. Furthermore, unlike the creation of blobs, trees, the creation of commit objects is not purely content addressed, but also has a random/time component to it. This basically allows you to repeatedly create multiple commits pointint to same tree hash, with the same message and the same author details.

The formats mixin is pretty much required to make this usable, otherwise the types are strict, and the error messages are undecipherable. But an actually commit object is is totally:

```
{
  author: {
    name: "...",
    email: "...",
    date: new Date()
  },
  committer: {
    name: "...",
    email: "...",
    date: new Date()
  },
  tree: treehash,
  parents: [],
  message: "..."
}
```

So it's not about any kind of encoding, it's just that such a thing is the full message.

But it's a good idea to have this ready to go.

So... even after adding a commit it's not enough, it complains that there are no commits yet, when we already have created a commit object.

Going back to proper git, we can see that git add -A actually creates the objects for the untracked file, and I'm guessing it also performs the diff, which acquires objects for diffed files (or perhaps not, I'm not sure, if the diffing happens later). We definitely need these things:

* refs
* objects
* HEAD

To actually make git show up the log, the refs directory needs to have a heads subdir, with a master file pointing to the git object hash that I suppose the current state of the master needs to be at. So once I created this file, and put in the hash, the command git log worked, also git status worked, and indicated that the greeting.txt was deleted from the working directory. The logs directory and the index file sesem to be auto created from the git command. So it appears the only thing needed is the refs, objects and HEAD, and the relevant structure underneath it.

So what really determines if there is a commit log? I'm not sure...

https://github.com/creationix/js-git/issues/122#issuecomment-146045401

> JS-git doesn't have support for the working directory so you can't do things like git status. Also I haven't implemented diff yet so anything involving that can't be done including merges. The network actions like push and pull aren't done either. The main thing you can do currently with js-git is read/write the core git database directly.

No support for the working directory, and no support for the staging area I think?

With the lack of support of many working directory things, it appears that this implementation may be better: https://github.com/SamyPesse/gitkit-js

Try using gitkit next, and see if it provides a better way.

--- 

For shell, we use standard npm inside a nix-shell. This allows easier manipulation of the dependencies.

For build/default.nix, this uses node2nix and brings in a deterministic branch of nixpkgs and builds against that, also the exact versions of npm packages are encoded in the node-packages.nix.

---

Gitkit's native fs layer just creates promises from the native node functions, so all it does is override some of the async cps functions into promises. Both the in-memory and the native filesystem exposes the same apis. So while the git functions expose methods with working with a git database, you still have to use the underlying methods to produce changes in the working directory. So one of the key features is the need to apply changes in the in-memory filesystem, and the reifying it onto disk. The way to do this is to use a tar library that can be passed the memory-fs, and archive the contents recursively, which we can then output as a single file.

Writing files using the memory filesystem, one must be aware of mkdirp, which is needed prior being able to create the file in a deeply nested directory.

But the filesystem api does not have mkdirp!!

To get access to it, you need to use mkdirp package or the fs-extra package but that requires forking the native module in the gitkit package, and allowinit to use the fs-extra package instead of the fs package, we'll keep it simple and just use the mkdirp package. Also we should probably bring in the rimraf and ncp packages. Also becareful with rimraf, it really should only delete the directory and nothing else.

Ok so I have an experiment, init an in-memory repository, and add a file, add one commit, and then tar it up and save it on disk.

The GitKit.WorkingIndex points to models/workingIndex.js.

It calls Git.WorkingUtils.add(repo, filePath)

Where is this add function?

Module exports of WorkingUtils index.js exposes the add function as the default export of add file. It should be the addToIndex function. But how is this acquired?

What is the difference between the models and the utils? The models include WorkingIndex, but no WorkingUtils, the utils are just functions?

It returns a promise all, based on an array, where the first subpromise is to readFromRepo, then createEntry for that file, which probably creates an object. Spread spreads the values of the promise.all (it's basically fmap). Oh it's not fmap, instead it calls the subsequent function with its parameters set to the values of the array. It's like fold, but with multiple parameters, kind of like an uncurried function if lists were used instead of tuples.

The workingIndex.readFromRepo is the first promise to be called. The readFromRepo then tries to read the index file, but the initial repository doesn't have an index file, as the git add is the one that first creates it. This is a contradiction!

We need to change the git add function so it creates a index file if it doesn't already exist. The index is a binary file, containing a sorted list of path names, each with permissions and the SHA1 of the blob object. Using `git ls-files --stage` shows you the human readable contents of it.

The format is:

network byte order for binary numbers (big endian)

12 byte header of:

4 byte signature : DIRC
4 byte version: 2,3,4
2 byte number of index entries (only up to 65k?)

There's a function called WorkingIndex.writeToRepo which appears to take a workingIndex contents and writing it, the only function that calls this is WorkingUtils.add. This calls it with `WorkingIndex.writeToRepo(repo, workingIndex)`. But all this just does is pass the read index file and rewrite it. Ok not exactly. The index file is parsed, entries acquired, with the new file path added to the entry, and then with the new entries set using immutable style, and then rewritten.

The index file is parsed but `repo.readGitFile`, and converted into a buffer using WorkingIndex.createFromBuffer. That should mean we can find the parser, then we should be able to find the code that writes the index file. It is in models/repo.js

Oh it is actually WorkingIndex.createFromBuffer.

The creation code is WorkingIndex.toBuffer.

(remember that capitals are models or classes)

Ok so add calls addToIndex which calls WorkingIndex (models).readFromRepo,this calls WorkingIndex.createFromBuffer, which parses the index file. The result is that calling WorkingIndex.writeToRepo, which calls toBuffer, which creates a new index file.

What we need to do is to make add work even when there's no index file already, so that means if there is no index file, we need to return an empty working index so that getEntries returns [], and a new entry is added, before being written.

The readGitFile checks whether the repository is bare, and if so, it returns the filepath, otherwise, it joins '.git' with filepath, which in this case is the index file. Not a bare repository, so '.git/index'. Afterwards calling Repository.prototype.readFile, which calls this.getFS().read. Ok do we handle it here by dealing with the promise error and handling it?

```js
WorkingIndex.readFromRepo = function(repo, fileName) {
    fileName = fileName || 'index';

    return repo.readGitFile(fileName)
    .then(WorkingIndex.createFromBuffer, function (err) {

      // reduces the need to bring extra libraries

      if (
        err.code == 'ENOENT' &&
        err.path &&
        err.path.endsWith('.git/index')
      ) {

        // we know now that the file is missing, and we should create it
        // create a dummy index file, how to do this?
        
        return new WorkingIndex({ version: 2, entries: Immutable.OrderedMap });

      } else {

        throw err;

      }

    });
};
```

The createFromBuffer relies on immutable and IndexEntry model to create entries. The firste entriesBuf is another slice of 12 bytes, and with the version,this is passed to `IndexEntry.createFromBuffer(entriesBuf, version)`. The next entriesBuf = result.buffer, and the entries = entries.set with the result data. Why is the build up of the entries really inefficient using immutable, instead a standard mutable buildup and then conversion to immutable would be better. Oh it's not that inefficient due to structure sharing on modern VMs using hash map tries and vector tries.

Each slice has start and end. The start is where the new buffer will start, and then buffer will slice until the end. This seems like a binary head function. It is copy on write. Yep it is breaking up 12 bytes at a time for some reason. No the first time it is used, it is just used to pop off 12 bytes, which is the header, the next time it is used, it is the IndexEntry.createFromBuffer that is slicing out the contents, and it appears to know how long each entry will be. It uses the Dissolve parser to do this. And returns the un-used buffer in the result.

The result is a construction `new WorkingIndex({ version: ..., entries: ...})`. Ok first we need to create a default version, and the entries is just going to be an empty ordered map.

--- 

Problems:

1. Create index file if index file is not found for the add function - done
2. Immutable objects like OrderedMap does not have an each function, it has a forEach function. This is written completely wrong!
3. Path is not set when creating an index entry, this is wrong, we need a path!!
4. Immutable.js sets a default values, like default Date, but this is wrong as well, because, these become strings, and not integers.
5. Records are not used properly, they define objects with default values, but the usage od Number() or String() is just confusing, as this implies some sort of type checking, but this is not enforced. Furthermore it gets even more confusing with usages of Date() since these have default date values which is just a date string, these are very non-standard.

The setting up of default dates in such a way is bad, as this means the dates get set on the first usage and do not get changed on each new add/commit, it should be recalculated each time, when these things occur. I'd prefer using adt. Anyway a record here is just an object with default values.

First thing to do is to remove the default dates, as this does not make sense with regards to a index entry.

Any field that is required should be undefined, such as the date fields, and really we should be using adt.js

ctime is the last time 

These entries are usually filled by the stat call, the in-memory filesystem does not have a stat call right? OMG... so a memory fs doesn't have these stat information, then what does it mean then...?

Also what about mtime?

mtime - last time a file data changed = this is NOW right?

Alot of this data is meant to be fed from the stat call, but in an in-memory filesystem, there is no stat call, the ctime and mtime is always equal to when I perform the add operation. Both the metadata and the data gets changed right? Who knows, the in-memory filesystem has no metadata. Also uid and gid needs to be filled with the user who is using the application, the mode is dependent on the type of the file/directory/gitlink, not sure what dev or ino is. But I can see this information in hexdump -C ./.git/index. Furthermore path is supposed to be filled, with the path excluding root directory without the leading slash.

Perhaps we need the add operation to check against that the permissions or other metadata is different and compare, but I'm not sure how to do this, or whether this is important.

---

The `dev` I think is the device ID that contains the file, I don't think this is relevant to the in-memory filesystem. This has something to do with the major and minor device numbers that indicate which disk it contains. It appears that 24h/36d is saying 0x24 and 36 in decmial is the same. So basically that means device number 36. It's the major and minor device number combined into one value. Since we are going to save it to the disk, we could override it and add it to where the tar file is going to reside. I wonder what this is used for. The user-level tool is `git update index`. But during the git add operation, this has no information, so how to override it? It should be part of the add function.

```js
fs.statSync(process.cwd())
```

We change to the relevant directory, and we can get the dev in decimal form. This can be encoded for the dev for every file inside the tar archive.

Inode simply doesn't exist for these files, so we will just have to leave it as 0.

Also the spec seems to indicate that the dev and ino is exactly the 32bit data for that is given by stat call. This is strange because the 32 bit data is organised in 12 bits for the major number and 20 bits for the minor number.

This is an index file with marked sections:

```
          |HEADER........................... | CTIME.....|
00000000  44 49 52 43 00 00 00 02  00 00 00 01 59 37 c1 07  |DIRC........Y7..|
          |CTIMEN...| MTIME.....|  MTIMEN....| DEV.......|
00000010  1c 25 38 80 59 37 c1 07  1c 25 38 80 00 00 00 24  |.%8.Y7...%8....$|
          |INODE....|
00000020  00 00 04 11 00 00 81 a4  00 00 03 e8 00 00 03 e8  |................|
00000030  00 00 00 04 8b ae f1 b4  ab c4 78 17 8b 00 4d 62  |..........x...Mb|
00000040  03 1c f7 fe 6d b6 f9 03  00 04 74 65 73 74 00 00  |....m.....test..|
00000050  00 00 00 00 58 0a a8 3d  db a9 b8 fa 79 0c 51 1e  |....X..=....y.Q.|
00000060  31 85 f2 d0 47 64 e3 e1                           |1...Gd..|
00000068
```

We can see that the 24 which, which is 24 in hex, because it is a single byte, so it is stored as just a standard network integer int. But does that make sense to major and minor numbers? Not sure. The normal call to stat in NodeJS gives back a decimal, is this properly setup by `Concentrate().uint32be()`? Yes it does, it does work. `Concentrate().uint32be(22)` returns a buffer with hex 16 at the very end.

Ok so we need to add overrides to the add function if we want to pass our own stat data into the entry, without which, the filesystem will need to support the stat data, another way is to override the memory filesystem so it returns a particular stat call. (So we return )

The memory fs will need overridding the statSync call, because it doesn't return a proper stat object. Oh it is returning the interface, but all of the properties are empty. Ok so the only function to override is the statSync call, and just make sure the resulting object also has dev property. Instead of duck typing, we can extend the class specifically and add our own methods into it.

Here's how you extend the memory fs and override the stat call:

```js
import MemoryFileSystem from 'memory-fs';

let mfs = new MemoryFileSystem;

let mfs2 = Object.create(mfs);

mfs2.statSync = function (p) {

  return { 
    ...this.constructor.prototype.statSync.bind(this)(p),
    dev: 22
  };

};
```

Using the object spread syntax and whatever.

Also prefer to change to use the call syntax instead of bind. Another way is to use es6 class extend since it can achieve the same thing in a cleaner more obvious manner. The module exports the class.

Finally mode should be undefined, since you would know what you're adding right? But permissions should be obvious.

Root and group id should default to root.
