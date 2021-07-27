import { clientPB } from '@matrixai/polykey/src/client';
import { getDefaultNodePath } from '@matrixai/polykey/src/utils';
import { keynodePath } from '@/main/server';
import type { KeynodeState } from '@matrixai/polykey/src/bootstrap';
import { SetActionsMessage } from "@matrixai/polykey/dist/proto/js/Client_pb";
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
  static async StartAgent() {
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
          console.log('Problem starting agent, might already be started.');
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

  static async ConnectClient(keynodePath: string) {
    console.log('BRUH ', keynodePath);
    const request = { keynodePath };
    return await ipcRenderer.invoke('connect-client', request);
  }

  static async StartSession(password: string) {
    const request = { password };
    const res = await ipcRenderer.invoke('start-session', request);
    console.log('The token is: ', res);
    return res;
  }

  static async CheckAgent(keynodePath: string): Promise<boolean> {
    const request = { keynodePath };
    return await ipcRenderer.invoke('check-agent', request);
  }

  static async SpawnAgent(
    keynodePath: string,
    password: string,
  ): Promise<number> {
    const request = { keynodePath, password };
    return await ipcRenderer.invoke('spawn-agent', request);
  }

  static async BootstrapKeynode(keynodePath: string, password: string) {
    const request = { keynodePath, password };
    return await ipcRenderer.invoke('bootstrap-keynode', request);
  }

  /**
   * @param keynodePath path to the keynode.
   * @returns number 0 if can initialize, 1 if initialized, 2 if invalid.
   */
  static async CheckKeynodeState(keynodePath: string): Promise<KeynodeState> {
    const request = { keynodePath };
    return await ipcRenderer.invoke('check-keynode-state', request);
  }

  static async StopAgent(): Promise<void> {
    return await ipcRenderer.invoke('Stop-Agent');
  }

  static async RestartAgent(): Promise<number> {
    return await ipcRenderer.invoke('agent-restart');
  }

  /// ////////////////
  // GRPC Handlers //
  /// ////////////////
  //TODO: This will need to be redone later.
  static async NodesAdd(
    request: clientPB.NodeDetailsMessage.AsObject,
  ): Promise<void> {
    const nodeInfoMessage = new clientPB.NodeDetailsMessage();
    nodeInfoMessage.setPublicKey(request.publicKey);
    if (request.nodeAddress !== '') {
      nodeInfoMessage.setNodeAddress(request.nodeAddress);
    }
    // if (request.apiAddress !== '') {
    //   nodeInfoMessage.setApiAddress(request.apiAddress);
    // }
    const res = clientPB.EmptyMessage.deserializeBinary(
      await ipcRenderer.invoke('NodesAdd', nodeInfoMessage.serializeBinary()),
    );
    return;
  }

  static async AddNodeB64(peerInfoB64: string): Promise<string> {
    throw new Error('Not implemented.');
    // const res = pb.StringMessage.deserializeBinary(
    //   await ipcRenderer.invoke('Add-NodeB64', peerInfoB64),
    // );
    // return res.getS();
  }

  static async AuthenticateProvider(
    request: clientPB.ProviderMessage.AsObject,
  ): Promise<clientPB.ProviderMessage.AsObject> {
    const providerMessage = new clientPB.ProviderMessage();
    providerMessage.setId(request.id);
    providerMessage.setMessage(request.message);
    const res = clientPB.ProviderMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'AuthenticateProvider',
        providerMessage.serializeBinary(),
      ),
    );
    return res.toObject();
  }

  static async IdentitiesAugmentKeynode(
    request: clientPB.ProviderMessage.AsObject,
  ): Promise<void> {
    const providerMessage = new clientPB.ProviderMessage();
    providerMessage.setId(request.id);
    providerMessage.setMessage(request.message);
    const res = clientPB.EmptyMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'AugmentKeynode',
        providerMessage.serializeBinary(),
      ),
    );
    return;
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

    if (!request.vault) throw new Error('Undefined property vault.');
    vaultMessage.setId(request.vault.id);
    vaultSpecificMessage.setVault(vaultMessage);
    vaultSpecificMessage.setName(request.name);
    await ipcRenderer.invoke(
      'vaultsDeleteSecret',
      vaultSpecificMessage.serializeBinary(),
    );
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
  } //Not relevant anymore.

  static async EncryptFile(request: clientPB.CryptoMessage): Promise<string> {
    const res = clientPB.CryptoMessage.deserializeBinary(
      await ipcRenderer.invoke('keysEncrypt', request.serializeBinary()),
    );
    return res.getData();
  }

  static async NodesFind(
    request: clientPB.NodeMessage.AsObject,
  ): Promise<void> {
    const nodeMessage = new clientPB.NodeMessage();
    nodeMessage.setName(request.name);
    await ipcRenderer.invoke('NodesFind', nodeMessage.serializeBinary());
    return;
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

  static async NodesGetLocalInfo(): Promise<clientPB.NodeDetailsMessage.AsObject> {
    const res = clientPB.NodeDetailsMessage.deserializeBinary(
      await ipcRenderer.invoke('NodesGetLocalInfo'),
    );
    return res.toObject();
  }

  static async NodesGetInfo(
    peerId: string,
  ): Promise<clientPB.NodeDetailsMessage.AsObject> {
    const nodeMessage = new clientPB.NodeMessage();
    nodeMessage.setName(peerId);
    const res = clientPB.NodeDetailsMessage.deserializeBinary(
      await ipcRenderer.invoke('NodesGetInfo', nodeMessage.serializeBinary()),
    );
    return res.toObject();
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
    const certificateMessage =
      clientPB.CertificateMessage.deserializeBinary(res);
    return certificateMessage.getCert();
  }

  static async vaultsGetSecret(
    request: clientPB.VaultSpecificMessage.AsObject,
  ): Promise<string> {
    const vaultMessage = new clientPB.VaultMessage();
    const vaultSpecificMessage = new clientPB.VaultSpecificMessage();
    if (!request.vault) throw new Error('Undefined property of vault');
    vaultMessage.setId(request.vault.id);
    vaultSpecificMessage.setVault(vaultMessage);
    vaultSpecificMessage.setName(request.name);
    const res = await ipcRenderer.invoke(
      'vaultsGetSecret',
      vaultSpecificMessage.serializeBinary(),
    );
    const secretMessage = clientPB.SecretMessage.deserializeBinary(res);
    return secretMessage.getName();
  }

  static async IdentityGetConnectedInfos(
    request: clientPB.ProviderSearchMessage.AsObject,
  ): Promise<clientPB.IdentityInfoMessage.AsObject[]> {
    //Constructing message.
    if (!request.provider) throw Error('Provider is undefined.');
    const providerMessage = new clientPB.ProviderMessage();
    providerMessage.setId(request.provider.id);
    providerMessage.setMessage(request.provider.message);

    const providerSearchMessage = new clientPB.ProviderSearchMessage();
    providerSearchMessage.setProvider(providerMessage);
    providerSearchMessage.setSearchTermList(request.searchTermList);

    //getting response and converting to object.
    const data: Array<Uint8Array> = await ipcRenderer.invoke(
      'IdentityGetConnectedInfos',
      providerSearchMessage.serializeBinary(),
    );
    const output: Array<clientPB.IdentityInfoMessage.AsObject> = [];
    for (const datum of data) {
      const identityInfoMessage =
        clientPB.IdentityInfoMessage.deserializeBinary(datum);
      output.push(identityInfoMessage.toObject());
    }
    return output;
  }

  static async GestaltsDiscoverIdentity(
    request: clientPB.ProviderMessage.AsObject /*clientPB.ProviderMessage.AsObject*/,
  ): Promise<clientPB.GestaltMessage.AsObject> {
    const providerMess = new clientPB.ProviderMessage();
    providerMess.setId(request.id);
    providerMess.setMessage(request.message);
    const res = await ipcRenderer.invoke(
      'IdentitiesDiscoverIdentity',
      providerMess.serializeBinary(),
    );
    return clientPB.GestaltMessage.deserializeBinary(res).toObject();
  }

  static async GestaltsDiscoverNode(
    request: clientPB.GestaltMessage.AsObject,
  ): Promise<clientPB.GestaltMessage.AsObject> {
    const gestaltMessage = new clientPB.GestaltMessage();
    gestaltMessage.setName(request.name);

    const res = await ipcRenderer.invoke(
      'GestaltsDiscoverNode',
      gestaltMessage,
    );
    return clientPB.GestaltMessage.deserializeBinary(res).toObject();
  }

  //FIXME, replace object with proper type.
  static async GestaltsList(): Promise<Array<any>> {
    const gestaltList = await ipcRenderer.invoke('GestaltsList');
    const output: Array<any> = [];
    for (const gestalt of gestaltList) {
      const gestaltMessage = clientPB.GestaltMessage.deserializeBinary(gestalt);
      const json = JSON.parse(gestaltMessage.getName());
      output.push(json);
    }
    return output;
  }

  static async IdentitiesGetInfo(request: clientPB.EmptyMessage): Promise<any> {
    const emptyMessage = new clientPB.EmptyMessage();
    const res = clientPB.EmptyMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'IdentitiesGetInfo',
        emptyMessage.serializeBinary(),
      ),
    );
    return;
  }

  static async GetGestaltByIdentity(
    request: clientPB.ProviderMessage.AsObject,
  ): Promise<clientPB.GestaltMessage.AsObject> {
    const providerMessage = new clientPB.ProviderMessage();
    providerMessage.setId(request.id);
    providerMessage.setMessage(request.message);

    const res = await ipcRenderer.invoke(
      'GestaltsGetIdentity',
      providerMessage.serializeBinary(),
    );
    return clientPB.GestaltMessage.deserializeBinary(res).toObject();
  }

  static async TrustGestalt(
    request: clientPB.SetActionsMessage.AsObject,
  ): Promise<void> {
    const actionMessage = new clientPB.SetActionsMessage();
    if (request.identity) {
      const providerMessage = new clientPB.ProviderMessage()
      providerMessage.setId(request.identity.id);
      providerMessage.setMessage(request.identity.message);
      actionMessage.setIdentity(providerMessage);
    }
    if (request.node){
      const nodeMessage = new clientPB.NodeMessage();
      nodeMessage.setName(request.node.name);
      actionMessage.setNode(nodeMessage);
    }
    actionMessage.setAction(request.action);
    ipcRenderer.invoke('TrustGestalt', actionMessage.serializeBinary());
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

  static async NodesList(): Promise<clientPB.NodeMessage.AsObject[]> {
    const nodesList = await ipcRenderer.invoke('Nodes-List');
    const output: Array<clientPB.NodeMessage.AsObject> = [];
    for (const nodesListElement of nodesList) {
      const element = clientPB.NodeMessage.deserializeBinary(nodesListElement);
      output.push(element.toObject());
    }
    return output;
  }

  static async vaultsListSecrets(
    vaultName: string,
  ): Promise<clientPB.SecretMessage.AsObject[]> {
    const vaultMessage = new clientPB.VaultMessage();
    vaultMessage.setId(vaultName);
    const secretList = await ipcRenderer.invoke(
      'vaultsListSecrets',
      vaultMessage.serializeBinary(),
    );
    const output: Array<clientPB.SecretMessage.AsObject> = [];
    for (const secretListElement of secretList) {
      const element =
        clientPB.SecretMessage.deserializeBinary(secretListElement);
      output.push(element.toObject());
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

  static async vaultsNewSecret(
    request: clientPB.VaultSpecificMessage.AsObject,
  ): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    const vaultSpecificMessage = new clientPB.VaultSpecificMessage();
    if (!request.vault) throw new Error('Undefined property Vault');
    vaultMessage.setId(request.vault.id);
    vaultSpecificMessage.setVault(vaultMessage);
    vaultSpecificMessage.setName(request.name);
    await ipcRenderer.invoke(
      'vaultsNewSecret',
      vaultSpecificMessage.serializeBinary(),
    );
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

  static async NodesPing(
    request: clientPB.NodeMessage.AsObject /*clientPB.NodeMessage*/,
  ): Promise<void> {
    const nodeMessage = new clientPB.NodeMessage();
    nodeMessage.setName(request.name);
    await ipcRenderer.invoke('NodesPing', nodeMessage.serializeBinary());
    return;
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
    const res = await ipcRenderer.invoke(
      'vaultsScan',
      vaultMessage.serializeBinary(),
    );
    return res;
  }

  static async keysSign(request: clientPB.CryptoMessage): Promise<string> {
    const response = clientPB.CryptoMessage.deserializeBinary(
      await ipcRenderer.invoke('keysSign', request.serializeBinary()),
    );
    return response.getSignature();
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

  static async UpdateLocalNodeInfo(
    request: clientPB.NodeDetailsMessage.AsObject,
  ): Promise<void> {
    throw new Error('Not implemented.');
    const encodedRequest = new clientPB.NodeDetailsMessage();
    encodedRequest.setPublicKey(request.publicKey);
    if (request.nodeAddress !== '') {
      encodedRequest.setNodeAddress(request.nodeAddress);
    }
    // if (request.apiAddress !== '') {
    //   encodedRequest.setApiAddress(request.apiAddress);
    // }
    await ipcRenderer.invoke(
      'NodesUpdateLocalInfo',
      encodedRequest.serializeBinary(),
    );
    return;
  }

  static async UpdateNodeInfo(
    request: clientPB.NodeDetailsMessage.AsObject,
  ): Promise<void> {
    const encodedRequest = new clientPB.NodeDetailsMessage();
    encodedRequest.setPublicKey(request.publicKey);
    if (request.nodeAddress !== '') {
      encodedRequest.setNodeAddress(request.nodeAddress);
    }
    // if (request.apiAddress !== '') {
    //   encodedRequest.setApiAddress(request.apiAddress);
    // }
    await ipcRenderer.invoke(
      'NodesUpdateInfo',
      encodedRequest.serializeBinary(),
    );
    return;
  }

  static async vaultsEditSecret(
    request: clientPB.SecretSpecificMessage.AsObject,
  ): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    const vaultSpecificMessage = new clientPB.VaultSpecificMessage();
    const secretSpecificMessage = new clientPB.SecretSpecificMessage();
    if (!request.vault || !request.vault.vault)
      throw Error('Undefined property vault');
    vaultMessage.setId(request.vault.vault.id);
    vaultSpecificMessage.setVault(vaultMessage);
    vaultSpecificMessage.setName(request.vault.vault.name);
    secretSpecificMessage.setVault(vaultSpecificMessage);
    secretSpecificMessage.setContent(request.content);
    await ipcRenderer.invoke(
      'vaultsEditSecret',
      vaultSpecificMessage.serializeBinary(),
    );
    return;
  }

  static async keysVerify(request: clientPB.CryptoMessage): Promise<boolean> {
    const res = await ipcRenderer.invoke(
      'keysVerify',
      request.serializeBinary(),
    );
    return clientPB.StatusMessage.deserializeBinary(res).getSuccess();
  }

  static async GestaltsSetIdentity(
    request: clientPB.ProviderMessage.AsObject,
  ): Promise<void> {
    const providerMessage = new clientPB.ProviderMessage();
    providerMessage.setId(request.id);
    providerMessage.setMessage(request.message);
    await ipcRenderer.invoke(
      'GestaltsSetIdentity',
      providerMessage.serializeBinary(),
    );
    return;
  }

  //testing a stream response.
  static async streamTest(num: number): Promise<void> {
    ipcRenderer.send('stream-test', num);
  }

  static async setHandler(): Promise<void> {
    ipcRenderer.on('stream-test', (event, arg) => {
      console.log(arg);
    });
  }
}

export default PolykeyClient;
