import os from 'os';
import fixPath from 'fix-path';
import { ipcMain, clipboard } from 'electron';
import { PolykeyAgent, promisifyGrpc } from '@matrixai/polykey';
import * as pb from '@matrixai/polykey/dist/proto/js/Agent_pb';
import { AgentClient } from '@matrixai/polykey/dist/proto/js/Agent_grpc_pb';
import { getDefaultNodePath } from './utils';

fixPath();

/** This will default for now */
const polykeyPath = getDefaultNodePath();
let client: AgentClient;

async function getAgentClient(failOnNotInitialized = false) {
  // make sure agent is running
  console.log('starting....');
  console.log(polykeyPath);

  await PolykeyAgent.startAgent(polykeyPath, true, failOnNotInitialized, true);

  console.log('done starting agent..');
  client = PolykeyAgent.connectToAgent(polykeyPath);

  const res = (await promisifyGrpc(client.getStatus.bind(client))(
    new pb.EmptyMessage(),
  )) as pb.AgentStatusMessage;
  console.log(res.getStatus());

  if (res.getStatus() !== pb.AgentStatusType.ONLINE) {
    throw Error('agent is not running and could not be restarted');
  }
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
      const tempClient = PolykeyAgent.connectToAgent(
        polykeyPath,
      ) as AgentClient;

      console.log('getStatus');
      const res = (await promisifyGrpc(tempClient.getStatus.bind(tempClient))(
        new pb.EmptyMessage(),
      )) as pb.AgentStatusMessage;
      console.log('done2');
      if (res.getStatus() !== pb.AgentStatusType.ONLINE) {
        throw Error('agent is not running');
      }
      // it is here that we know that the agent is running and client is initialize
    } catch (error) {
      try {
        // agent is offline so we start it!
        console.log('startAgent');
        const pid = await PolykeyAgent.startAgent(
          polykeyPath,
          true,
          true,
          true,
        );
        console.log('connectToAgent');
        const tempClient = PolykeyAgent.connectToAgent(polykeyPath);
        // we just confirm that the agent has actually been started
        // if not, it is most likely not initalize so we just throw the error for the frontend to handle
        console.log('getStatus');
        const res = (await promisifyGrpc(tempClient.getStatus.bind(tempClient))(
          new pb.EmptyMessage(),
        )) as pb.AgentStatusMessage;
        console.log('done');
        if (res.getStatus() !== pb.AgentStatusType.ONLINE) {
          throw Error('agent could not be started');
        }
        return pid;
      } catch (error) {
        throw Error(error.message);
      }
    }
  });

  ipcMain.handle('agent-restart', async (event, request) => {
    const client = PolykeyAgent.connectToAgent(polykeyPath);
    await promisifyGrpc(client.stopAgent.bind(client))(new pb.EmptyMessage());
    const pid = <number>(
      await PolykeyAgent.startAgent(polykeyPath, true, false, true)
    );
    await getAgentClient();
    return pid;
  });

  /// /////////////////
  // agent handlers //
  /// /////////////////
  ipcMain.handle('AddPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.addNode.bind(client))(
      pb.NodeInfoReadOnlyMessage.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('AuthenticateProvider', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.authenticateProvider.bind(client))(
      pb.AuthenticateProviderRequest.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('AugmentKeynode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.augmentKeynode.bind(client))(
      pb.AugmentKeynodeRequest.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('DecryptFile', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.decryptFile.bind(client))(
      pb.DecryptFileMessage.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('DeleteKey', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.deleteKey.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('DeleteSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.deleteSecret.bind(client))(
      pb.SecretPathMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('DeleteVault', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.deleteVault.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('DeriveKey', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.deriveKey.bind(client))(
      pb.DeriveKeyMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('EncryptFile', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.encryptFile.bind(client))(
      pb.EncryptFileMessage.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('FindPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.findNode.bind(client))(
      pb.ContactNodeMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.on('GetConnectedIdentityInfos-message', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const responseStream = client.getConnectedIdentityInfos(
      pb.ProviderSearchMessage.deserializeBinary(request),
    );

    responseStream.on('data', async (identityInfo: pb.IdentityInfoMessage) => {
      console.log('recieving data');
      event.reply(
        'GetConnectedIdentityInfos-reply',
        identityInfo.serializeBinary(),
      );
    });

    // responseStream.on('error', () => {});
    // responseStream.on('end', () => {});
  });

  ipcMain.handle('GetIdentityInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getIdentityInfo.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.IdentityInfo;

    return res.serializeBinary();
  });

  ipcMain.on('DiscoverGestaltIdentity-message', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const responseStream = client.discoverGestaltIdentity(
      pb.IdentityMessage.deserializeBinary(request),
    );

    responseStream.on('data', async () => {
      const res = (await promisifyGrpc(client.getGestalts.bind(client))(
        new pb.EmptyMessage(),
      )) as pb.GestaltListMessage;
      event.reply('DiscoverGestaltIdentity-reply', res.serializeBinary());
    });
    // responseStream.on('error', () => {});
    // responseStream.on('end', () => {});
  });

  ipcMain.on('DiscoverGestaltNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const responseStream = client.discoverGestaltNode(
      pb.IdentityMessage.deserializeBinary(request),
    );

    responseStream.on('data', async () => {
      const res = (await promisifyGrpc(client.getGestalts.bind(client))(
        new pb.EmptyMessage(),
      )) as pb.GestaltListMessage;
      event.reply(res.serializeBinary());
    });
    // responseStream.on('error', () => {});
    // responseStream.on('end', () => {});
  });

  ipcMain.handle('GetGestalts', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getGestalts.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.GestaltListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetGestaltByIdentity', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getGestaltByIdentity.bind(client))(
      pb.IdentityMessage.deserializeBinary(request),
    )) as pb.GestaltMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('TrustGestalt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.trustGestalt.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    )) as pb.EmptyMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('UntrustGestalt', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.untrustGestalt.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    )) as pb.EmptyMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GestaltIsTrusted', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.gestaltIsTrusted.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetOAuthClient', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getOAuthClient.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.OAuthClientMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetKey', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getKey.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetLocalPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getLocalNodeInfo.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.NodeInfoMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getNodeInfo.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    )) as pb.NodeInfoMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetPrimaryKeyPair', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getPrimaryKeyPair.bind(client))(
      pb.BooleanMessage.deserializeBinary(request),
    )) as pb.KeyPairMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetRootCertificate', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getRootCertificate.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.StringMessage;
    return res.getS();
  });

  ipcMain.handle('GetSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getSecret.bind(client))(
      pb.SecretPathMessage.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetStatus', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getStatus.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.AgentStatusMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListOAuthTokens', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listOAuthTokens.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListKeys', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listKeys.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListPeers', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listNodes.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListSecrets', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listSecrets.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    )) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListVaults', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listVaults.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('LockNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    (await promisifyGrpc(client.lockNode.bind(client))(
      new pb.EmptyMessage(),
    )) as pb.EmptyMessage;
  });

  ipcMain.handle('NewClientCertificate', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.newClientCertificate.bind(client))(
      pb.NewClientCertificateMessage.deserializeBinary(request),
    )) as pb.NewClientCertificateMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('InitializeKeyNode', async (event, request) => {
    await getAgentClient(false);
    await promisifyGrpc(client.initializeNode.bind(client))(
      pb.NewKeyPairMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('NewSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.newSecret.bind(client))(
      pb.SecretContentMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('NewOAuthToken', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.newOAuthToken.bind(client))(
      pb.NewOAuthTokenMessage.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('NewVault', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.newVault.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('PingPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.pingNode.bind(client))(
      pb.ContactNodeMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('PullVault', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.pullVault.bind(client))(
      pb.VaultPathMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('RevokeOAuthToken', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.revokeOAuthToken.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('ScanVaultNames', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.scanVaultNames.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    )) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('SignFile', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.signFile.bind(client))(
      pb.SignFileMessage.deserializeBinary(request),
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('StopAgent', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.stopAgent.bind(client))(new pb.EmptyMessage());
    return;
  });

  ipcMain.handle('ToggleStealthMode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.toggleStealthMode.bind(client))(
      pb.BooleanMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('UnlockNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.unlockNode.bind(client))(
      pb.UnlockNodeMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('UpdateLocalPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.updateLocalNodeInfo.bind(client))(
      pb.NodeInfoMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('UpdatePeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.updateNodeInfo.bind(client))(
      pb.NodeInfoReadOnlyMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('UpdateSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.updateSecret.bind(client))(
      pb.SecretContentMessage.deserializeBinary(request),
    );
    return;
  });

  ipcMain.handle('VerifyFile', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.verifyFile.bind(client))(
      pb.VerifyFileMessage.deserializeBinary(request),
    );
    return;
  });

  /** Test handlers */
  ipcMain.handle('SetIdentity', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    await promisifyGrpc(client.setIdentity.bind(client))(
      pb.StringMessage.deserializeBinary(request),
    );
    return;
  });
}

export default setHandlers;
export { polykeyPath };
