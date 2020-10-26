// import os from 'os'
// import path from 'path'
// import { ipcMain } from 'electron';
// import { PolykeyAgent, PeerInfo } from '@matrixai/polykey'
// import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
// import { promisifyGrpc } from '@matrixai/polykey/src/bin/utils';
// import { AgentClient } from '@matrixai/polykey/proto/compiled/Agent_grpc_pb';

// let polykeyPath: string
// let client: AgentClient

// async function getAgentClient(
//   polykeyPath: string
// ) {
//   // make sure agent is running
//   await PolykeyAgent.startAgent(polykeyPath, true, true);

//   const client: AgentClient = PolykeyAgent.connectToAgent(polykeyPath);
//   const res = (await promisifyGrpc(client.getStatus.bind(client))(new pb.EmptyMessage())) as pb.AgentStatusMessage;
//   if (res.getStatus() != pb.AgentStatusType.ONLINE) {
//     throw Error('agent is not running and could not be restarted');
//   } else {
//     return client;
//   }
// }

// async function startModel() {
//   ipcMain.handle('AddPeer', async (event, args) => {
//     const request = new pb.PeerInfoMessage
//     request.setPublicKey(args.publicKey)
//     request.setRelayPublicKey(args.relayPublicKey)
//     request.setPeerAddress(args.peerAddress)
//     request.setApiAddress(args.apiAddress)
//     const res = (await promisifyGrpc(client.addPeer.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('DecryptFile', async (event, args) => {
//     const request = new pb.DecryptFileMessage
//     request.setFilePath(args.filePath)
//     request.setPrivateKeyPath(args.privateKeyPath)
//     request.setPassphrase(args.passphrase)
//     const res = (await promisifyGrpc(client.decryptFile.bind(client))(request)) as pb.StringMessage;
//     return res.getS()
//   })

//   ipcMain.handle('DeleteKey', async (event, args) => {
//     const request = new pb.StringMessage
//     request.setS(args.keyName)
//     const res = (await promisifyGrpc(client.deleteKey.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('DeleteSecret', async (event, args) => {
//     const request = new pb.SecretPathMessage
//     request.setVaultName(args.vaultName)
//     request.setSecretName(args.secretName)
//     const res = (await promisifyGrpc(client.deleteSecret.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('DeleteVault', async (event, args) => {
//     const request = new pb.StringMessage
//     request.setS(args.vaultName)
//     const res = (await promisifyGrpc(client.deleteVault.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('DeriveKey', async (event, args) => {
//     const request = new pb.DeriveKeyMessage
//     request.setKeyName(args.keyName)
//     request.setPassphrase(args.passphrase)
//     const res = (await promisifyGrpc(client.deriveKey.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('EncryptFile', async (event, args) => {
//     const request = new pb.EncryptFileMessage
//     request.setFilePath(args.filePath)
//     request.setPublicKeyPath(args.publicKeyPath)
//     const res = (await promisifyGrpc(client.encryptFile.bind(client))(request)) as pb.StringMessage;
//     return res.getS()
//   })

//   ipcMain.handle('FindPeer', async (event, args) => {
//     const request = new pb.ContactPeerMessage
//     request.setPublicKeyOrHandle(args.publicKey)
//     request.setTimeout(args.timeout)
//     const res = (await promisifyGrpc(client.findPeer.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('FindSocialPeer', async (event, args) => {
//     const request = new pb.ContactPeerMessage
//     request.setPublicKeyOrHandle(args.handle)
//     request.setTimeout(args.timeout)
//     const res = (await promisifyGrpc(client.findSocialPeer.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('GetOAuthClient', async (event, args) => {
//     const res = (await promisifyGrpc(client.getOAuthClient.bind(client))(new pb.EmptyMessage)) as pb.OAuthClientMessage;
//     return {
//       id: res.getId(),
//       secret: res.getSecret()
//     }
//   })

//   ipcMain.handle('GetKey', async (event, args) => {
//     const request = new pb.StringMessage
//     request.setS(args.keyName)
//     const res = (await promisifyGrpc(client.getKey.bind(client))(request)) as pb.StringMessage;
//     return res.getS()
//   })

//   ipcMain.handle('GetLocalPeerInfo', async (event, args) => {
//     const res = (await promisifyGrpc(client.getLocalPeerInfo.bind(client))(new pb.EmptyMessage)) as pb.PeerInfoMessage;
//     return {
//       publicKey: res.getPublicKey(),
//       relayPublicKey: res.getRelayPublicKey(),
//       peerAddress: res.getPeerAddress(),
//       apiAddress: res.getApiAddress(),
//     }
//   })

//   ipcMain.handle('GetPeerInfo', async (event, args) => {
//     const request = new pb.StringMessage
//     request.setS(args.publicKey)
//     const res = (await promisifyGrpc(client.getPeerInfo.bind(client))(request)) as pb.PeerInfoMessage;
//     return {
//       publicKey: res.getPublicKey(),
//       relayPublicKey: res.getRelayPublicKey(),
//       peerAddress: res.getPeerAddress(),
//       apiAddress: res.getApiAddress(),
//     }
//   })

//   ipcMain.handle('GetPrimaryKeyPair', async (event, args) => {
//     const request = new pb.BooleanMessage
//     request.setB(args.includePublicKey)
//     const res = (await promisifyGrpc(client.getPrimaryKeyPair.bind(client))(request)) as pb.KeyPairMessage;
//     return {
//       publicKey: res.getPublicKey(),
//       privateKey: res.getPrivateKey(),
//     }
//   })

//   ipcMain.handle('GetRootCertificate', async (event, args) => {
//     const res = (await promisifyGrpc(client.getRootCertificate.bind(client))(new pb.EmptyMessage)) as pb.StringMessage;
//     return res.getS()
//   })

