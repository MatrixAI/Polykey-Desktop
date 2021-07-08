import os from 'os';
// import fixPath from 'fix-path'; //Broken with webpack.
import { ipcMain, clipboard } from 'electron';
import { PolykeyClient } from '@matrixai/polykey/src/index';
import { GRPCClientClient } from '@matrixai/polykey/src/client';
import { getDefaultNodePath } from '@matrixai/polykey/src/utils';
import Logger, { LogLevel, StreamHandler } from '@matrixai/logger';
import { clientPB } from '@matrixai/polykey/src/client';
import { sleep } from '../utils';
import * as grpc from '@grpc/grpc-js';
import {
  bootstrapPolykeyState,
  checkKeynodeState,
} from '@matrixai/polykey/src/bootstrap';
import { checkAgentRunning } from '@matrixai/polykey/src/agent/utils';
import { spawnBackgroundAgent } from '@matrixai/polykey/src/agent/utils';

// fixPath(); //Broken with webpack.

/** This will default for now */
let keynodePath: string; //getDefaultNodePath();
let client: PolykeyClient;
let grpcClient: GRPCClientClient;

//TODO, could be wrong, fix this up. functions for now.
async function getAgentClient(nodePath?: string, failOnNotInitialized = false) {
  // make sure agent is running
  console.log('starting....');
  console.log('Node path: ', nodePath);
  if (nodePath) keynodePath = nodePath;
  console.log('keynode path: ', keynodePath);
  if (keynodePath === undefined) throw Error('No node path set.');

  const clientConfig = {};
  clientConfig['logger'] = new Logger('CLI Logger', LogLevel.WARN, [
    new StreamHandler(),
  ]);
  clientConfig['logger'].setLevel(LogLevel.DEBUG);
  clientConfig['nodePath'] = keynodePath;

  // Temp so we can check it started properly before using it.
  const tmpClient = new PolykeyClient(clientConfig);
  await tmpClient.start({});
  const tmpGrpcClient = tmpClient.grpcClient;
  if (!tmpGrpcClient.started) {
    await tmpClient.stop();
    throw Error('agent is not running and could not be restarted');
  }
  client = tmpClient;
  grpcClient = tmpGrpcClient;
  console.log('done starting agent..');
}

function resolveTilde(filePath: string) {
  if (filePath[0] === '~' && (filePath[1] === '/' || filePath.length === 1)) {
    filePath = filePath.replace('~', os.homedir());
  }
  return filePath;
}

