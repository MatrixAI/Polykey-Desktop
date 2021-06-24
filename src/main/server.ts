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
import { bootstrapPolykeyState } from '@matrixai/polykey/src/utils';
import { spawnBackgroundAgent } from '@matrixai/polykey/src/agent/utils';

// fixPath(); //Broken with webpack.

/** This will default for now */
const polykeyPath = getDefaultNodePath();
let client: PolykeyClient;
let grpcClient: GRPCClientClient;

async function getAgentClient(failOnNotInitialized = false) {
  // make sure agent is running
  console.log('starting....');
  console.log(polykeyPath);

  const clientConfig = {};
  clientConfig['logger'] = new Logger('CLI Logger', LogLevel.WARN, [
    new StreamHandler(),
  ]);
  clientConfig['logger'].setLevel(LogLevel.DEBUG);
  clientConfig['nodePath'] = polykeyPath;

  client = new PolykeyClient(clientConfig);
  await client.start({});
  grpcClient = client.grpcClient;
  if (!grpcClient.started) {
    throw Error('agent is not running and could not be restarted');
  }
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
  ipcMain.handle('agent-start', async (event, request) => {
    const password = "Password";

    // this method has a 3 possible cases:
    // case 1: polykey agent is not started and is started to return the pid
    // case 2: polykey agent is already started and returns true
    // case 3: polykey agent is not initialize (will throw an error of "polykey node has not been initialized, initialize with 'pk agent init'")
    try {
      // phase 1: the first thing we ever do is check if the agent is running or not
      // but we only know the agent is offline if getStatus returns an error (because its offline)
      // so check status and if it throws we know its offline, if not we assume its online
      console.log('connectToAgent');
      console.log(polykeyPath);

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
        await bootstrapPolykeyState(polykeyPath, password); //FIXME, Do a proper bootstrap.
        let pid: number = 0;//asd
        try {
          pid = await spawnBackgroundAgent(polykeyPath, password); //FIXME: Return a pid or not? work out if this is used anywhere.
        } catch (e) {
          console.log("Problem starting agent, might already be started.");
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

  ipcMain.handle('agent-restart', async (event, request) => {
    await client.stop();
    await client.start({});
    const pid = 0; //FIXME: return pid or not?
    return pid;
  });

  /// /////////////////
  // agent handlers //
  /// /////////////////
  ipcMain.handle('AddPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.addNode.bind(client))(
    //   pb.NodeInfoReadOnlyMessage.deserializeBinary(request),
    // )) as pb.StringMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('AuthenticateProvider', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    // throw new Error("Not implemented.");
    // const res = (await promisifyGrpc(client.authenticateProvider.bind(client))(
    //   pb.AuthenticateProviderRequest.deserializeBinary(request),
    // )) as pb.StringMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('AugmentKeynode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    // throw new Error("Not implemented.");
    // const res = (await promisifyGrpc(client.augmentKeynode.bind(client))(
    //   pb.AugmentKeynodeRequest.deserializeBinary(request),
    // )) as pb.StringMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('KeysDecrypt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const cryptoMessage = clientPB.CryptoMessage.deserializeBinary(request);
    const res = await grpcClient.keysDecrypt(cryptoMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('keysDelete', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const keyMessage = clientPB.KeyMessage.deserializeBinary(request);
    await grpcClient.keysDelete(keyMessage);
    return;
  });

  ipcMain.handle('vaultsDeleteSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultSpecificMessage = clientPB.VaultSpecificMessage.deserializeBinary(request);
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

  ipcMain.handle('FindPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.findNode.bind(client))(
    //   pb.ContactNodeMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.on('GetConnectedIdentityInfos-message', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const responseStream = client.getConnectedIdentityInfos(
    //   pb.ProviderSearchMessage.deserializeBinary(request),
    // );
    //
    // responseStream.on('data', async (identityInfo: pb.IdentityInfoMessage) => {
    //   console.log('recieving data');
    //   event.reply(
    //     'GetConnectedIdentityInfos-reply',
    //     identityInfo.serializeBinary(),
    //   );
    // });
    //
    // // responseStream.on('error', () => {});
    // // responseStream.on('end', () => {});
  });

  ipcMain.handle('GetIdentityInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.getIdentityInfo.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.IdentityInfo;
    //
    // return res.serializeBinary();
  });

  ipcMain.on('DiscoverGestaltIdentity-message', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const responseStream = client.discoverGestaltIdentity(
    //   pb.IdentityMessage.deserializeBinary(request),
    // );
    //
    // responseStream.on('data', async () => {
    //   const res = (await promisifyGrpc(client.getGestalts.bind(client))(
    //     new pb.EmptyMessage(),
    //   )) as pb.GestaltListMessage;
    //   event.reply('DiscoverGestaltIdentity-reply', res.serializeBinary());
    // });
    // // responseStream.on('error', () => {});
    // // responseStream.on('end', () => {});
  });

  ipcMain.on('DiscoverGestaltNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const responseStream = client.discoverGestaltNode(
    //   pb.IdentityMessage.deserializeBinary(request),
    // );
    //
    // responseStream.on('data', async () => {
    //   const res = (await promisifyGrpc(client.getGestalts.bind(client))(
    //     new pb.EmptyMessage(),
    //   )) as pb.GestaltListMessage;
    //   event.reply(res.serializeBinary());
    // });
    // // responseStream.on('error', () => {});
    // // responseStream.on('end', () => {});
  });

  ipcMain.handle('GetGestalts', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.getGestalts.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.GestaltListMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('GetGestaltByIdentity', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.getGestaltByIdentity.bind(client))(
    //   pb.IdentityMessage.deserializeBinary(request),
    // )) as pb.GestaltMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('TrustGestalt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
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

  ipcMain.handle('keysGet', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const keyMessage = clientPB.KeyMessage.deserializeBinary(request);
    const res = await grpcClient.keysGet(keyMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('GetLocalPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.getLocalNodeInfo.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.NodeInfoMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('GetPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.getNodeInfo.bind(client))(
    //   pb.StringMessage.deserializeBinary(request),
    // )) as pb.NodeInfoMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('keysRootKeyPair', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.keysRootKeyPair(emptyMessage)
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
    const vaultSpecificMessage = clientPB.VaultSpecificMessage.deserializeBinary(request);
    const res = await grpcClient.vaultsGetSecret(vaultSpecificMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('GetStatus', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.getStatus.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.AgentStatusMessage;
    // return res.serializeBinary();
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

  ipcMain.handle('ListKeys', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.listKeys.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.StringListMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('ListPeers', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.listNodes.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.StringListMessage;
    // return res.serializeBinary();
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

  ipcMain.handle('LockNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // (await promisifyGrpc(client.lockNode.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.EmptyMessage;
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

  ipcMain.handle('InitializeKeyNode', async (event, request) => {
    await getAgentClient(false);
    throw new Error('Not implemented.'); //TODO Bootstrap.
    // await promisifyGrpc(client.initializeNode.bind(client))(
    //   pb.NewKeyPairMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.handle('vaultsNewSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultSpecificMessage.deserializeBinary(request);
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
    const res = await grpcClient.vaultsCreate(vaultMessage);
    return res.serializeBinary();
  });

  ipcMain.handle('PingPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.pingNode.bind(client))(
    //   pb.ContactNodeMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.handle('vaultsPull', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultMessage.deserializeBinary(request);
    const meta = new grpc.Metadata();
    // await PolykeyClient.vaultsPull(vaultMessage, meta); //FIXME MISSINGCOMM
    throw new Error('Not implemented.');
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
    // const vaultListGenerator = grpcClient.vaultsScan(vaultMessage, meta); //FIXME MISSINGCOMM
    const vaultListGenerator: Array<clientPB.VaultMessage> = [];
    const data: Array<string> = []
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

  ipcMain.handle('StopAgent', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    // throw new Error("Not implemented.");
    // await promisifyGrpc(client.stopAgent.bind(client))(new pb.EmptyMessage());
    // return;
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

  ipcMain.handle('UnlockNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.unlockNode.bind(client))(
    //   pb.UnlockNodeMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.handle('UpdateLocalPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.updateLocalNodeInfo.bind(client))(
    //   pb.NodeInfoMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.handle('UpdatePeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.updateNodeInfo.bind(client))(
    //   pb.NodeInfoReadOnlyMessage.deserializeBinary(request),
    // );
    // return;
  });

  ipcMain.handle('vaultsEditSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const secretSpecificMessage = clientPB.SecretSpecificMessage.deserializeBinary(request);
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
  ipcMain.handle('SetIdentity', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.setIdentity.bind(client))(
    //   pb.StringMessage.deserializeBinary(request),
    // );
    // return;
  });

  // Testing a stream response.
  ipcMain.on('stream-test', async (event, arg) => {
    console.log(arg);
    for (let i = 0; i < arg; i++) {
      event.reply(i);
      await sleep(1000);
    }
  })
}

export default setHandlers;
export { polykeyPath };
