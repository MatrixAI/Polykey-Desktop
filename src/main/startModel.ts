// import path from 'path'
// import os from 'os'
// import { ipcMain } from 'electron';
// import {PolykeyAgent} from '@matrixai/polykey';
// import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
// import { AgentClient } from '@matrixai/polykey/proto/compiled/Agent_grpc_pb';
// import { promisifyGrpc } from './utils';

// let polykeyPath: string = path.join(os.homedir(), '.polykey');
// let client: AgentClient;

// async function getAgentClient() {
//   // make sure agent is running
//   await PolykeyAgent.startAgent(polykeyPath, true, true);

//   client = PolykeyAgent.connectToAgent(polykeyPath);

//   const res = (await promisifyGrpc(client.getStatus.bind(client))(new pb.EmptyMessage())) as pb.AgentStatusMessage;
//   console.log(res.getStatus());

//   if (res.getStatus() != pb.AgentStatusType.ONLINE) {
//     throw Error('agent is not running and could not be restarted');
//   }
// }

// async function startModel() {
//   await getAgentClient()
//   ///////////////////
//   // agent control //
//   ///////////////////
//   ipcMain.handle('agent-restart', async (event, request) => {
//     await promisifyGrpc(client.stopAgent.bind(client))(new pb.EmptyMessage());
//     const pid = <number>await PolykeyAgent.startAgent(polykeyPath);
//     await getAgentClient()
//     return pid;
//   });

//   ipcMain.handle('agent-start', async (event, request) => {
//     const pid = <number>await PolykeyAgent.startAgent(polykeyPath);
//     await getAgentClient()
//     return pid;
//   });

//   ////////////////////
//   // agent handlers //
//   ////////////////////
//   ipcMain.handle('AddPeer', async (event, request) => {
//     const res = (await promisifyGrpc(client.addPeer.bind(client))(pb.PeerInfoMessage.deserializeBinary(request))) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('DecryptFile', async (event, request) => {
//     const res = (await promisifyGrpc(client.decryptFile.bind(client))(pb.DecryptFileMessage.deserializeBinary(request))) as pb.StringMessage;
//     return res.getS();
//   });

//   ipcMain.handle('DeleteKey', async (event, request) => {
//     const res = (await promisifyGrpc(client.deleteKey.bind(client))(pb.StringMessage.deserializeBinary(request)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('DeleteSecret', async (event, request) => {
//     const request = new pb.SecretPathMessage();
//     request.setVaultName(request.vaultName);
//     request.setSecretName(request.secretName);
//     const res = (await promisifyGrpc(client.deleteSecret.bind(client))(pb.SecretPathMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('DeleteVault', async (event, request) => {
//     const request = new pb.StringMessage();
//     request.setS(request.vaultName);
//     const res = (await promisifyGrpc(client.deleteVault.bind(client))(pb.StringMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('DeriveKey', async (event, request) => {
//     const request = new pb.DeriveKeyMessage();
//     request.setKeyName(request.keyName);
//     request.setPassphrase(request.passphrase);
//     const res = (await promisifyGrpc(client.deriveKey.bind(client))(pb.DeriveKeyMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('EncryptFile', async (event, request) => {
//     const request = new pb.EncryptFileMessage();
//     request.setFilePath(request.filePath);
//     request.setPublicKeyPath(request.publicKeyPath);
//     const res = (await promisifyGrpc(client.encryptFile.bind(client))(pb.EncryptFileMessage)) as pb.StringMessage;
//     return res.getS();
//   });

//   ipcMain.handle('FindPeer', async (event, request) => {
//     const request = new pb.ContactPeerMessage();
//     request.setPublicKeyOrHandle(request.publicKey);
//     request.setTimeout(request.timeout);
//     const res = (await promisifyGrpc(client.findPeer.bind(client))(pb.ContactPeerMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('FindSocialPeer', async (event, request) => {
//     const request = new pb.ContactPeerMessage();
//     request.setPublicKeyOrHandle(request.handle);
//     request.setTimeout(request.timeout);
//     const res = (await promisifyGrpc(client.findSocialPeer.bind(client))(pb.ContactPeerMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('GetOAuthClient', async (event, request) => {
//     const res = (await promisifyGrpc(client.getOAuthClient.bind(client))(
//       new pb.EmptyMessage(),
//     )) as pb.OAuthClientMessage;
//     return {
//       id: res.getId(),
//       secret: res.getSecret(),
//     };
//   });

//   ipcMain.handle('GetKey', async (event, request) => {
//     const request = new pb.StringMessage();
//     request.setS(request.keyName);
//     const res = (await promisifyGrpc(client.getKey.bind(client))(pb.StringMessage)) as pb.StringMessage;
//     return res.getS();
//   });

//   ipcMain.handle('GetLocalPeerInfo', async (event, request) => {
//     const res = (await promisifyGrpc(client.getLocalPeerInfo.bind(client))(
//       new pb.EmptyMessage(),
//     )) as pb.PeerInfoMessage;
//     return {
//       publicKey: res.getPublicKey(),
//       relayPublicKey: res.getRelayPublicKey(),
//       peerAddress: res.getPeerAddress(),
//       apiAddress: res.getApiAddress(),
//     };
//   });

