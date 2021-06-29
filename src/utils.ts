import { Lockfile } from "@matrixai/polykey/src/lockfile";
import path from "path";
import * as utils from "@matrixai/polykey/src/utils";
import * as errors from "@matrixai/polykey/src/errors";

function filterByKeys(obj: any, keys: Array<any>): any {
  return Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((obj_, key) => {
      return {
        ...obj_,
        [key]: obj[key],
      };
    }, {});
}

async function sleep(t: number): Promise<void> {
  return await new Promise((r) => setTimeout(r, t));
}

function debounce(f, t = 0) {
  let timeout;
  return function (...args) {
    const later = () => {
      timeout = null;
      f(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, t);
  };
}

async function checkAgentRunning(nodePath: string): Promise<boolean> {
  const fs = require('fs');
  if (
    (await Lockfile.checkLock(
      fs,
      path.join(nodePath, 'agent-lock.json'),
    )) !== 'DOESNOTEXIST'
  ) {
    // Interrogate Lock File
    const lock = await Lockfile.parseLock(
      fs,
      path.join(nodePath, 'agent-lock.json'),
    );

    if (utils.pidIsRunning(lock.pid)) {
      return true;
    }
  }
  return false;
}

export { filterByKeys, sleep, debounce, checkAgentRunning };
