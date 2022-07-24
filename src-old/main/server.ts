import os from 'os';
// import fixPath from 'fix-path'; //Broken with webpack.
import { clipboard, ipcMain } from 'electron';
import { PolykeyClient } from '@matrixai/polykey/dist/index';
import { clientPB, GRPCClientClient } from '@matrixai/polykey/dist/client';
import Logger, { LogLevel, StreamHandler } from '@matrixai/logger';
import { sleep } from '@/utils';
import { createMetadata } from '@matrixai/polykey/dist/client/utils'
import {
  bootstrapPolykeyState,
  checkKeynodeState,
} from '@matrixai/polykey/dist/bootstrap';
import {
  checkAgentRunning,
  spawnBackgroundAgent,
} from '@matrixai/polykey/dist/agent/utils';
import { SetActionsMessage } from '@matrixai/polykey/dist/proto/js/Client_pb';
import { SessionToken } from "@matrixai/polykey/dist/session/types";

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

  ipcMain.handle('connect-client', async (event, request) => {
    return await getAgentClient(request.keynodePath);
  });

  ipcMain.handle('start-session', async (event, request) => {
    const meta = createMetadata();
    meta.add('password', request.password);
    //Needs the passwordFile path.asd
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.sessionRequestJWT(emptyMessage, meta);
    await client.session.start({ token: res.getToken() as SessionToken });
    return res.getToken();
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

  ipcMain.handle('Stop-Agent', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
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
    const res = await grpcClient.nodesClaim(
      emptyMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('AuthenticateProvider', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerMessage = clientPB.ProviderMessage.deserializeBinary(request);
    const res = await grpcClient.identitiesAuthenticate(
      providerMessage,
      await client.session.createJWTCallCredentials(),
    );
    // return res.serializeBinary(); //TODO FIXME, is a generator.
  });

  ipcMain.handle('IdentitiesAugmentKeynode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerMessage = clientPB.ProviderMessage.deserializeBinary(request);
    const res = await grpcClient.identitiesAugmentKeynode(
      providerMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('KeysDecrypt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const cryptoMessage = clientPB.CryptoMessage.deserializeBinary(request);
    const res = await grpcClient.keysDecrypt(
      cryptoMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('vaultsDeleteSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultSpecificMessage =
      clientPB.VaultSpecificMessage.deserializeBinary(request);
    await grpcClient.vaultsDeleteSecret(
      vaultSpecificMessage,
      await client.session.createJWTCallCredentials(),
    );
    return;
  });

  ipcMain.handle('vaultsDelete', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultMessage.deserializeBinary(request);
    const res = await grpcClient.vaultsDelete(
      vaultMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  //FIXME: remove?
  ipcMain.handle('DeriveKey', async (_event, _request) => {
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
    const res = await grpcClient.keysEncrypt(
      cryptoMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  //FIXME: nodesFind was removed, look into it.
  ipcMain.handle('NodesFind', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeMessage = clientPB.NodeMessage.deserializeBinary(request);
    // await grpcClient.nodesFind(
    //   nodeMessage,
    //   await client.session.createJWTCallCredentials(),
    // );
    return;
  });

  ipcMain.on('IdentityGetConnectedInfos', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerSearchMessage = new clientPB.ProviderSearchMessage();
    const connectedIdentitiesList =
      await grpcClient.identitiesGetConnectedInfos(
        providerSearchMessage,
        await client.session.createJWTCallCredentials(),
      );
    const data: Array<Uint8Array> = [];
    // for await (const identity of connectedIdentitiesList) { FIXME: generator?
    //   data.push(identity.serializeBinary());
    // }
    return data;
  });

  //Fixme, this is a generator isn't it?
  ipcMain.handle('IdentitiesGetInfo', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.identitiesGetInfo(
      emptyMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.on('IdentitiesDiscoverIdentity', async (_event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const gestaltMessage = clientPB.ProviderMessage.deserializeBinary(request);
    const res = await grpcClient.gestaltsDiscoverIdentity(
      gestaltMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.on('GestaltsDiscoverNode', async (_event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const gestaltMessage = clientPB.GestaltMessage.deserializeBinary(request);
    const res = await grpcClient.gestaltsDiscoverNode(
      gestaltMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('GestaltsList', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const knownGestalts = await grpcClient.gestaltsList(
      emptyMessage,
      await client.session.createJWTCallCredentials(),
    );

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
    const res = await grpcClient.gestaltsGetIdentitiy(
      providerMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('TrustGestalt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const actionMessage = clientPB.SetActionsMessage.deserializeBinary(request);
    switch (actionMessage.getNodeOrProviderCase()) {
      default:
      case SetActionsMessage.NodeOrProviderCase.NODE_OR_PROVIDER_NOT_SET: //Should throw an error.
      case SetActionsMessage.NodeOrProviderCase.NODE:
        await grpcClient.gestaltsSetActionByNode(
          actionMessage,
          await client.session.createJWTCallCredentials(),
        );
        break;
      case SetActionsMessage.NodeOrProviderCase.IDENTITY:
        await grpcClient.gestaltsSetActionByIdentity(
          actionMessage,
          await client.session.createJWTCallCredentials(),
        );
        break;
    }
  });

  ipcMain.handle('UntrustGestalt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const actionMessage = clientPB.SetActionsMessage.deserializeBinary(request);
    switch (actionMessage.getNodeOrProviderCase()) {
      default:
      case SetActionsMessage.NodeOrProviderCase.NODE_OR_PROVIDER_NOT_SET: //Should throw an error.
      case SetActionsMessage.NodeOrProviderCase.NODE:
        await grpcClient.gestaltsUnsetActionByNode(
          actionMessage,
          await client.session.createJWTCallCredentials(),
        );
        break;
      case SetActionsMessage.NodeOrProviderCase.IDENTITY:
        await grpcClient.gestaltsUnsetActionByIdentity(
          actionMessage,
          await client.session.createJWTCallCredentials(),
        );
        break;
    }
  });

  ipcMain.handle('GestaltIsTrusted', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const actionMessage = clientPB.SetActionsMessage.deserializeBinary(request);
    switch (actionMessage.getNodeOrProviderCase()) {
      default:
      case SetActionsMessage.NodeOrProviderCase.NODE_OR_PROVIDER_NOT_SET: //Should throw an error.
      case SetActionsMessage.NodeOrProviderCase.NODE: {
        const res = await grpcClient.gestaltsGetActionsByNode(
          actionMessage,
          await client.session.createJWTCallCredentials(),
        );
        return res.getActionList();
      }
      case SetActionsMessage.NodeOrProviderCase.IDENTITY: {
        const res = await grpcClient.gestaltsGetActionsByIdentity(
          actionMessage,
          await client.session.createJWTCallCredentials(),
        );
        return res.getActionList();
      }
    }
  });

  ipcMain.handle('GetOAuthClient', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.getOAuthClient.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.OAuthClientMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('NodesGetLocalInfo', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.nodesGetLocalDetails(
      emptyMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('NodesGetInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeMessage = clientPB.NodeMessage.deserializeBinary(request);
    const res = await grpcClient.nodesGetDetails(
      nodeMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('keysRootKeyPair', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const res = await grpcClient.keysRootKeyPair(
      emptyMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('certsGet', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    return grpcClient.certsGet(
      emptyMessage,
      await client.session.createJWTCallCredentials(),
    );
  });

  ipcMain.handle('vaultsGetSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultSpecificMessage =
      clientPB.VaultSpecificMessage.deserializeBinary(request);
    const res = await grpcClient.vaultsGetSecret(
      vaultSpecificMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('ListOAuthTokens', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // const res = (await promisifyGrpc(client.listOAuthTokens.bind(client))(
    //   new pb.EmptyMessage(),
    // )) as pb.StringListMessage;
    // return res.serializeBinary();
  });

  ipcMain.handle('Nodes-List', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = await clientPB.EmptyMessage;
    const nodesListGenerator = grpcClient.vaultsListSecrets(
      emptyMessage,
      await client.session.createJWTCallCredentials(),
    );
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
    const secretListGenerator = grpcClient.vaultsListSecrets(
      vaultMessage,
      await client.session.createJWTCallCredentials(),
    );
    const data: Array<Uint8Array> = [];
    for await (const vault of secretListGenerator) {
      data.push(vault.serializeBinary());
    }
    return data;
  });

  ipcMain.handle('vaultsList', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    const emptyMessage = new clientPB.EmptyMessage();
    const vaultListGenerator = await grpcClient.vaultsList(
      emptyMessage,
      await client.session.createJWTCallCredentials(),
    );
    const data: Array<Uint8Array> = [];
    for await (const vault of vaultListGenerator) {
      data.push(vault.serializeBinary());
    }
    return data;
  });

  ipcMain.handle('NewClientCertificate', async (_event, _request) => {
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
    const vaultMessage =
      clientPB.VaultSpecificMessage.deserializeBinary(request);
    await grpcClient.vaultsNewSecret(
      vaultMessage,
      await client.session.createJWTCallCredentials(),
    ); //NOTE: not returning success?
    return;
  });

  ipcMain.handle('NewOAuthToken', async (_event, _request) => {
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
    const res = await grpcClient.vaultsCreate(
      vaultMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('NodesPing', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeMessage = clientPB.NodeMessage.deserializeBinary(request);
    await grpcClient.nodesPing(
      nodeMessage,
      await client.session.createJWTCallCredentials(),
    );
    return;
  });

  ipcMain.handle('vaultsPull', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const vaultMessage = clientPB.VaultMessage.deserializeBinary(request);
    await grpcClient.vaultsPull(
      vaultMessage,
      await client.session.createJWTCallCredentials(),
    );
    return;
  });

  ipcMain.handle('RevokeOAuthToken', async (_event, _request) => {
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
    const vaultListGenerator = grpcClient.vaultsScan(
      vaultMessage,
      await client.session.createJWTCallCredentials(),
    );
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
    const res = await grpcClient.keysSign(
      cryptoMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  ipcMain.handle('ToggleStealthMode', async (_event, _request) => {
    if (!client) {
      await getAgentClient();
    }
    throw new Error('Not implemented.');
    // await promisifyGrpc(client.toggleStealthMode.bind(client))(
    //   pb.BooleanMessage.deserializeBinary(request),
    // );
    // return;
  });

  //FIXME:
  ipcMain.handle('NodesUpdateLocalInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeInfoMessage =
      clientPB.NodeDetailsMessage.deserializeBinary(request);
    // const res = await grpcClient.nodesUpdate(
    //   nodeInfoMessage,
    //   await client.session.createJWTCallCredentials(),
    // );
    return;
  });

  //FIXME, this should be removed.
  ipcMain.handle('NodesUpdateInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const nodeMessage = clientPB.NodeDetailsMessage.deserializeBinary(request);
    // await grpcClient.nodesUpdateInfo(
    //   nodeMessage,
    //   await client.session.createJWTCallCredentials(),
    // );
    return;
  });

  ipcMain.handle('vaultsEditSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const secretSpecificMessage =
      clientPB.SecretSpecificMessage.deserializeBinary(request);
    await grpcClient.vaultsEditSecret(
      secretSpecificMessage,
      await client.session.createJWTCallCredentials(),
    );
    return;
  });

  ipcMain.handle('keysVerify', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const cryptoMessage = clientPB.CryptoMessage.deserializeBinary(request);
    const res = await grpcClient.keysVerify(
      cryptoMessage,
      await client.session.createJWTCallCredentials(),
    );
    return res.serializeBinary();
  });

  /** Test handlers */
  ipcMain.handle('GestaltsSetIdentity', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const providerMessage = clientPB.ProviderMessage.deserializeBinary(request);
    await grpcClient.gestaltsGetIdentitiy(
      providerMessage,
      await client.session.createJWTCallCredentials(),
    );
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
