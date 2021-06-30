import { clientPB } from '@matrixai/polykey/src/client';
import { getDefaultNodePath } from "@matrixai/polykey/src/utils";
import { keynodePath } from "@/main/server";
const ipcRenderer = window.require('electron').ipcRenderer;

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

  // static async StartAgent(): Promise<number | boolean> {
  //   console.log('starting agent');
  //   return await ipcRenderer.invoke('agent-start');
  // }

  //Temp moved agent starting to front end for now, this is just for testing.
  static async StartAgent(){
    const password = 'Password';
    const keynodePath = './tmp';

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
      await this.ConnectClient(keynodePath);
      // it is here that we know that the agent is running and client is initialize
    } catch (error) {
      try {
        // agent is offline so we start it!
        console.log('startAgent');
        // const polykeyPath = getDefaultNodePath();

        //Bootstrapping
        await this.BootstrapKeynode(keynodePath, password);
        let pid: number = 0;

        //Spawning agent.
        try {
          console.log('starting agent.');
          pid = await this.SpawnAgent(keynodePath, password);
          console.log('pid: ', pid);
        } catch (e) {
          console.log("Problem starting agent, might already be started.");
          // console.error(e);
        }
        console.log('connectToAgent');
        await this.ConnectClient(keynodePath);

        console.log('done');
        return pid;
      } catch (error) {
        throw Error(error.message);
      }
    }
  }

  static async ConnectClient(keynodePath: string){
    console.log("BRUH ", keynodePath);
    const request = {keynodePath}
    return await ipcRenderer.invoke('connect-client', request);
  }

  static async SpawnAgent(keynodePath: string, password: string): Promise<number> {
    const request = {keynodePath, password}
    return await ipcRenderer.invoke('spawn-agent', request);
  }

  static async BootstrapKeynode(keynodePath: string, password: string) {
    const request = {keynodePath, password}
    return await ipcRenderer.invoke('bootstrap-keynode', request);
  }

  /**
   * @param keynodePath path to the keynode.
   * @returns number 0 if can initialize, 1 if initialized, 2 if invalid.
   */
  static async CheckKeynodeState(keynodePath: string): Promise<number> {
    const request = {keynodePath}
    return await ipcRenderer.invoke('check-keynode-state', request);
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

  static async vaultsDeleteSecret(
    request: clientPB.VaultSpecificMessage.AsObject,
  ): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    const vaultSpecificMessage = new clientPB.VaultSpecificMessage();

    if(!request.vault) throw new Error('Undefined property vault.');
    vaultMessage.setId(request.vault.id);
    vaultSpecificMessage.setVault(vaultMessage);
    vaultSpecificMessage.setName(request.name);
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
    if (!request.vault) throw new Error("Undefined property of vault");
    vaultMessage.setId(request.vault.id)
    vaultSpecificMessage.setVault(vaultMessage);
    vaultSpecificMessage.setName(request.name);
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
      output.push(secretListElement) //TODO: Double check this.
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
    if (!request.vault) throw new Error("Undefined property Vault");
    vaultMessage.setId(request.vault.id);
    vaultSpecificMessage.setVault(vaultMessage);
    vaultSpecificMessage.setName(request.name);
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
    if (!request.vault || !request.vault.vault) throw Error("Undefined property vault");
    vaultMessage.setId(request.vault.vault.id);
    vaultSpecificMessage.setVault(vaultMessage);
    vaultSpecificMessage.setName(request.vault.vault.name);
    secretSpecificMessage.setVault(vaultSpecificMessage);
    secretSpecificMessage.setContent(request.content);
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
