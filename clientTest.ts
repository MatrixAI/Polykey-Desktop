import Logger, { LogLevel, StreamHandler } from '@matrixai/logger';

import path from 'path';
import fs from 'fs';
import { PolykeyClient } from '@matrixai/polykey/src';
import { clientPB, GRPCClientClient } from '@matrixai/polykey/src/client';
import { Lockfile } from '@matrixai/polykey/src/lockfile';
import { ErrorClientClientNotStarted } from '@matrixai/polykey/src/client/errors';
import { NodeId } from '@matrixai/polykey/src/nodes/types';
import { Host, Port } from '@matrixai/polykey/src/network/types';

let grpcHost: Host;
let grpcPort: Port;

async function main() {
  // let client: PolykeyClient;
  // let grpcClient: GRPCClientClient;

  const nodePath = './tmp/';
  const lockPath = path.join(nodePath, Lockfile.LOCKFILE_NAME);

  const logger = new Logger('PolykeyClient');
  // const lockfile = new Lockfile({ nodePath, fs, logger });
  const status = await Lockfile.checkLock(fs, lockPath);
  if (status === 'UNLOCKED') {
    throw new ErrorClientClientNotStarted(
      'Polykey Lockfile not locked. Is the PolykeyAgent started?',
    );
  } else if (status === 'DOESNOTEXIST') {
    throw new ErrorClientClientNotStarted(
      'Polykey Lockfile not found. Is the PolykeyAgent started?',
    );
  }
  const lock = await Lockfile.parseLock(fs, lockPath);
  console.log(lock);
  grpcHost = lock.host as Host;
  grpcPort = lock.port as Port;

  const grpcClient = new GRPCClientClient({
    nodeId: lock.nodeId as NodeId,
    host: grpcHost as Host,
    port: grpcPort as Port,
    logger,
  });
  await grpcClient.start({ timeout: 30000 });

  const echoMessage = new clientPB.EchoMessage();
  echoMessage.setChallenge('Hello World!');
  const res = await grpcClient.echo(echoMessage);
  console.log(res.getChallenge());
  grpcClient.stop();
}
main();
