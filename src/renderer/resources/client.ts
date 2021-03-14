// import * as pb from '@matrixai/polykey/dist/proto/js/Agent_pb';
// import * as pb from '@matrixai/polykey/dist/proto/js/Client_pb'
import { clientPB } from '@matrixai/polykey/dist/client'
import commandSecretEnv from '../../../../js-polykey/dist/bin/secrets/commandSecretEnv';
const ipcRenderer = window.require('electron').ipcRenderer;
// import { ipcRenderer } from 'electron';

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
  static async AddPeer(request: pb.NodeInfoMessage.AsObject): Promise<string> {
    const encodedRequest = new pb.NodeInfoMessage();
    encodedRequest.setPublicKey(request.publicKey);
    if (request.nodeAddress !== '') {
      encodedRequest.setNodeAddress(request.nodeAddress);
    }
    if (request.apiAddress !== '') {
      encodedRequest.setApiAddress(request.apiAddress);
    }
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke('AddPeer', encodedRequest.serializeBinary()),
    );
    return res.getS();
  }

  static async AddPeerB64(peerInfoB64: string): Promise<string> {
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke('AddPeerB64', peerInfoB64),
    );
    return res.getS();
  }

  static async AuthenticateProvider(
    request: pb.AuthenticateProviderRequest.AsObject,
  ): Promise<string> {
    const encodedRequest = new pb.AuthenticateProviderRequest();
    encodedRequest.setProviderKey(request.providerKey);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'AuthenticateProvider',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getS();
  }

  static async AugmentKeynode(
    request: pb.AugmentKeynodeRequest.AsObject,
  ): Promise<string> {
    const encodedRequest = new pb.AugmentKeynodeRequest();
    encodedRequest.setProviderKey(request.providerKey);
    encodedRequest.setIdentityKey(request.identityKey);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'AugmentKeynode',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getS();
  }

  static async DecryptFile(
    request: clientPB.CryptoMessage,
  ): Promise<string> {
    const res = clientPB.CryptoMessage.deserializeBinary(
      await ipcRenderer.invoke('DecryptFile', request.serializeBinary()),
    );
    return res.getData();
  }

  static async DeleteKey(keyName: string): Promise<void> {
    const keyMessage = new clientPB.KeyMessage();
    keyMessage.setName(keyName);

    await ipcRenderer.invoke('DeleteKey', keyMessage.serializeBinary());
    return;
  }

  static async DeleteSecret(
    request: clientPB.VaultSpecificMessage,
  ): Promise<void> {

    await ipcRenderer.invoke('DeleteSecret', request.serializeBinary());
    return;
  }

  static async DeleteVault(vaultName: string): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage();
    vaultMessage.setName(vaultName);
    // vaultMessage.setId("PLACEHOLDER") //FIXME
    await ipcRenderer.invoke('DeleteVault', vaultMessage.serializeBinary());
    return;
  }

  static async DeriveKey(request: pb.DeriveKeyMessage.AsObject): Promise<void> {
    const encodedRequest = new pb.DeriveKeyMessage();
    encodedRequest.setKeyName(request.keyName);
    encodedRequest.setPassphrase(request.passphrase);
    await ipcRenderer.invoke('DeriveKey', encodedRequest.serializeBinary());
    return;
  }

  static async EncryptFile(
    request: clientPB.CryptoMessage,
  ): Promise<string> {
    const res = clientPB.CryptoMessage.deserializeBinary(
      await ipcRenderer.invoke('EncryptFile', request.serializeBinary()),
    );
    return res.getData();
  }

  static async FindPeer(
    request: pb.ContactNodeMessage.AsObject,
  ): Promise<void> {
    const encodedRequest = new pb.ContactNodeMessage();
    encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    encodedRequest.setTimeout(request.timeout);
    await ipcRenderer.invoke('FindPeer', encodedRequest.serializeBinary());
    return;
  }

  static async FindSocialPeer(
    request: pb.ContactNodeMessage.AsObject,
  ): Promise<string[]> {
    const encodedRequest = new pb.ContactNodeMessage();
    encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    encodedRequest.setTimeout(request.timeout);
    const res = pb.StringListMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'FindSocialPeer',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getSList();
  }

  static async GetOAuthClient(): Promise<pb.OAuthClientMessage.AsObject> {
    return await ipcRenderer.invoke('GetOAuthClient');
  }

  static async GetKey(keyName: string): Promise<string> {
    const keyMessage = new clientPB.KeyMessage();
    keyMessage.setName(keyName);

    const res = await ipcRenderer.invoke('GetKey', keyMessage.serializeBinary());
    const returnKeyMessage = clientPB.KeyMessage.deserializeBinary(res);
    return returnKeyMessage.getKey();
  }

  static async GetLocalPeerInfo(): Promise<pb.NodeInfoMessage.AsObject> {
    const res = pb.NodeInfoMessage.deserializeBinary(
      await ipcRenderer.invoke('GetLocalPeerInfo'),
    );
    return res.toObject();
  }

  static async GetPeerInfo(
    peerId: string,
  ): Promise<pb.NodeInfoMessage.AsObject> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(peerId);
    const res = pb.NodeInfoMessage.deserializeBinary(
      await ipcRenderer.invoke('GetPeerInfo', encodedRequest.serializeBinary()),
    );
    return res.toObject();
  }

  static async GetPrimaryKeyPair(): Promise<clientPB.KeyPairMessage.AsObject> {
    const emptyMessage = new clientPB.EmptyMessage;
    const res = clientPB.KeyPairMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'GetPrimaryKeyPair',
        emptyMessage.serializeBinary(),
      ),
    );
    return res.toObject();
  }

  static async GetRootCertificate(): Promise<string> {
    return await ipcRenderer.invoke('GetRootCertificate');
  }

  static async GetSecret(
    request: clientPB.SecretSpecificMessage,
  ): Promise<string> {
    const secretMessage = new clientPB.SecretSpecificMessage();
    secretMessage.setVault(request.getVault());
    secretMessage.setContent(request.getContent());
    const res = await ipcRenderer.invoke('GetSecret', secretMessage.serializeBinary())
    const test = clientPB.SecretMessage.deserializeBinary(res);
    return test.getName();
  }

  static async GetStatus(): Promise<string> {
    const res = pb.AgentStatusMessage.deserializeBinary(
      await ipcRenderer.invoke('GetStatus'),
    );
    return pb.AgentStatusType[res.getStatus()];
  }

  static async GetConnectedIdentityInfos(
    request: pb.ProviderSearchMessage.AsObject,
    callback,
  ): Promise<void> {
    const encodedRequest = new pb.ProviderSearchMessage();
    encodedRequest.setProviderKey(request.providerKey);
    encodedRequest.setSearchTermList(request.searchTermList);

    const streamData = async (event, arg) => {
      const result = pb.IdentityInfoMessage.deserializeBinary(arg);
      callback(null, result.getKey());
    };

    ipcRenderer.once('GetConnectedIdentityInfos-reply', streamData);

    await ipcRenderer.send(
      'GetConnectedIdentityInfos-message',
      encodedRequest.serializeBinary(),
    );
  }

  static async DiscoverGestaltIdentity(
    request: pb.IdentityMessage.AsObject,
    callback,
  ): Promise<void> {
    const encodedRequest = new pb.IdentityMessage();
    console.log('discovering', request.key);
    encodedRequest.setKey(request.key);
    encodedRequest.setProviderKey(request.providerKey);

    await ipcRenderer.send(
      'DiscoverGestaltIdentity-message',
      encodedRequest.serializeBinary(),
    );

    ipcRenderer.once('DiscoverGestaltIdentity-reply', async (event, arg) => {
      const result = pb.IdentityMessage.deserializeBinary(arg);
      console.log(result.getKey());
      console.log('----provider', result.getProviderKey());
      callback(null, result.getKey());
    });
  }

  // static async DiscoverGestaltNode(request: pb.IdentityMessage.AsObject): Promise<void> {
  //   const encodedRequest = new pb.IdentityMessage();
  //   encodedRequest.setKey(request.key);
  //   encodedRequest.setProviderKey(request.providerKey);

  //   ipcRenderer.on('DiscoverGestaltNode', async (event, arg) => {});
  // }

  static async GetGestalts(request: pb.EmptyMessage.AsObject): Promise<any> {
    const encodedRequest = new pb.EmptyMessage();
    const res = pb.GestaltListMessage.deserializeBinary(
      await ipcRenderer.invoke('GetGestalts', encodedRequest.serializeBinary()),
    );
    const containers: any = {};
    res.getGestaltMessageList().forEach((value, gestaltIndex) => {
      if (!containers[gestaltIndex]) {
        containers[gestaltIndex] = {
          id: gestaltIndex,
          trusted: true,
          keynodes: [],
          digitalIdentities: [],
        };
      }

      value.getIdentitiesMap().forEach((identitiesValue) => {
        const identityKey = identitiesValue?.getKey();
        const identityProvider = identitiesValue?.getProvider();
        containers[gestaltIndex].digitalIdentities.push(identityKey);
        containers[gestaltIndex].keynodes.push({
          id: null,
          name: null,
          digitalIdentity: [
            {
              type: identityProvider,
              username: identityKey,
            },
          ],
          vaults: [],
        });
      });

      /** This is for gestalts that have links already */
      value.getGestaltMatrixMap().forEach((matrixValue) => {
        matrixValue.getPairsMap().forEach(async (pairs, key) => {
          const matrixKey = JSON.parse(key);

          // If p is null then it is a node we only need the list of nodes
          if (!matrixKey.p) {
            // Check if there is a node or and identity
            if (pairs.hasLinkInfoIdentity()) {
              const linkedIdentity = pairs.getLinkInfoIdentity();
              const identityKey = linkedIdentity?.getIdentity();
              const identityProvider = linkedIdentity?.getProvider();
              // If key is not existing
              if (!containers[gestaltIndex].keynodes.length) {
                containers[gestaltIndex].keynodes.push({
                  id: matrixKey.key,
                  name: matrixKey.key,
                  digitalIdentity: [
                    {
                      type: identityProvider,
                      username: identityKey,
                    },
                  ],
                  vaults: [],
                });
              } else {
                if (!containers[gestaltIndex].keynodes[0].id) {
                  containers[gestaltIndex].keynodes[0] = {
                    id: matrixKey.key,
                    name: matrixKey.key,
                    digitalIdentity: [
                      {
                        type: identityProvider,
                        username: identityKey,
                      },
                    ],
                    vaults: [],
                  };
                } else {
                  // This is when the same identity is linked to the node
                  containers[gestaltIndex].keynodes[0].digitalIdentity.push({
                    type: identityProvider,
                    username: identityKey,
                  });
                }
              }
            }

            // Still todo
            if (pairs.hasLinkInfoNode()) {
            }
          }
        });
      });
    });
    return containers;
  }

  static async GetIdentityInfo(
    request: pb.EmptyMessage.AsObject,
  ): Promise<any> {
    const encodedRequest = new pb.EmptyMessage();
    const res = pb.IdentityInfo.deserializeBinary(
      await ipcRenderer.invoke(
        'GetIdentityInfo',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getKey();
  }

  static async GetGestaltByIdentity(
    request: pb.IdentityMessage.AsObject,
  ): Promise<any> {
    const encodedRequest = new pb.IdentityMessage();
    encodedRequest.setProviderKey(request.providerKey);
    encodedRequest.setKey(request.key);
    const res = pb.GestaltMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'GetGestaltByIdentity',
        encodedRequest.serializeBinary(),
      ),
    );
    // return {
    //   matrix: JSON.parse(atob(res.getGestaltMatrix())),
    //   nodes: JSON.parse(atob(res.getGestaltNodes())),
    //   identities: JSON.parse(atob(res.getIdentities()))
    // };
    return {
      matrix: {},
      nodes: {},
      identities: {},
    };
  }

  static async TrustGestalt(
    request: pb.StringMessage.AsObject,
  ): Promise<string> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(request.s);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'TrustGestalt',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getS();
  }

  static async UntrustGestalt(
    request: pb.StringMessage.AsObject,
  ): Promise<string> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(request.s);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'UntrustGestalt',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getS();
  }

  static async GestaltIsTrusted(
    request: pb.StringMessage.AsObject,
  ): Promise<string> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(request.s);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'GestaltIsTrusted',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getS();
  }

  static async ListOAuthTokens(): Promise<string[]> {
    const res = pb.StringListMessage.deserializeBinary(
      await ipcRenderer.invoke('ListOAuthTokens'),
    );
    return res.getSList();
  }

  static async ListKeys(): Promise<string[]> {
    const res = pb.StringListMessage.deserializeBinary(
      await ipcRenderer.invoke('ListKeys'),
    );
    return res.getSList();
  }

  static async ListPeers(): Promise<string[]> {
    const res = pb.StringListMessage.deserializeBinary(
      await ipcRenderer.invoke('ListPeers'),
    );
    return res.getSList();
  }

  static async ListSecrets(vaultName: string): Promise<string[]> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(vaultName);
    const res = pb.StringListMessage.deserializeBinary(
      await ipcRenderer.invoke('ListSecrets', encodedRequest.serializeBinary()),
    );
    return res.getSList();
  }

  static async ListVaults(): Promise<string[]> { // TODO: come back to this later, work out how to handle streams/generators
    const res = pb.StringListMessage.deserializeBinary(
      await ipcRenderer.invoke('ListVaults'),
    );
    return res.getSList();
  }

  static async LockNode(): Promise<void> {
    return await ipcRenderer.invoke('LockNode');
  }

  static async NewClientCertificate(
    request: pb.NewClientCertificateMessage.AsObject,
  ): Promise<pb.NewClientCertificateMessage.AsObject> {
    const encodedRequest = new pb.NewClientCertificateMessage();
    encodedRequest.setDomain(request.domain);
    encodedRequest.setCertFile(request.certFile);
    encodedRequest.setKeyFile(request.keyFile);
    const res = pb.NewClientCertificateMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'NewClientCertificate',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.toObject();
  }

  static async InitializeKeyNode(
    request: pb.NewKeyPairMessage.AsObject,
  ): Promise<void> {
    const encodedRequest = new pb.NewKeyPairMessage();
    encodedRequest.setPassphrase(request.passphrase);
    const res = pb.EmptyMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'InitializeKeyNode',
        encodedRequest.serializeBinary(),
      ),
    );
    return;
  }

  static async NewSecret(
    request: clientPB.VaultSpecificMessage,
  ): Promise<void> {
    await ipcRenderer.invoke('NewSecret', request.serializeBinary());
    return;
  }

  static async NewOAuthToken(
    request: pb.NewOAuthTokenMessage.AsObject,
  ): Promise<string> {
    const encodedRequest = new pb.NewOAuthTokenMessage();
    encodedRequest.setScopesList(request.scopesList);
    encodedRequest.setExpiry(request.expiry);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'NewOAuthToken',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getS();
  }

  static async NewVault(vaultName: string): Promise<void> {
    const vaultMessage = new clientPB.VaultMessage;
    vaultMessage.setName(vaultName);
    // vaultMessage.setId("PLACEHOLDER")// FIXME: this should be an actual ID or something.
    await ipcRenderer.invoke('NewVault', vaultMessage.serializeBinary());
    return;
  }

  static async PingPeer(
    request: pb.ContactNodeMessage.AsObject,
  ): Promise<void> {
    const encodedRequest = new pb.ContactNodeMessage();
    encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    encodedRequest.setTimeout(request.timeout);
    await ipcRenderer.invoke('PingPeer', encodedRequest.serializeBinary());
    return;
  }

  static async PullVault(request: pb.VaultPathMessage.AsObject): Promise<void> {
    const encodedRequest = new pb.VaultPathMessage();
    encodedRequest.setPublicKey(request.publicKey);
    encodedRequest.setVaultName(request.vaultName);
    await ipcRenderer.invoke('PullVault', encodedRequest.serializeBinary());
    return;
  }

  static async RevokeOAuthToken(token: string): Promise<void> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(token);
    await ipcRenderer.invoke(
      'RevokeOAuthToken',
      encodedRequest.serializeBinary(),
    );
    return;
  }

  static async ScanVaultNames(peerId: string): Promise<string[]> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(peerId);
    const res = pb.StringListMessage.deserializeBinary(
      await ipcRenderer.invoke(
        'ScanVaultNames',
        encodedRequest.serializeBinary(),
      ),
    );
    return res.getSList();
  }

  static async SignFile(request: clientPB.CryptoMessage): Promise<string> {
    const response = clientPB.CryptoMessage.deserializeBinary(
      await ipcRenderer.invoke('SignFile', request.serializeBinary()),
    );
    return response.getSignature();
  }

  static async StopAgent(): Promise<void> {
    return await ipcRenderer.invoke('StopAgent');
  }

  static async ToggleStealthMode(isActive: boolean): Promise<void> {
    const encodedRequest = new pb.BooleanMessage();
    encodedRequest.setB(isActive);
    await ipcRenderer.invoke(
      'ToggleStealthMode',
      encodedRequest.serializeBinary(),
    );
    return;
  }

  static async UnlockNode(
    request: pb.UnlockNodeMessage.AsObject,
  ): Promise<void> {
    const encodedRequest = new pb.UnlockNodeMessage();
    encodedRequest.setPassphrase(request.passphrase);
    encodedRequest.setTimeout(request.timeout);
    await ipcRenderer.invoke('UnlockNode', encodedRequest.serializeBinary());
    return;
  }

  static async UpdateLocalPeerInfo(
    request: pb.NodeInfoMessage.AsObject,
  ): Promise<void> {
    const encodedRequest = new pb.NodeInfoMessage();
    encodedRequest.setPublicKey(request.publicKey);
    if (request.nodeAddress !== '') {
      encodedRequest.setNodeAddress(request.nodeAddress);
    }
    if (request.apiAddress !== '') {
      encodedRequest.setApiAddress(request.apiAddress);
    }
    await ipcRenderer.invoke(
      'UpdateLocalPeerInfo',
      encodedRequest.serializeBinary(),
    );
    return;
  }

  static async UpdatePeerInfo(
    request: pb.NodeInfoMessage.AsObject,
  ): Promise<void> {
    const encodedRequest = new pb.NodeInfoMessage();
    encodedRequest.setPublicKey(request.publicKey);
    if (request.nodeAddress !== '') {
      encodedRequest.setNodeAddress(request.nodeAddress);
    }
    if (request.apiAddress !== '') {
      encodedRequest.setApiAddress(request.apiAddress);
    }
    await ipcRenderer.invoke(
      'UpdatePeerInfo',
      encodedRequest.serializeBinary(),
    );
    return;
  }

  static async UpdateSecret(
    request: clientPB.SecretMessage,
  ): Promise<void> {
    await ipcRenderer.invoke('UpdateSecret', request.serializeBinary());
    return;
  }

  static async VerifyFile(
    request: clientPB.CryptoMessage,
  ): Promise<boolean> {
    const res = await ipcRenderer.invoke('VerifyFile', request.serializeBinary());
    return clientPB.StatusMessage.deserializeBinary(res).getSuccess();
  }

  static async SetIdentity(request: pb.StringMessage.AsObject): Promise<void> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(request.s);
    await ipcRenderer.invoke('SetIdentity', encodedRequest.serializeBinary());
    return;
  }
}

export default PolykeyClient;