async function setHandlers() {
  /// ////////////////////
  // Clipboard control //
  /// ////////////////////
  ipcMain.handle('ClipboardCopy', async (event, secretContent: string) => {
    clipboard.writeText(secretContent);
    setTimeout(() => {
      if (clipboard.readText() === secretContent) {
        clipboard.clear();
        clipboard.writeText('');
      }
    }, 30000);
  });

  /// ////////////////
  // agent control //
  /// ////////////////
  ipcMain.handle('agent-start-old', async (event, request) => {
    //FIXME: remove this when confirmed it is un-needed.
    const password = 'Password';

    // this method has a 3 possible cases:
    // case 1: polykey agent is not started and is started to return the pid
    // case 2: polykey agent is already started and returns true
    // case 3: polykey agent is not initialize (will throw an error of "polykey node has not been initialized, initialize with 'pk agent init'")
    try {
      // phase 1: the first thing we ever do is check if the agent is running or not
      // but we only know the agent is offline if getStatus returns an error (because its offline)
      // so check status and if it throws we know its offline, if not we assume its online
      console.log('connectToAgent');
      console.log(keynodePath);

      const tempClient = client.grpcClient;

      console.log('getStatus');
      if (!tempClient.started) {
        throw Error('agent is not running');
      }
      // it is here that we know that the agent is running and client is initialize
    } catch (error) {
      try {
        // agent is offline so we start it! //TODO, spawn the agent here.
        console.log('startAgent');
        const polykeyPath = getDefaultNodePath();

        //Bootstrapping
        try {
          await bootstrapPolykeyState(polykeyPath, password); //FIXME, Do a proper bootstrap. Also breaks if Agent is already running.
        } catch (e) {
          console.log("Can't bootstrap state, Error: ", e.message);
        }
        let pid: number = 0;

        //Spawning agent.
        try {
          pid = await spawnBackgroundAgent(polykeyPath, password); //FIXME: Return a pid or not? work out if this is used anywhere.
        } catch (e) {
          console.log('Problem starting agent, might already be started.');
          console.error(e);
        }
        // console.log(pid);
        await getAgentClient();

        console.log('connectToAgent');
        const tempClient = client.grpcClient;
        // we just confirm that the agent has actually been started
        // if not, it is most likely not initalize so we just throw the error for the frontend to handle
        console.log('getStatus');
        console.log('done');
        if (!tempClient.started) {
          throw Error('agent could not be started');
        }

        return pid;
      } catch (error) {
        throw Error(error.message);
      }
    }
  });

  ipcMain.handle('connect-client', async (event, request) => {
    return await getAgentClient(request.keynodePath);
  });

  ipcMain.handle('check-agent', async (event, request) => {
    return await checkAgentRunning(request.keynodePath);
  });

  ipcMain.handle('spawn-agent', async (event, request) => {
    return await spawnBackgroundAgent(request.keynodePath, request.password);
  });

  ipcMain.handle('check-keynode-state', async (event, request) => {
    return await checkKeynodeState(request.keynodePath);
  });

  ipcMain.handle('bootstrap-keynode', async (event, request) => {
    await bootstrapPolykeyState(request.keynodePath, request.password);
  });

  ipcMain.handle('Stop-Agent', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    // throw new Error("Not implemented.");
    // await promisifyGrpc(client.stopAgent.bind(client))(new pb.EmptyMessage());
    // return;
  }); // FIXME, Is it needed?

  // ipcMain.handle('agent-restart', async (event, request) => {
  //   await client.stop();
  //   await client.start({});
  //   const pid = 0; //FIXME: return pid or not?
  //   return pid;
  // });

  /// /////////////////
  // agent handlers //
  /// /////////////////
  //TODO: This will need to be redone later.
  ipcMain.handle('NodesAdd', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = clientPB.EmptyMessage.deserializeBinary(request);
    const res = await grpcClient.NodesAdd(emptyMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('AuthenticateProvider', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerMessage = clientPB.ProviderMessage.deserializeBinary(request);
    const res = await grpcClient.identitiesAuthenticate(providerMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('IdentitiesAugmentKeynode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerMessage = clientPB.ProviderMessage.deserializeBinary(request);
    const res = await grpcClient.identitiesAugmentKeynode(providerMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('KeysDecrypt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const cryptoMessage = clientPB.CryptoMessage.deserializeBinary(request);
    const res = await grpcClient.keysDecrypt(cryptoMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('vaultsDeleteSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultSpecificMessage = clientPB.VaultSpecificMessage.deserializeBinary(
      request,
    );
    await grpcClient.vaultsDeleteSecret(vaultSpecificMessage);
    return;
  });

  ipcMain.handle('vaultsDelete', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultMessage.deserializeBinary(request);
    const res = await grpcClient.vaultsDelete(vaultMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('DeriveKey', async (event, request) => {
    //FIXME: Not used, Not actually a thing now?
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.deriveKey.bind(client))(
    //   pb.DeriveKeyMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.handle('keysEncrypt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const cryptoMessage = clientPB.CryptoMessage.deserializeBinary(request);
    const res = await grpcClient.keysEncrypt(cryptoMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('NodesFind', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeMessage = clientPB.NodeMessage.deserializeBinary(request);
    await grpcClient.NodesFind(nodeMessage);
    return;
  });

  ipcMain.on('IdentityGetConnectedInfos', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerSearchMessage = new clientPB.ProviderSearchMessage();
    const connectedIdentitiesList = await grpcClient.identitiesGetConnectedInfos(
      providerSearchMessage,
    );
    const data: Array<Uint8Array> = [];
    for await (const identity of connectedIdentitiesList) {
      data.push(identity.serializeBinary());
    }
    return data;
  });

  ipcMain.handle('IdentitiesGetInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = clientPB.EmptyMessage.deserializeBinary(request);
    const res = await grpcClient.identitiesGetInfo(emptyMessage);
    return res.serializeBinary();
  });

  ipcMain.on('IdentitiesDiscoverIdentity', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const gestaltMessage = clientPB.ProviderMessage.deserializeBinary(request);
    const res = await grpcClient.gestaltsDiscoverIdentity(gestaltMessage);
    return res.serializeBinary();
  });

  ipcMain.on('GestaltsDiscoverNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const gestaltMessage = clientPB.GestaltMessage.deserializeBinary(request);
    const res = await grpcClient.gestaltsDiscoverNode(gestaltMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('GestaltsList', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const knownGestalts = await grpcClient.gestaltsList(emptyMessage);

    const data: Array<Uint8Array> = [];
    for await (const gestalt of knownGestalts) {
      data.push(gestalt.serializeBinary());
    }
    return data;
  });

  ipcMain.handle('GestaltsGetIdentity', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerMessage = clientPB.ProviderMessage.deserializeBinary(request);
    const res = await grpcClient.gestaltsGetIdentitiy(providerMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('TrustGestalt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    //
    // const res = (await promisifyGrpc(client.trustGestalt.bind(client))(
    //   pb.StringMessage.deserializeBinary(request),
    // )) as pb.EmptyMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('UntrustGestalt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.untrustGestalt.bind(client))(
    //   pb.StringMessage.deserializeBinary(request),
    // )) as pb.EmptyMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('GestaltIsTrusted', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.gestaltIsTrusted.bind(client))(
    //   pb.StringMessage.deserializeBinary(request),
    // )) as pb.BooleanMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('GetOAuthClient', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.getOAuthClient.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.OAuthClientMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('NodesGetLocalInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.NodesGetLocalInfo(emptyMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('NodesGetInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeMessage = clientPB.NodeMessage.deserializeBinary(request);
    const res = await grpcClient.NodesGetInfo(nodeMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('keysRootKeyPair', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.keysRootKeyPair(emptyMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('certsGet', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.certsGet(emptyMessage);
    return res;
  });

  ipcMain.handle('vaultsGetSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultSpecificMessage = clientPB.VaultSpecificMessage.deserializeBinary(
      request,
    );
    const res = await grpcClient.vaultsGetSecret(vaultSpecificMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('ListOAuthTokens', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.listOAuthTokens.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.StringListMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('Nodes-List', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = await clientPB.EmptyMessage;
    const nodesListGenerator = grpcClient.vaultsListSecrets(emptyMessage);
    const data: Array<Uint8Array> = [];
    for await (const node of nodesListGenerator) {
      data.push(node.serializeBinary());
    }
    return data;
  });

  ipcMain.handle('vaultsListSecrets', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = await clientPB.VaultMessage.deserializeBinary(request);
    const secretListGenerator = grpcClient.vaultsListSecrets(vaultMessage);
    const data: Array<Uint8Array> = [];
    for await (const vault of secretListGenerator) {
      data.push(vault.serializeBinary());
    }
    return data;
  });

  ipcMain.handle('vaultsList', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const vaultListGenerator = await grpcClient.vaultsList(emptyMessage);
    const data: Array<Uint8Array> = [];
    for await (const vault of vaultListGenerator) {
      data.push(vault.serializeBinary());
    }
    return data;
  });

  ipcMain.handle('NewClientCertificate', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.newClientCertificate.bind(client))(
    //   pb.NewClientCertificateMessage.deserializeBinary(request),
    // )) as pb.NewClientCertificateMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('vaultsNewSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultSpecificMessage.deserializeBinary(
      request,
    );
    await grpcClient.vaultsNewSecret(vaultMessage); //NOTE: not returning success?
    return;
  });

  ipcMain.handle('NewOAuthToken', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.newOAuthToken.bind(client))(
    //   pb.NewOAuthTokenMessage.deserializeBinary(request),
    // )) as pb.StringMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('vaultsCreate', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultMessage.deserializeBinary(request);
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.vaultsCreate(vaultMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('NodesPing', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeMessage = clientPB.NodeMessage.deserializeBinary(request);
    await grpcClient.NodesPing(nodeMessage);
    return;
  });

  ipcMain.handle('vaultsPull', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultMessage.deserializeBinary(request);
    const meta = new grpc.Metadata();
    await grpcClient.vaultsPull(vaultMessage, meta);
    return;
  });

  ipcMain.handle('RevokeOAuthToken', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.revokeOAuthToken.bind(client))(
    //   pb.StringMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.handle('vaultsScan', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultMessage.deserializeBinary(request);
    const meta = new grpc.Metadata();
    const vaultListGenerator = grpcClient.vaultsScan(vaultMessage, meta);
    const data: Array<string> = [];
    for await (const vault of vaultListGenerator) {
      data.push(`${vault.getName()}`);
    }
    return data;
  });

  ipcMain.handle('keysSign', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const cryptoMessage = clientPB.CryptoMessage.deserializeBinary(request);
    const res = await grpcClient.keysSign(cryptoMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('ToggleStealthMode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.toggleStealthMode.bind(client))(
    //   pb.BooleanMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.handle('NodesUpdateLocalInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeInfoMessage = clientPB.NodeInfoMessage.deserializeBinary(request);
    const res = await grpcClient.NodesUpdateLocalInfo(nodeInfoMessage);
    return;
  });

  ipcMain.handle('NodesUpdateInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeMessage = clientPB.NodeInfoMessage.deserializeBinary(request);
    await grpcClient.NodesUpdateInfo(nodeMessage);
    return;
  });

  ipcMain.handle('vaultsEditSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const secretSpecificMessage = clientPB.SecretSpecificMessage.deserializeBinary(
      request,
    );
    await grpcClient.vaultsEditSecret(secretSpecificMessage);
    return;
  });

  ipcMain.handle('keysVerify', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const cryptoMessage = clientPB.CryptoMessage.deserializeBinary(request);
    const res = await grpcClient.keysVerify(cryptoMessage);
    return res.serializeBinary();
  });

  /** Test handlers */
  ipcMain.handle('GestaltsSetIdentity', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerMessage = clientPB.ProviderMessage.deserializeBinary(request);
    await grpcClient.gestaltsGetIdentitiy(providerMessage);
    return;
  });

  // Testing a stream response.
  ipcMain.on('stream-test', async (event, arg) => {
    console.log(arg);
    for (let i = 0; i < arg; i++) {
      event.reply(i);
      await sleep(1000);
    }
  });
}

export default setHandlers;
export { keynodePath };
