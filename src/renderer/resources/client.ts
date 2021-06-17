// import * as pb from '@matrixai/polykey/dist/proto/js/Agent_pb';
// import * as pb from '@matrixai/polykey/dist/proto/js/Client_pb'
import { clientPB } from '@matrixai/polykey/src/client';
import { promises } from "dns";
// import commandSecretEnv from '../../../../js-polykey/dist/bin/secrets/commandSecretEnv';
// import client from '@/renderer/resources/client';
const ipcRenderer = window.require('electron').ipcRenderer;
// import { ipcRenderer } from 'electron';git

class PolykeyClient {
  /// ////////////////////
  // Clipboard control //
  /// ////////////////////
  static async ClipboardCopy(secretContent: string): Promise<void> {
    return await ipcRenderer.invoke('ClipboardCopy', secretContent);
  }

  /// ////////////////
  // Agent Handler //
  /// ////////////////
  static async StartAgent(): Promise<number | boolean> {
    console.log('starting agent');
    return await ipcRenderer.invoke('agent-start');
  }

  static async RestartAgent(): Promise<number> {
    return await ipcRenderer.invoke('agent-restart');
  }

  /// ////////////////
  // GRPC Handlers //
  /// ////////////////
  static async AddPeer(request: clientPB.NodeMessage): Promise<string> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.NodeInfoMessage();
    // encodedRequest.setPublicKey(request.publicKey);
    // if (request.nodeAddress !== '') {
    //   encodedRequest.setNodeAddress(request.nodeAddress);
    // }
    // if (request.apiAddress !== '') {
    //   encodedRequest.setApiAddress(request.apiAddress);
    // }
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke('AddPeer', encodedRequest.serializeBinary()),
    // );
    // return res.getS();
  }

  static async AddPeerB64(peerInfoB64: string): Promise<string> {
    throw new Error('Not implemented.');
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke('AddPeerB64', peerInfoB64),
    // );
    // return res.getS();
  }

  static async AuthenticateProvider(
    request: clientPB.ProviderMessage,
  ): Promise<string> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.AuthenticateProviderRequest();
    // encodedRequest.setProviderKey(request.providerKey);
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'AuthenticateProvider',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.getS();
  }

  static async AugmentKeynode(request: clientPB.NodeMessage): Promise<string> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.AugmentKeynodeRequest();
    // encodedRequest.setProviderKey(request.providerKey);
    // encodedRequest.setIdentityKey(request.identityKey);
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'AugmentKeynode',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.getS();
  }

  static async DecryptFile(request: clientPB.CryptoMessage): Promise<string> {
    const res = clientPB.CryptoMessage.deserializeBinary(
      await ipcRenderer.invoke('KeysDecrypt', request.serializeBinary()),
    );
    return res.getData();
  }

  static async KeysDelete(keyName: string): Promise<void> {
    const keyMessage = new clientPB.KeyMessage();
    keyMessage.setName(keyName);

    await ipcRenderer.invoke('keysDelete', keyMessage.serializeBinary());
    return;
  }

  static async vaultsDeleteSecret(
    request: clientPB.VaultSpecificMessage.AsObject,
  ): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    const vaultSpecificMessage = new clientPB.VaultSpecificMessage();

    if(request.vault) {
      vaultMessage.setId(request.vault.id);
      vaultSpecificMessage.setVault(vaultMessage);
      vaultSpecificMessage.setName(request.name);
    } else throw new Error('Undefined property vault.');
    await ipcRenderer.invoke('vaultsDeleteSecret', vaultSpecificMessage.serializeBinary());
    return;
  }

  static async vaultsDelete(vaultId: string): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    vaultMessage.setId(vaultId);
    await ipcRenderer.invoke('vaultsDelete', vaultMessage.serializeBinary());
    return;
  }

  static async DeriveKey(request: clientPB.KeyMessage): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.DeriveKeyMessage();
    // encodedRequest.setKeyName(request.keyName);
    // encodedRequest.setPassphrase(request.passphrase);
    // await ipcRenderer.invoke('DeriveKey', encodedRequest.serializeBinary());
    // return;
  }

  static async EncryptFile(request: clientPB.CryptoMessage): Promise<string> {
    const res = clientPB.CryptoMessage.deserializeBinary(
      await ipcRenderer.invoke('keysEncrypt', request.serializeBinary()),
    );
    return res.getData();
  }

  static async FindPeer(request: clientPB.NodeMessage): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.ContactNodeMessage();
    // encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    // encodedRequest.setTimeout(request.timeout);
    // await ipcRenderer.invoke('FindPeer', encodedRequest.serializeBinary());
    // return;
  }

  static async FindSocialPeer(
    request: clientPB.NodeMessage,
  ): Promise<string[]> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.ContactNodeMessage();
    // encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    // encodedRequest.setTimeout(request.timeout);
    // const res = pb.StringListMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'FindSocialPeer',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.getSList();
  }

  static async GetOAuthClient(): Promise<clientPB.CryptoMessage> {
    return await ipcRenderer.invoke('GetOAuthClient');
  }

  static async keysGet(keyName: string): Promise<string> {
    const keyMessage = new clientPB.KeyMessage();
    keyMessage.setName(keyName);

    const res = await ipcRenderer.invoke(
      'keysGet',
      keyMessage.serializeBinary(),
    );
    const returnKeyMessage = clientPB.KeyMessage.deserializeBinary(res);
    return returnKeyMessage.getKey();
  }

  static async GetLocalPeerInfo(): Promise<clientPB.NodeMessage> {
    throw new Error('Not implemented.');
    // const res = pb.NodeInfoMessage.deserializeBinary(
    //   await ipcRenderer.invoke('GetLocalPeerInfo'),
    // );
    // return res.toObject();
  }

  static async GetPeerInfo(peerId: string): Promise<clientPB.NodeMessage> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.StringMessage();
    // encodedRequest.setS(peerId);
    // const res = pb.NodeInfoMessage.deserializeBinary(
    //   await ipcRenderer.invoke('GetPeerInfo', encodedRequest.serializeBinary()),
    // );
    // return res.toObject();
  }

  static async keysRootKeyPair(): Promise<clientPB.KeyPairMessage.AsObject> {
    const emptyMessage = new clientPB.EmptyMessage();
    const res = clientPB.KeyPairMessage.deserializeBinary(
      await ipcRenderer.invoke('keysRootKeyPair'),
    );
    return res.toObject();
  }

  static async GetRootCertificate(): Promise<string> {
    const res = await ipcRenderer.invoke('certsGet');
    const certificateMessage = clientPB.CertificateMessage.deserializeBinary(res);
    return certificateMessage.getCert();
  }

  static async vaultsGetSecret(
    request: clientPB.VaultSpecificMessage.AsObject,
  ): Promise<string> {
    const vaultMessage = new clientPB.VaultMessage();
    const vaultSpecificMessage = new clientPB.VaultSpecificMessage();
    if (request.vault){
      vaultMessage.setId(request.vault.id)
      vaultSpecificMessage.setVault(vaultMessage);
      vaultSpecificMessage.setName(request.name);
    } else throw new Error("Undefined property of vault");
    const res = await ipcRenderer.invoke(
        'vaultsGetSecret',
        vaultSpecificMessage.serializeBinary(),
      );
    const secretMessage = clientPB.SecretMessage.deserializeBinary(res);
    return secretMessage.getName();
  }

  static async GetStatus(): Promise<string> {
    throw new Error('Not implemented.');
    // const res = pb.AgentStatusMessage.deserializeBinary(
    //   await ipcRenderer.invoke('GetStatus'),
    // );
    // return pb.AgentStatusType[res.getStatus()];
  }

  static async GetConnectedIdentityInfos(
    request: clientPB.EmptyMessage.AsObject /*clientPB.ProviderMessage*/,
    callback,
  ): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.ProviderSearchMessage();
    // encodedRequest.setProviderKey(request.providerKey);
    // encodedRequest.setSearchTermList(request.searchTermList);
    //
    // const streamData = async (event, arg) => {
    //   const result = pb.IdentityInfoMessage.deserializeBinary(arg);
    //   callback(null, result.getKey());
    // };
    //
    // ipcRenderer.once('GetConnectedIdentityInfos-reply', streamData);
    //
    // await ipcRenderer.send(
    //   'GetConnectedIdentityInfos-message',
    //   encodedRequest.serializeBinary(),
    // );
  }

  static async DiscoverGestaltIdentity(
    request: clientPB.EmptyMessage.AsObject /*clientPB.ProviderMessage.AsObject*/,
    callback,
  ): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.IdentityMessage();
    // console.log('discovering', request.key);
    // encodedRequest.setKey(request.key);
    // encodedRequest.setProviderKey(request.providerKey);
    //
    // await ipcRenderer.send(
    //   'DiscoverGestaltIdentity-message',
    //   encodedRequest.serializeBinary(),
    // );
    //
    // ipcRenderer.once('DiscoverGestaltIdentity-reply', async (event, arg) => {
    //   const result = pb.IdentityMessage.deserializeBinary(arg);
    //   console.log(result.getKey());
    //   console.log('----provider', result.getProviderKey());
    //   callback(null, result.getKey());
    // });
  }

  // static async DiscoverGestaltNode(request: pb.IdentityMessage.AsObject): Promise<void> {
  //   const encodedRequest = new pb.IdentityMessage();
  //   encodedRequest.setKey(request.key);
  //   encodedRequest.setProviderKey(request.providerKey);

  //   ipcRenderer.on('DiscoverGestaltNode', async (event, arg) => {});
  // }

  static async GetGestalts(
    request: clientPB.EmptyMessage.AsObject,
  ): Promise<any> {
    // throw new Error('Not implemented.');
    // const encodedRequest = new pb.EmptyMessage();
    // const res = pb.GestaltListMessage.deserializeBinary(
    //   await ipcRenderer.invoke('GetGestalts', encodedRequest.serializeBinary()),
    // );
    // const containers: any = {};
    // res.getGestaltMessageList().forEach((value, gestaltIndex) => {
    //   if (!containers[gestaltIndex]) {
    //     containers[gestaltIndex] = {
    //       id: gestaltIndex,
    //       trusted: true,
    //       keynodes: [],
    //       digitalIdentities: [],
    //     };
    //   }
    //
    //   value.getIdentitiesMap().forEach((identitiesValue) => {
    //     const identityKey = identitiesValue?.getKey();
    //     const identityProvider = identitiesValue?.getProvider();
    //     containers[gestaltIndex].digitalIdentities.push(identityKey);
    //     containers[gestaltIndex].keynodes.push({
    //       id: null,
    //       name: null,
    //       digitalIdentity: [
    //         {
    //           type: identityProvider,
    //           username: identityKey,
    //         },
    //       ],
    //       vaults: [],
    //     });
    //   });
    //
    //   /** This is for gestalts that have links already */
    //   value.getGestaltMatrixMap().forEach((matrixValue) => {
    //     matrixValue.getPairsMap().forEach(async (pairs, key) => {
    //       const matrixKey = JSON.parse(key);
    //
    //       // If p is null then it is a node we only need the list of nodes
    //       if (!matrixKey.p) {
    //         // Check if there is a node or and identity
    //         if (pairs.hasLinkInfoIdentity()) {
    //           const linkedIdentity = pairs.getLinkInfoIdentity();
    //           const identityKey = linkedIdentity?.getIdentity();
    //           const identityProvider = linkedIdentity?.getProvider();
    //           // If key is not existing
    //           if (!containers[gestaltIndex].keynodes.length) {
    //             containers[gestaltIndex].keynodes.push({
    //               id: matrixKey.key,
    //               name: matrixKey.key,
    //               digitalIdentity: [
    //                 {
    //                   type: identityProvider,
    //                   username: identityKey,
    //                 },
    //               ],
    //               vaults: [],
    //             });
    //           } else {
    //             if (!containers[gestaltIndex].keynodes[0].id) {
    //               containers[gestaltIndex].keynodes[0] = {
    //                 id: matrixKey.key,
    //                 name: matrixKey.key,
    //                 digitalIdentity: [
    //                   {
    //                     type: identityProvider,
    //                     username: identityKey,
    //                   },
    //                 ],
    //                 vaults: [],
    //               };
    //             } else {
    //               // This is when the same identity is linked to the node
    //               containers[gestaltIndex].keynodes[0].digitalIdentity.push({
    //                 type: identityProvider,
    //                 username: identityKey,
    //               });
    //             }
    //           }
    //         }
    //
    //         // Still todo
    //         if (pairs.hasLinkInfoNode()) {
    //         }
    //       }
    //     });
    //   });
    // });
    return {};
  }

  static async GetIdentityInfo(request: clientPB.EmptyMessage): Promise<any> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.EmptyMessage();
    // const res = pb.IdentityInfo.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'GetIdentityInfo',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.getKey();
  }

  static async GetGestaltByIdentity(
    request: clientPB.ProviderMessage,
  ): Promise<any> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.IdentityMessage();
    // encodedRequest.setProviderKey(request.providerKey);
    // encodedRequest.setKey(request.key);
    // const res = pb.GestaltMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'GetGestaltByIdentity',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // // return {
    // //   matrix: JSON.parse(atob(res.getGestaltMatrix())),
    // //   nodes: JSON.parse(atob(res.getGestaltNodes())),
    // //   identities: JSON.parse(atob(res.getIdentities()))
    // // };
    // return {
    //   matrix: {},
    //   nodes: {},
    //   identities: {},
    // };
  }

  static async TrustGestalt(
    request: clientPB.GestaltTrustMessage,
  ): Promise<string> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.StringMessage();
    // encodedRequest.setS(request.s);
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'TrustGestalt',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.getS();
  }

  static async UntrustGestalt(
    request: clientPB.GestaltTrustMessage,
  ): Promise<string> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.StringMessage();
    // encodedRequest.setS(request.s);
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'UntrustGestalt',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.getS();
  }

  static async GestaltIsTrusted(
    request: clientPB.GestaltTrustMessage,
  ): Promise<string> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.StringMessage();
    // encodedRequest.setS(request.s);
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'GestaltIsTrusted',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.getS();
  }

  static async ListOAuthTokens(): Promise<string[]> {
    throw new Error('Not implemented.');
    // const res = pb.StringListMessage.deserializeBinary(
    //   await ipcRenderer.invoke('ListOAuthTokens'),
    // );
    // return res.getSList();
  }

  static async ListKeys(): Promise<string[]> {
    // throw new Error('Not implemented.');
    // const res = pb.StringListMessage.deserializeBinary(
    //   await ipcRenderer.invoke('ListKeys'),
    // );
    // return res.getSList();
    return [];
  }

  static async ListPeers(): Promise<string[]> {
    throw new Error('Not implemented.');
    // const res = pb.StringListMessage.deserializeBinary(
    //   await ipcRenderer.invoke('ListPeers'),
    // );
    // return res.getSList();
  }

  static async vaultsListSecrets(vaultName: string): Promise<string[]> {
    const vaultMessage = new clientPB.VaultMessage();
    vaultMessage.setId(vaultName);
    const secretList = await ipcRenderer.invoke('vaultsListSecrets', vaultMessage.serializeBinary());
    const output: Array<string> = [];
    for (const secretListElement of secretList) {
      output.push(secretListElement)
    }
    return output;
  }

  static async vaultsList(): Promise<clientPB.VaultMessage.AsObject[]> {
    const data: Array<Uint8Array> = await ipcRenderer.invoke('vaultsList');
    const output: Array<clientPB.VaultMessage.AsObject> = [];
    for (const datum of data) {
      const vaultMessage = clientPB.VaultMessage.deserializeBinary(datum);
      output.push({
        name: vaultMessage.getName(),
        id: vaultMessage.getId(),
      });
    }
    return output;
  }

  static async LockNode(): Promise<void> {
    return await ipcRenderer.invoke('LockNode');
  }

  static async NewClientCertificate(
    request: clientPB.CertificateMessage,
  ): Promise<clientPB.CertificateMessage> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.NewClientCertificateMessage();
    // encodedRequest.setDomain(request.domain);
    // encodedRequest.setCertFile(request.certFile);
    // encodedRequest.setKeyFile(request.keyFile);
    // const res = pb.NewClientCertificateMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'NewClientCertificate',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.toObject();
  }

  static async InitializeKeyNode(
    request: clientPB.KeyPairMessage,
  ): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.NewKeyPairMessage();
    // encodedRequest.setPassphrase(request.passphrase);
    // const res = pb.EmptyMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'InitializeKeyNode',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return;
  }

  static async vaultsNewSecret(
    request: clientPB.VaultSpecificMessage.AsObject,
  ): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    const vaultSpecificMessage = new clientPB.VaultSpecificMessage();
    if (request.vault) {
      vaultMessage.setId(request.vault.id);
      vaultSpecificMessage.setVault(vaultMessage);
      vaultSpecificMessage.setName(request.name);
    } else throw new Error("Undefined property Vault");
    await ipcRenderer.invoke('vaultsNewSecret', vaultSpecificMessage.serializeBinary());
    return;
  }

  static async NewOAuthToken(request: clientPB.TokenMessage): Promise<string> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.NewOAuthTokenMessage();
    // encodedRequest.setScopesList(request.scopesList);
    // encodedRequest.setExpiry(request.expiry);
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke(
    //     'NewOAuthToken',
    //     encodedRequest.serializeBinary(),
    //   ),
    // );
    // return res.getS();
  }

  static async vaultsCreate(vaultName: string): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    vaultMessage.setName(vaultName);
    await ipcRenderer.invoke('vaultsCreate', vaultMessage.serializeBinary());
    return;
  }

  static async PingPeer(
    request: clientPB.EmptyMessage.AsObject /*clientPB.NodeMessage*/,
  ): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.ContactNodeMessage();
    // encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    // encodedRequest.setTimeout(request.timeout);
    // await ipcRenderer.invoke('PingPeer', encodedRequest.serializeBinary());
    // return;
  }

  static async vaultsPull(
    request: clientPB.VaultMessage.AsObject,
  ): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    vaultMessage.setId(request.id);
    vaultMessage.setName(request.name);
    await ipcRenderer.invoke('vaultsPull', vaultMessage.serializeBinary());
    return;
  }

  static async RevokeOAuthToken(token: string): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.StringMessage();
    // encodedRequest.setS(token);
    // await ipcRenderer.invoke(
    //   'RevokeOAuthToken',
    //   encodedRequest.serializeBinary(),
    // );
    // return;
  }

  static async vaultsScan(peerId: string): Promise<string[]> {
    const vaultMessage = new clientPB.VaultMessage();
    vaultMessage.setId(peerId);
    const res = await ipcRenderer.invoke('vaultsScan', vaultMessage.serializeBinary());
    return res;
  }

  static async keysSign(request: clientPB.CryptoMessage): Promise<string> {
    const response = clientPB.CryptoMessage.deserializeBinary(
      await ipcRenderer.invoke('keysSign', request.serializeBinary()),
    );
    return response.getSignature();
  }

  static async StopAgent(): Promise<void> {
    return await ipcRenderer.invoke('StopAgent');
  }

  static async ToggleStealthMode(isActive: boolean): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.BooleanMessage();
    // encodedRequest.setB(isActive);
    // await ipcRenderer.invoke(
    //   'ToggleStealthMode',
    //   encodedRequest.serializeBinary(),
    // );
    // return;
  }

  static async UnlockNode(
    request: clientPB.EmptyMessage.AsObject /*clientPB.NodeMessage.AsObject*/,
  ): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.UnlockNodeMessage();
    // encodedRequest.setPassphrase(request.passphrase);
    // encodedRequest.setTimeout(request.timeout);
    // await ipcRenderer.invoke('UnlockNode', encodedRequest.serializeBinary());
    // return;
  }

  static async UpdateLocalPeerInfo(
    request: clientPB.NodeMessage,
  ): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.NodeInfoMessage();
    // encodedRequest.setPublicKey(request.publicKey);
    // if (request.nodeAddress !== '') {
    //   encodedRequest.setNodeAddress(request.nodeAddress);
    // }
    // if (request.apiAddress !== '') {
    //   encodedRequest.setApiAddress(request.apiAddress);
    // }
    // await ipcRenderer.invoke(
    //   'UpdateLocalPeerInfo',
    //   encodedRequest.serializeBinary(),
    // );
    // return;
  }

  static async UpdatePeerInfo(request: clientPB.NodeMessage): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.NodeInfoMessage();
    // encodedRequest.setPublicKey(request.publicKey);
    // if (request.nodeAddress !== '') {
    //   encodedRequest.setNodeAddress(request.nodeAddress);
    // }
    // if (request.apiAddress !== '') {
    //   encodedRequest.setApiAddress(request.apiAddress);
    // }
    // await ipcRenderer.invoke(
    //   'UpdatePeerInfo',
    //   encodedRequest.serializeBinary(),
    // );
    // return;
  }

  static async vaultsEditSecret(
    request: clientPB.SecretSpecificMessage.AsObject,
  ): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    const vaultSpecificMessage = new clientPB.VaultSpecificMessage();
    const secretSpecificMessage = new clientPB.SecretSpecificMessage();
    if (request.vault) {
      if (request.vault.vault){
        vaultMessage.setId(request.vault.vault.id);
        vaultSpecificMessage.setVault(vaultMessage);
        vaultSpecificMessage.setName(request.vault.vault.name);
      }else throw Error("Undefined property vault");
      secretSpecificMessage.setVault(vaultSpecificMessage);
      secretSpecificMessage.setContent(request.content);
    }else throw Error("Undefined property vault");
    await ipcRenderer.invoke('vaultsEditSecret', vaultSpecificMessage.serializeBinary());
    return;
  }

  static async keysVerify(request: clientPB.CryptoMessage): Promise<boolean> {
    const res = await ipcRenderer.invoke(
      'keysVerify',
      request.serializeBinary(),
    );
    return clientPB.StatusMessage.deserializeBinary(res).getSuccess();
  }

  static async SetIdentity(request: clientPB.ProviderMessage): Promise<void> {
    throw new Error('Not implemented.');
    // const encodedRequest = new pb.StringMessage();
    // encodedRequest.setS(request.s);
    // await ipcRenderer.invoke('SetIdentity', encodedRequest.serializeBinary());
    // return;
  }

  //testing a stream response.
  static async streamTest(num: number): Promise<void>{
    ipcRenderer.send('stream-test', num);
  };

  static async setHandler(): Promise<void> {
    ipcRenderer.on('stream-test', (event, arg) => {
      console.log(arg);
    })
  }
}

export default PolykeyClient;
