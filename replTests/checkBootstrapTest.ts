import fs from 'fs';
import process from "process";
import path from "path";





async function main() {
  const nodePath = './tmp'
  try{
    const files = await fs.promises.readdir(nodePath);
    //Checking if directory structure matches keynode structure.
    if(
      files.includes('agent')   &&
      files.includes('keys')    &&
      files.includes('vaults')  &&
      files.includes('nodes')   &&
      files.includes('gestalts')&&
      files.includes('identities')
    ) {
      console.log("good structure.");
      return 1; // Should be a good initilized keynode.
    } else {
    console.log("bad structure.");
    return 2; // Bad structure, either malformed or not a keynode.
    }
  } catch (e) {
    if(e.code === 'ENOENT') {
      console.log("Directory does not exist.")
      return 0; // The directory does not exist, we can create a bootstrap a keynode.
    } else throw Error(e);
  }
}

main();