//   ipcMain.handle('GetPeerInfo', async (event, request) => {
//     const request = new pb.StringMessage();
//     request.setS(request.publicKey);
//     const res = (await promisifyGrpc(client.getPeerInfo.bind(client))(pb.StringMessage)) as pb.PeerInfoMessage;
//     return {
//       publicKey: res.getPublicKey(),
//       relayPublicKey: res.getRelayPublicKey(),
//       peerAddress: res.getPeerAddress(),
//       apiAddress: res.getApiAddress(),
//     };
//   });

//   ipcMain.handle('GetPrimaryKeyPair', async (event, request) => {
//     const request = new pb.BooleanMessage();
//     request.setB(request.includePublicKey);
//     const res = (await promisifyGrpc(client.getPrimaryKeyPair.bind(client))(pb.BooleanMessage)) as pb.KeyPairMessage;
//     return {
//       publicKey: res.getPublicKey(),
//       privateKey: res.getPrivateKey(),
//     };
//   });

//   ipcMain.handle('GetRootCertificate', async (event, request) => {
//     const res = (await promisifyGrpc(client.getRootCertificate.bind(client))(
//       new pb.EmptyMessage(),
//     )) as pb.StringMessage;
//     return res.getS();
//   });

//   ipcMain.handle('GetSecret', async (event, request) => {
//     const request = new pb.SecretPathMessage();
//     request.setVaultName(request.vaultName);
//     request.setSecretName(request.secretName);
//     const res = (await promisifyGrpc(client.getSecret.bind(client))(pb.SecretPathMessage)) as pb.StringMessage;
//     return res.getS();
//   });

//   ipcMain.handle('GetStatus', async (event, request) => {
//     const res = (await promisifyGrpc(client.getStatus.bind(client))(new pb.EmptyMessage())) as pb.AgentStatusMessage;
//     return res.getStatus().toString();
//   });

//   ipcMain.handle('ListOAuthTokens', async (event, request) => {
//     const res = (await promisifyGrpc(client.listOAuthTokens.bind(client))(
//       new pb.EmptyMessage(),
//     )) as pb.StringListMessage;
//     return res.getSList();
//   });

//   ipcMain.handle('ListKeys', async (event, request) => {
//     const res = (await promisifyGrpc(client.listKeys.bind(client))(new pb.EmptyMessage())) as pb.StringListMessage;
//     return res.getSList();
//   });

//   ipcMain.handle('ListPeers', async (event, request) => {
//     const res = (await promisifyGrpc(client.listPeers.bind(client))(new pb.EmptyMessage())) as pb.StringListMessage;
//     return res.getSList();
//   });

//   ipcMain.handle('ListSecrets', async (event, request) => {
//     const request = new pb.StringMessage();
//     request.setS(request.vaultName);
//     const res = (await promisifyGrpc(client.listSecrets.bind(client))(pb.StringMessage)) as pb.StringListMessage;
//     return res.getSList();
//   });

//   ipcMain.handle('ListVaults', async (event, request) => {
//     const res = (await promisifyGrpc(client.listVaults.bind(client))(new pb.EmptyMessage())) as pb.StringListMessage;
//     return res.getSList();
//   });

//   // ipcMain.handle('LockNode', async (event, request) => {
//   //   const res = (await promisifyGrpc(client.lockNode.bind(client))(new pb.EmptyMessage)) as pb.EmptyMessage;
//   //   return
//   // })

//   ipcMain.handle('NewClientCertificate', async (event, request) => {
//     const request = new pb.NewClientCertificateMessage();
//     request.setDomain(request.domain);
//     request.setCertFile(request.certFile);
//     request.setKeyFile(request.keyFile);
//     const res = (await promisifyGrpc(client.newClientCertificate.bind(client))(
//       pb.NewClientCertificateMessage
//     )) as pb.NewClientCertificateMessage;
//     return {
//       cert: res.getCertFile(),
//       key: res.getKeyFile(),
//     };
//   });

//   ipcMain.handle('NewNode', async (event, request) => {
//     const request = new pb.NewNodeMessage();
//     request.setUserid(request.userId);
//     request.setPassphrase(request.passphrase);
//     request.setNbits(request.nbits);
//     const res = (await promisifyGrpc(client.newNode.bind(client))(pb.NewNodeMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('NewSecret', async (event, request) => {
//     const request = new pb.SecretContentMessage();
//     const secretPath = new pb.SecretPathMessage();
//     secretPath.setVaultName(request.vaultName);
//     secretPath.setSecretName(request.secretName);
//     request.setSecretPath(secretPath);
//     if (request.secretContent) {
//       request.setSecretContent(request.secretContent);
//     } else if (request.secretFilePath) {
//       request.setSecretFilePath(request.secretFilePath);
//     } else {
//       throw Error('either secret content or secret file path must be specified');
//     }
//     const res = (await promisifyGrpc(client.newSecret.bind(client))(pb.SecretContentMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('NewOAuthToken', async (event, request) => {
//     const request = new pb.NewOAuthTokenMessage();
//     request.setScopesList(request.scopesList);
//     request.setExpiry(request.expiry);

