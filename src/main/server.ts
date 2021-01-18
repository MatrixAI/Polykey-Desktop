import os from 'os';
import { ipcMain, clipboard } from 'electron';
import { promisifyGrpc } from './utils';
import { PolykeyAgent, PeerInfo } from '@matrixai/polykey';
import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
import { AgentClient } from '@matrixai/polykey/proto/compiled/Agent_grpc_pb';

const polykeyPath: string = resolveTilde('~/.polykey');
let client: AgentClient;

async function getAgentClient(failOnNotInitialized = false) {
  // make sure agent is running
  console.log(polykeyPath);

  await PolykeyAgent.startAgent(polykeyPath, false, failOnNotInitialized);

  client = PolykeyAgent.connectToAgent(polykeyPath);

  const res = (await promisifyGrpc(client.getStatus.bind(client))(new pb.EmptyMessage())) as pb.AgentStatusMessage;
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
    try {
      const client = PolykeyAgent.connectToAgent(polykeyPath);

      const res = (await promisifyGrpc(client.getStatus.bind(client))(new pb.EmptyMessage())) as pb.AgentStatusMessage;
      if (res.getStatus() !== pb.AgentStatusType.ONLINE) {
        throw Error('agent is not running');
      }
    } catch (error) {
      try {
        const pid = await PolykeyAgent.startAgent(polykeyPath, true);
        client = PolykeyAgent.connectToAgent(polykeyPath);
        const res = (await promisifyGrpc(client.getStatus.bind(client))(
          new pb.EmptyMessage()
        )) as pb.AgentStatusMessage;
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
    const pid = <number>await PolykeyAgent.startAgent(polykeyPath);
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
    const res = (await promisifyGrpc(client.addPeer.bind(client))(
      pb.PeerInfoMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('AddPeerB64', async (event, b64String) => {
    if (!client) {
      await getAgentClient();
    }
    const { publicKey, rootCertificate, peerAddress, apiAddress } = PeerInfo.parseB64(b64String);
    const request = new pb.PeerInfoMessage();
    request.setPublicKey(publicKey);
    request.setRootCertificate(rootCertificate);
    if (peerAddress) {
      request.setPeerAddress(peerAddress.toString());
    }
    if (apiAddress) {
      request.setApiAddress(apiAddress.toString());
    }
    const res = (await promisifyGrpc(client.addPeer.bind(client))(request)) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('DecryptFile', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.decryptFile.bind(client))(
      pb.DecryptFileMessage.deserializeBinary(request)
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('DeleteKey', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.deleteKey.bind(client))(
      pb.StringMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('DeleteSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.deleteSecret.bind(client))(
      pb.SecretPathMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('DeleteVault', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.deleteVault.bind(client))(
      pb.StringMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('DeriveKey', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.deriveKey.bind(client))(
      pb.DeriveKeyMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('EncryptFile', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.encryptFile.bind(client))(
      pb.EncryptFileMessage.deserializeBinary(request)
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('FindPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.findPeer.bind(client))(
      pb.ContactPeerMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('FindSocialPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.findSocialPeer.bind(client))(
      pb.ContactPeerMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetOAuthClient', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getOAuthClient.bind(client))(
      new pb.EmptyMessage()
    )) as pb.OAuthClientMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetKey', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getKey.bind(client))(
      pb.StringMessage.deserializeBinary(request)
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetLocalPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getLocalPeerInfo.bind(client))(
      new pb.EmptyMessage()
    )) as pb.PeerInfoMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getPeerInfo.bind(client))(
      pb.StringMessage.deserializeBinary(request)
    )) as pb.PeerInfoMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetPrimaryKeyPair', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getPrimaryKeyPair.bind(client))(
      pb.BooleanMessage.deserializeBinary(request)
    )) as pb.KeyPairMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetRootCertificate', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getRootCertificate.bind(client))(
      new pb.EmptyMessage()
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getSecret.bind(client))(
      pb.SecretPathMessage.deserializeBinary(request)
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('GetStatus', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.getStatus.bind(client))(new pb.EmptyMessage())) as pb.AgentStatusMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListOAuthTokens', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listOAuthTokens.bind(client))(
      new pb.EmptyMessage()
    )) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListKeys', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listKeys.bind(client))(new pb.EmptyMessage())) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListPeers', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listPeers.bind(client))(new pb.EmptyMessage())) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListSecrets', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listSecrets.bind(client))(
      pb.StringMessage.deserializeBinary(request)
    )) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ListVaults', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.listVaults.bind(client))(new pb.EmptyMessage())) as pb.StringListMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('LockNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    (await promisifyGrpc(client.lockNode.bind(client))(new pb.EmptyMessage())) as pb.EmptyMessage;
  });

  ipcMain.handle('NewClientCertificate', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.newClientCertificate.bind(client))(
      pb.NewClientCertificateMessage.deserializeBinary(request)
    )) as pb.NewClientCertificateMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('NewNode', async (event, request) => {
    await getAgentClient(false);
    const res = (await promisifyGrpc(client.newNode.bind(client))(
      pb.NewNodeMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('NewSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.newSecret.bind(client))(
      pb.SecretContentMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('NewOAuthToken', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.newOAuthToken.bind(client))(
      pb.NewOAuthTokenMessage.deserializeBinary(request)
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('NewVault', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.newVault.bind(client))(
      pb.StringMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('PingPeer', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.pingPeer.bind(client))(
      pb.ContactPeerMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('PullVault', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.pullVault.bind(client))(
      pb.VaultPathMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('RevokeOAuthToken', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.revokeOAuthToken.bind(client))(
      pb.StringMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ScanVaultNames', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.scanVaultNames.bind(client))(
      pb.StringMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('SignFile', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.signFile.bind(client))(
      pb.SignFileMessage.deserializeBinary(request)
    )) as pb.StringMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('StopAgent', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.stopAgent.bind(client))(new pb.EmptyMessage())) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('ToggleStealthMode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.toggleStealthMode.bind(client))(
      pb.BooleanMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('UnlockNode', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.unlockNode.bind(client))(
      pb.UnlockNodeMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('UpdateLocalPeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.updateLocalPeerInfo.bind(client))(
      pb.PeerInfoMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('UpdatePeerInfo', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.updatePeerInfo.bind(client))(
      pb.PeerInfoMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('UpdateSecret', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.updateSecret.bind(client))(
      pb.SecretContentMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });

  ipcMain.handle('VerifyFile', async (event, request) => {
    if (!client) {
      await getAgentClient();
    }
    const res = (await promisifyGrpc(client.verifyFile.bind(client))(
      pb.VerifyFileMessage.deserializeBinary(request)
    )) as pb.BooleanMessage;
    return res.serializeBinary();
  });
}

export default setHandlers;
export { polykeyPath };
