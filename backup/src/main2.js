import GitKit from 'gitkit';
import NativeFS from 'gitkit/lib/fs/native';
import MemoryFS from 'gitkit/lib/fs/memory';
import os from 'os';
import path from 'path';

function main () {

  let repoFs = MemoryFS();
  let repo = GitKit.Repository.createWithFS(repoFs, false);

  GitKit.RepoUtils.init(repo);

  // init the repo, this actually creates the proper .git structure
  console.log('REPO', repo);

  repoFs.fs.mkdirpSync('/lol');
  repoFs.fs.writeFileSync('/lol/test', 'test string\n');

  console.log('REPO', repo);
  // can we add all?
  // that appears requiring listing all files, and adding all of them?
  // no function that deals with an array of paths
  GitKit.WorkingUtils.add(repo, '/lol/test').then(function () {

    console.log("HEY!");

    GitKit.ChangesUtils.list(repo).then(function (changes) {
      console.log(changes);
    }, function (err) {
      console.log(err);
    });

  }, function (err) {

    // this is complaining about the index file
    // git add is what creates the index file, why would this complain about this issue?
    // this doesn't make any sense

    console.log('Add error:', err);

  });

  // why is there no index file!?

  console.log('REPO', repo);







  // GitKit.WorkingIndex.readFromRepo(repo).then(function (workingIndex) {
  //   console.log(workingIndex);
  // }, function (err) {
  //   console.log(err);
  // });
}

export default main;
