import { sleep } from "@matrixai/polykey/dist/utils";
const child_process = require('child_process')

function main() {
  const exe = 'ts-node';
  const args = ['-r' , 'ts-node/register', './replTests/agentTest.ts', '--'];
  const child = child_process.spawn(exe, args, {
    // detached: true,
    stdio: [0, 1, 2],
    env: process.env
  })
  // child.unref()
  console.log("child PID: ", child.pid);
  return process.exit()
}

// async function main() {
//   const child = child_process.fork(
//     './replTests/agentTest.ts'
//     , []
//     , {
//       execArgv: ['-r', 'ts-node/register'],
//       stdio: [0, 1, 2, 'ipc'],
//       detached: true,
//     }
//   )
//   child.unref();
//   console.log(child.pid, child.killed);
//   await sleep(100000);
// }

main();