//   ipcMain.handle('GetSecret', async (event, args) => {
//     const request = new pb.SecretPathMessage
//     request.setVaultName(args.vaultName)
//     request.setSecretName(args.secretName)
//     const res = (await promisifyGrpc(client.getSecret.bind(client))(request)) as pb.StringMessage;
//     return res.getS()
//   })

//   ipcMain.handle('GetStatus', async (event, args) => {
//     const res = (await promisifyGrpc(client.getStatus.bind(client))(new pb.EmptyMessage)) as pb.AgentStatusMessage;
//     return res.getStatus().toString()
//   })

//   ipcMain.handle('ListOAuthTokens', async (event, args) => {
//     const res = (await promisifyGrpc(client.listOAuthTokens.bind(client))(new pb.EmptyMessage)) as pb.StringListMessage;
//     return res.getSList()
//   })

//   ipcMain.handle('ListKeys', async (event, args) => {
//     const res = (await promisifyGrpc(client.listKeys.bind(client))(new pb.EmptyMessage)) as pb.StringListMessage;
//     return res.getSList()
//   })

//   ipcMain.handle('ListPeers', async (event, args) => {
//     const res = (await promisifyGrpc(client.listPeers.bind(client))(new pb.EmptyMessage)) as pb.StringListMessage;
//     return res.getSList()
//   })

//   ipcMain.handle('ListSecrets', async (event, args) => {
//     const request = new pb.StringMessage
//     request.setS(args.vaultName)
//     const res = (await promisifyGrpc(client.listSecrets.bind(client))(request)) as pb.StringListMessage;
//     return res.getSList()
//   })

//   ipcMain.handle('ListVaults', async (event, args) => {
//     const res = (await promisifyGrpc(client.listVaults.bind(client))(new pb.EmptyMessage)) as pb.StringListMessage;
//     return res.getSList()
//   })

//   // ipcMain.handle('LockNode', async (event, args) => {
//   //   const res = (await promisifyGrpc(client.lockNode.bind(client))(new pb.EmptyMessage)) as pb.EmptyMessage;
//   //   return
//   // })

//   ipcMain.handle('NewClientCertificate', async (event, args) => {
//     const request = new pb.NewClientCertificateMessage
//     request.setDomain(args.domain)
//     request.setCertFile(args.certFile)
//     request.setKeyFile(args.keyFile)
//     const res = (await promisifyGrpc(client.newClientCertificate.bind(client))(request)) as pb.NewClientCertificateMessage;
//     return {
//       cert: res.getCertFile(),
//       key: res.getKeyFile(),
//     }
//   })

//   ipcMain.handle('NewNode', async (event, args) => {
//     const request = new pb.NewNodeMessage
//     request.setUserid(args.userId)
//     request.setPassphrase(args.passphrase)
//     request.setNbits(args.nbits)
//     const res = (await promisifyGrpc(client.newNode.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('NewSecret', async (event, args) => {
//     const request = new pb.SecretContentMessage
//     const secretPath = new pb.SecretPathMessage
//     secretPath.setVaultName(args.vaultName)
//     secretPath.setSecretName(args.secretName)
//     request.setSecretPath(secretPath)
//     if (args.secretContent) {
//       request.setSecretContent(args.secretContent)
//     } else if (args.secretFilePath) {
//       request.setSecretFilePath(args.secretFilePath)
//     } else {
//       throw Error('either secret content or secret file path must be specified')
//     }
//     const res = (await promisifyGrpc(client.newSecret.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('NewOAuthToken', async (event, args) => {
//     const request = new pb.NewOAuthTokenMessage
//     request.setScopesList(args.scopesList)
//     request.setExpiry(args.expiry)

//     const res = (await promisifyGrpc(client.newOAuthToken.bind(client))(request)) as pb.StringMessage;
//     return res.getS()
//   })

//   ipcMain.handle('NewVault', async (event, args) => {
//     const request = new pb.StringMessage
//     request.setS(args.vaultName)

//     const res = (await promisifyGrpc(client.newVault.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('PingPeer', async (event, args) => {
//     const request = new pb.ContactPeerMessage
//     request.setPublicKeyOrHandle(args.publicKey)
//     request.setTimeout(args.timeout)

//     const res = (await promisifyGrpc(client.pingPeer.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('PullVault', async (event, args) => {
//     const request = new pb.VaultPathMessage
//     request.setPublicKey(args.publicKey)
//     request.setVaultName(args.vaultName)

//     const res = (await promisifyGrpc(client.pullVault.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('RevokeOAuthToken', async (event, args) => {
//     const request = new pb.StringMessage
//     request.setS(args.token)

//     const res = (await promisifyGrpc(client.revokeOAuthToken.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })

//   ipcMain.handle('ScanVaultNames', async (event, args) => {
//     const request = new pb.StringMessage
//     request.setS(args.token)

//     const res = (await promisifyGrpc(client.revokeOAuthToken.bind(client))(request)) as pb.BooleanMessage;
//     return res.getB()
//   })














//   ipcMain.on('agent-restart', async (event, args) => {
//     const polykeyPath = args.polykeyPath
//     try {
//       // Its a call to the polykey agent, so need to first make sure its running
//       const pid = <number>(await PolykeyAgent.startAgent(polykeyPath))

//       event.reply('agent-start', pid)
//     } catch (error) {
//       console.log(error);
//     }
//   })

//   ipcMain.on('agent-start', async (event, args) => {
//     const polykeyPath = args.polykeyPath
//     try {
//       // Its a call to the polykey agent, so need to first make sure its running
//       const pid = <number>(await PolykeyAgent.startAgent(polykeyPath))

//       event.reply('agent-start', pid)
//     } catch (error) {
//       console.log(error);
//     }
//   })
// }

// export default startModel
