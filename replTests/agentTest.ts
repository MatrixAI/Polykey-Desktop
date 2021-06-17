import Logger from '@matrixai/logger';

import { ClientService, GRPCClientClient } from '@matrixai/polykey/dist/client';
import createClientService from '@matrixai/polykey/dist/client/clientService';
import KeyManager from '@matrixai/polykey/dist/keys/KeyManager';
import VaultManager from '@matrixai/polykey/dist/vaults/VaultManager';
import NodeManager from '@matrixai/polykey/dist/nodes/NodeManager';
import GestaltGraph from '@matrixai/polykey/dist/gestalts/GestaltGraph';
import SessionManager from '@matrixai/polykey/dist/session/SessionManager';
import IdentitiesManager from '@matrixai/polykey/dist/identities/IdentitiesManager';
import ForwardProxy from '@matrixai/polykey/dist/network/ForwardProxy';
import ReverseProxy from '@matrixai/polykey/dist/network/ReverseProxy';
import GitBackend from '@matrixai/polykey/dist/git/GitBackend';
import GRPCServer from '@matrixai/polykey/dist/grpc/GRPCServer';
import { AgentService, createAgentService } from '@matrixai/polykey/dist/agent';
import { Host, Port } from '@matrixai/polykey/dist/network/types';
import { certNodeId } from '@matrixai/polykey/dist/network/utils';
import { Lockfile } from '@matrixai/polykey/dist/lockfile';
import { sleep } from '@matrixai/polykey/dist/utils';
import path from 'path';
import * as utils from '@matrixai/polykey/dist/utils';
import * as errors from '@matrixai/polykey/dist/errors';
import { WorkerManager } from '@matrixai/polykey/dist/workers';
import fs from 'fs';
import { getDefaultNodePath } from "@matrixai/polykey/dist/utils";

const nodePath = getDefaultNodePath();
console.log(nodePath);
const keysPath = './tmp/keys';
const nodesPath = './tmp/nodes';
const vaultsPath = './tmp/vaults';
const identitiesPath = './tmp/identities';
const gestaltsPath = './tmp/gestalts';
const grpcHost = '127.0.0.1';
const grpcPort = 0;
const fresh = false;
const authToken = 'asdf';
const password = 'Password';

async function main() {
  // Constructing.
  const logger = new Logger('Polykey');
  const keyManager: KeyManager = new KeyManager({ keysPath, logger });
  const vaultManager = new VaultManager({
    vaultsPath,
    keyManager,
    logger,
  });
  const fwdProxy = new ForwardProxy({ authToken, logger });
  const revProxy = new ReverseProxy({ logger });
  const nodeManager = new NodeManager({
    fwdProxy,
    keyManager,
    nodesPath,
    revProxy,
    logger,
  });
  const identitiesManager = new IdentitiesManager({
    identitiesPath,
    keyManager,
    logger,
  });
  const gestaltGraph = new GestaltGraph({
    gestaltsPath,
    keyManager,
    logger,
  });
  const sessionManager = new SessionManager({
    keyManager,
    logger,
  });
  const gitBackend = new GitBackend({
    getVault: vaultManager.getVault.bind(vaultManager),
    getVaultID: vaultManager.getVaultIds.bind(vaultManager),
    getVaultNames: vaultManager.listVaults.bind(vaultManager),
    logger: logger,
  });
  const workerManager = new WorkerManager({ logger });
  const lockfile = new Lockfile({
    nodePath: nodePath,
    logger: logger,
  });

  const clientService = createClientService({
    gestaltGraph,
    identitiesManager,
    keyManager,
    nodeManager,
    sessionManager,
    vaultManager,
  });
  const agentService = createAgentService({
    keyManager,
    vaultManager,
    nodeManager,
    gitBackend,
  });
  const grpcServer = new GRPCServer({
    services: [
      [ClientService, clientService],
      [AgentService, agentService],
    ],
    logger,
  });

  if (
    (await Lockfile.checkLock(fs, path.join(nodePath, 'agent-lock.json'))) !==
    'DOESNOTEXIST'
  ) {
    // Interrogate Lock File
    const lock = await Lockfile.parseLock(
      fs,
      path.join(nodePath, 'agent-lock.json'),
    );

    if (utils.pidIsRunning(lock.pid)) {
      logger.error(`PolykeyAgent already started at pid: ${lock.pid}`);
      throw new errors.ErrorPolykey(
        `PolykeyAgent already started at pid: ${lock.pid}`,
      );
    }
  }

  //starting everything.
  await workerManager.start();
  await keyManager.start({ password, fresh });
  keyManager.setWorkerManager(workerManager);
  //Getting tlsConfig information
  const keyPrivatePem = keyManager.getRootKeyPairPem().privateKey;
  const certChainPem = await keyManager.getRootCertChainPem();
  const cert = keyManager.getRootCert();
  const nodeId = certNodeId(cert);

  await vaultManager.start({ fresh });
  await grpcServer.start({
    host: grpcHost as Host,
    port: grpcPort as Port,
  });
  await fwdProxy.start({
    tlsConfig: {
      keyPrivatePem: keyPrivatePem,
      certChainPem: certChainPem,
    },
  });
  await revProxy.start({
    serverHost: grpcHost as Host,
    serverPort: grpcPort as Port,
    tlsConfig: {
      keyPrivatePem: keyPrivatePem,
      certChainPem: certChainPem,
    },
  });
  await lockfile.start({ nodeId });
  await lockfile.updateLockfile('host', grpcHost);
  await lockfile.updateLockfile('port', grpcServer.getPort());
  await lockfile.updateLockfile('fwdProxyHost', fwdProxy.getProxyHost());
  await lockfile.updateLockfile('fwdProxyPort', fwdProxy.getProxyPort());
  await nodeManager.start({ nodeId, fresh });
  await identitiesManager.start({ fresh });
  await gestaltGraph.start({ fresh });
  await sessionManager.start({});

  // //sleep while running or wait for an event.
  // await sleep(600000);

  // //Stopping.
  // await lockfile.stop();
  // await sessionManager.stop();
  // await gestaltGraph.stop();
  // await identitiesManager.stop();
  // await nodeManager.stop();
  // await revProxy.stop();
  // await fwdProxy.stop();
  // await grpcServer.stop();
  // await vaultManager.stop();
  // await keyManager.stop();
  // await workerManager.stop();
}

main().then(() => console.log('Done'));
