// @flow

import fs from 'fs';
import path from 'path';
import os from 'os';
import commander from 'commander';
import co from 'co';

import modes from 'js-git/lib/modes';

// underlying data base
import mixInMemDb from 'js-git/mixins/mem-db';
import mixInFsDb from 'js-git/mixins/fs-db';

import mixInCreateTree from 'js-git/mixins/create-tree';
import mixInPackOps from 'js-git/mixins/pack-ops';
import mixInWalkers from 'js-git/mixins/walkers';
import mixInReadCombiner from 'js-git/mixins/read-combiner';
import mixInFormats from 'js-git/mixins/formats';

import gitNodeFs from 'git-node-fs';

function testFilesystem () {

  // every mixin adds extra functionality to the repo object
  // that's what the mixins are doing
  // i see...

  let repo = {};

  repo.rootPath = path.join(os.tmpdir(), "test/.git");

  mixInFsDb(repo, gitNodeFs);

  // mixInFormats(repo);

  co(function * () {

    let something = yield repo.init();
    console.log('INIT: ', something);

    let blob = Buffer.from('Hello World\n');
    console.log('BLOB:', blob);

    let blobHash = yield repo.saveAs('blob', blob);
    console.log('BLOBHASH:', blobHash);

    let blob2 = yield repo.loadAs('blob', blobHash);
    console.log('BLOB2:', blob2);

    let treeHash = yield repo.saveAs("tree", {
      "greeting.txt": { mode: modes.file, hash: blobHash }
    });

    console.log('TREE:', treeHash);

    let commitHash = yield repo.saveAs("commit", {
      committer: {
        name: "roger",
        email: "roger@roger.com",
        date: new Date()
      },
      author: {
        name: "roger",
        email: "roger@roger.com",
        date: new Date()
      },
      tree: treeHash,
      parents: [],
      message: "COMMIT MESSAGE!!!"
    });

    console.log('Commit:', commitHash);

  }).then(function (v) {
    console.log(v);
  }, function (e) {
    console.log(e);
  });


  console.log(repo);

}

function oldtest () {

  let repo = {};

  mixInMemDb(repo);
  mixInCreateTree(repo);
  mixInPackOps(repo);
  mixInWalkers(repo);
  mixInReadCombiner(repo);
  mixInFormats(repo);

  co(function * () {

    let blobHash = yield repo.saveAs("blob", "Hello World\n");

    let treeHash = yield repo.saveAs("tree", {
      "greeting.txt": { mode: modes.file, hash: blobHash }
    });

    let commitHash = yield repo.saveAs("commit", {
      author: {
        name: "roger",
        email: "roger@roger.com"
      },
      tree: treeHash,
      message: "testcommit\n"
    });

    let [treeHash2] = yield repo.createTree({
      "www/index.html": {
        mode: modes.file,
        content: "<p>hi</hi>\n"
      },
      "README.md": {
        mode: modes.file,
        content: "blah\n"
      }
    });

    console.log("TREEHASH2", treeHash2);

    let changes = [
      {
        path: "www/index.html" // deletes the file
      },
      {
        path: "www/app.js",
        mode: modes.file,
        content: "hi\n"
      }
    ];

    changes.base = treeHash2;

    console.log("CHANGES", changes);

    let [treeHash3] = yield repo.createTree(changes);

    console.log("CHANGES2", treeHash3);

    // this commit is not related to the first commit?
    // how to setup a commit chain?
    let commitHash2 = yield repo.saveAs("commit", {
      parent: commitHash,
      author: {
        name: "roger",
        email: "roger@roger.com",
      },
      tree: treeHash2,
      message: "test\n"
    });

    /* let [commit] = yield repo.loadAs("commit", commitHash);
     * console.log(commit);

     * // this loads a tree object ()
     * let [tree] = yield repo.loadAs("tree", commit.tree);
     * console.log('tree', tree);

     * // this loads a single file as array buffer
     * let [file] = yield repo.loadAs("blob", tree["greeting.txt"].hash);
     * console.log(file);

     * // this loads a single file as a text string
     * let [file2] = yield repo.loadAs("text", tree["greeting.txt"].hash);

     * // this loads the tree as an array, like a flattened directory tree?
     * let [entries] = yield repo.loadAs("array", treeHash);
     * console.log(entries);*/

    // say we want a commit log, we get it starting from a commit hash
    // you can also use symbolic references like `ref/heads/master`
    let logStream = yield repo.logWalk(commitHash2);

    var commit_, object;
    while (commit_ = yield logStream.read(), commit_ !== undefined) {
      // so now we have each commit object
      console.log("LOGSTREAM", commit_);
      // for a particular commit we can walk through their each commit's tree
      var treeStream = yield repo.treeWalk(commit_.tree);
      console.log("OUTPUTTING TREESTREAM");
      while (object = yield treeStream.read(), object !== undefined) {
        console.log(object);
      }
    }

    return 1;

  }).then(function (v) {

    console.log(v);

  });

}

function main (argv, env) {

  // args is the resulting arguments
  commander
    .version('0.0.1')
    .usage('[options] <file ...>')
    .option(
      '-c, --config <path>',
      'Path to configuration, default: ~/.polykey/config',
      env.HOME + '/.polykey/config'
    )
    .parse(argv);

  try {
    fs.accessSync(commander.config, fs.constants.F_OK | fs.constants.R_OK);
  } catch (e) {
    /* console.log('Config file doesn\'t exit or cannot be read');*/
  }

  // config option
  /* console.log(commander.config);*/
  // subsequent arguments
  /* console.log(commander.args);*/

  testFilesystem();

}

export default main;