//     const res = (await promisifyGrpc(client.newOAuthToken.bind(client))(pb.NewOAuthTokenMessage)) as pb.StringMessage;
//     return res.getS();
//   });

//   ipcMain.handle('NewVault', async (event, request) => {
//     const request = new pb.StringMessage();
//     request.setS(request.vaultName);

//     const res = (await promisifyGrpc(client.newVault.bind(client))(pb.StringMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('PingPeer', async (event, request) => {
//     const request = new pb.ContactPeerMessage();
//     request.setPublicKeyOrHandle(request.publicKey);
//     request.setTimeout(request.timeout);

//     const res = (await promisifyGrpc(client.pingPeer.bind(client))(pb.ContactPeerMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('PullVault', async (event, request) => {
//     const request = new pb.VaultPathMessage();
//     request.setPublicKey(request.publicKey);
//     request.setVaultName(request.vaultName);

//     const res = (await promisifyGrpc(client.pullVault.bind(client))(pb.VaultPathMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('RevokeOAuthToken', async (event, request) => {
//     const request = new pb.StringMessage();
//     request.setS(request.token);

//     const res = (await promisifyGrpc(client.revokeOAuthToken.bind(client))(pb.StringMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('ScanVaultNames', async (event, request) => {
//     const request = new pb.StringMessage();
//     request.setS(request.token);

//     const res = (await promisifyGrpc(client.revokeOAuthToken.bind(client))(pb.StringMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('SignFile', async (event, request) => {
//     const request = new pb.SignFileMessage();
//     request.setFilePath(request.filePath);
//     request.setPrivateKeyPath(request.privateKeyPath);
//     request.setPassphrase(request.passphrase);

//     const res = (await promisifyGrpc(client.signFile.bind(client))(pb.SignFileMessage)) as pb.StringMessage;
//     return res.getS();
//   });

//   ipcMain.handle('StopAgent', async (event, request) => {
//     const res = (await promisifyGrpc(client.stopAgent.bind(client))(new pb.EmptyMessage())) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('ToggleStealthMode', async (event, request) => {
//     const request = new pb.BooleanMessage();
//     request.setB(request.activate);

//     const res = (await promisifyGrpc(client.toggleStealthMode.bind(client))(pb.BooleanMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   // ipcMain.handle('UnlockNode', async (event, request) => {
//   //   const request = new pb.UnlockNodeMessage
//   //   request.setPassphrase(request.passphrase)
//   //   request.setTimeout(request.timeout)

//   //   const res = (await promisifyGrpc(client.unlockNode.bind(client))(request)) as pb.BooleanMessage;
//   //   return res.getB()
//   // })

//   ipcMain.handle('UpdateLocalPeerInfo', async (event, request) => {
//     const request = new pb.PeerInfoMessage();
//     request.setPublicKey(request.publicKey);
//     request.setRelayPublicKey(request.relayPublicKey);
//     request.setPeerAddress(request.peerAddress);
//     request.setApiAddress(request.apiAddress);

//     const res = (await promisifyGrpc(client.updateLocalPeerInfo.bind(client))(pb.PeerInfoMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('UpdatePeerInfo', async (event, request) => {
//     const request = new pb.PeerInfoMessage();
//     request.setPublicKey(request.publicKey);
//     request.setRelayPublicKey(request.relayPublicKey);
//     request.setPeerAddress(request.peerAddress);
//     request.setApiAddress(request.apiAddress);

//     const res = (await promisifyGrpc(client.updatePeerInfo.bind(client))(pb.PeerInfoMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('UpdateSecret', async (event, request) => {
//     const request = new pb.SecretContentMessage();
//     const secretPath = new pb.SecretPathMessage();
//     secretPath.setVaultName(request.vaultName);
//     secretPath.setSecretName(request.secretName);
//     request.setSecretPath(secretPath);
//     if (request.secretContent) {
//       request.setSecretContent(request.secretContent);
//     } else if (request.secretFilePath) {
//       request.setSecretFilePath(request.secretFilePath);
//     } else {
//       throw Error('either secret content or secret file path must be specified');
//     }

//     const res = (await promisifyGrpc(client.updateSecret.bind(client))(pb.SecretContentMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });

//   ipcMain.handle('VerifyFile', async (event, request) => {
//     const request = new pb.VerifyFileMessage();
//     request.setFilePath(request.filePath);
//     request.setPublicKeyPath(request.publicKeyPath);

//     const res = (await promisifyGrpc(client.verifyFile.bind(client))(pb.VerifyFileMessage)) as pb.BooleanMessage;
//     return res.getB();
//   });
// }

// export default startModel;
