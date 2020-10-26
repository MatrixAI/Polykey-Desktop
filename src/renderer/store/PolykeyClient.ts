import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
const ipcRenderer = window.require('electron').ipcRenderer;

class PolykeyClient {
  static async AddPeer(request: pb.PeerInfoMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.PeerInfoMessage();
    encodedRequest.setPublicKey(request.publicKey);
    encodedRequest.setRelayPublicKey(request.relayPublicKey);
    encodedRequest.setPeerAddress(request.peerAddress);
    encodedRequest.setApiAddress(request.apiAddress);
    return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  }
  static async DecryptFile(request: pb.DecryptFileMessage.AsObject): Promise<string> {
    const encodedRequest = new pb.DecryptFileMessage();
    encodedRequest.setFilePath(request.filePath);
    encodedRequest.setPrivateKeyPath(request.privateKeyPath);
    encodedRequest.setPassphrase(request.passphrase);
    return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  }
  static async DeleteKey(keyName: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(keyName);
    return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  }
  static async DeleteSecret(request: pb.SecretPathMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.SecretPathMessage();
    encodedRequest.setVaultName(request.vaultName);
    encodedRequest.setSecretName(request.secretName);
    return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  }
  static async DeleteVault(vaultName: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(vaultName)
    return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  }
  static async DeriveKey(request: pb.DeriveKeyMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.DeriveKeyMessage();
    encodedRequest.setKeyName(request.keyName)
    encodedRequest.setPassphrase(request.passphrase)
    return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  }
  // static async EncryptFile(request: pb.EncryptFileMessage.AsObject): Promise<string> {
  //   const encodedRequest = new pb.EncryptFileMessage();
  //   encodedRequest.setS(request)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async FindPeer(request: pb.ContactPeerMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.ContactPeerMessage();
  //   encodedRequest.setS(vaultName)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async FindSocialPeer(request: pb.ContactPeerMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.ContactPeerMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async GetOAuthClient(): Promise<pb.OAuthClientMessage.AsObject> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async GetKey(keyName: string): Promise<string> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(keyName)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async GetLocalPeerInfo(): Promise<pb.PeerInfoMessage.AsObject> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async GetPeerInfo(publicKey: string): Promise<pb.PeerInfoMessage.AsObject> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(publicKey)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async GetPrimaryKeyPair(includePrivateKey: boolean): Promise<pb.KeyPairMessage.AsObject> {
  //   const encodedRequest = new pb.BooleanMessage();
  //   encodedRequest.setB(includePrivateKey)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async GetRootCertificate(): Promise<string> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async GetSecret(request: pb.SecretPathMessage.AsObject): Promise<string> {
  //   const encodedRequest = new pb.SecretPathMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async GetStatus(): Promise<boolean> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async ListOAuthTokens(): Promise<string[]> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async ListKeys(): Promise<string[]> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async ListPeers(): Promise<string[]> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async ListSecrets(vaultName: string): Promise<string[]> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(vaultName)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async ListVaults(): Promise<string[]> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async NewClientCertificate(request: pb.NewClientCertificateMessage.AsObject): Promise<pb.NewClientCertificateMessage.AsObject> {
  //   const encodedRequest = new pb.NewClientCertificateMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async NewNode(request: pb.NewNodeMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.NewNodeMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async NewSecret(request: pb.SecretContentMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.SecretContentMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async NewOAuthToken(request: pb.NewOAuthTokenMessage.AsObject): Promise<string> {
  //   const encodedRequest = new pb.NewOAuthTokenMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async NewVault(vaultName: string): Promise<boolean> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(vaultName)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async PingPeer(request: pb.ContactPeerMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.ContactPeerMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async PullVault(request: pb.VaultPathMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.VaultPathMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async RegisterNode(polykeyPath: string): Promise<boolean> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(polykeyPath)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async RevokeOAuthToken(token: string): Promise<boolean> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(token)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async RequestHolePunch(publicKey: string): Promise<boolean> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(publicKey)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async RequestRelay(publicKey: string): Promise<boolean> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(publicKey)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async ScanVaultNames(publicKey: string): Promise<string[]> {
  //   const encodedRequest = new pb.StringMessage();
  //   encodedRequest.setS(publicKey)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async SignFile(request: pb.SignFileMessage.AsObject): Promise<string> {
  //   const encodedRequest = new pb.SignFileMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async StopAgent(): Promise<boolean> {
  //   return await ipcRenderer.invoke(Function.name)
  // }
  // static async ToggleStealthMode(isActive: boolean): Promise<boolean> {
  //   const encodedRequest = new pb.BooleanMessage();
  //   encodedRequest.setB(isActive)
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async UpdateLocalPeerInfo(request: pb.PeerInfoMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.PeerInfoMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async UpdatePeerInfo(request: pb.PeerInfoMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.PeerInfoMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async UpdateSecret(request: pb.SecretContentMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.SecretContentMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
  // static async VerifyFile(request: pb.VerifyFileMessage.AsObject): Promise<boolean> {
  //   const encodedRequest = new pb.VerifyFileMessage();
  //   return await ipcRenderer.invoke(Function.name, encodedRequest.serializeBinary())
  // }
}

export default PolykeyClient;
