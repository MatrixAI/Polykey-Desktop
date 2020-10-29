import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
const ipcRenderer = window.require('electron').ipcRenderer;

class PolykeyClient {
  ///////////////////
  // Agent Handler //
  ///////////////////
  static async StartAgent(): Promise<number> {
    console.log('starting agent');

    return await ipcRenderer.invoke('agent-start')
  }
  static async RestartAgent(): Promise<number> {
    return await ipcRenderer.invoke('agent-restart')
  }
  ///////////////////
  // GRPC Handlers //
  ///////////////////
  static async AddPeer(request: pb.PeerInfoMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.PeerInfoMessage();
    encodedRequest.setPublicKey(request.publicKey);
    encodedRequest.setRelayPublicKey(request.relayPublicKey);
    encodedRequest.setPeerAddress(request.peerAddress);
    encodedRequest.setApiAddress(request.apiAddress);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('AddPeer', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async DecryptFile(request: pb.DecryptFileMessage.AsObject): Promise<string> {
    const encodedRequest = new pb.DecryptFileMessage();
    encodedRequest.setFilePath(request.filePath);
    encodedRequest.setPrivateKeyPath(request.privateKeyPath);
    encodedRequest.setPassphrase(request.passphrase);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke('DecryptFile', encodedRequest.serializeBinary()),
    );
    return res.getS();
  }
  static async DeleteKey(keyName: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(keyName);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('DeleteKey', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async DeleteSecret(request: pb.SecretPathMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.SecretPathMessage();
    encodedRequest.setVaultName(request.vaultName);
    encodedRequest.setSecretName(request.secretName);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('DeleteSecret', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async DeleteVault(vaultName: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(vaultName);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('DeleteVault', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async DeriveKey(request: pb.DeriveKeyMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.DeriveKeyMessage();
    encodedRequest.setKeyName(request.keyName);
    encodedRequest.setPassphrase(request.passphrase);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('DeriveKey', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async EncryptFile(request: pb.EncryptFileMessage.AsObject): Promise<string> {
    const encodedRequest = new pb.EncryptFileMessage();
    encodedRequest.setFilePath(request.filePath);
    encodedRequest.setPublicKeyPath(request.publicKeyPath);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke('EncryptFile', encodedRequest.serializeBinary()),
    );
    return res.getS();
  }
  static async FindPeer(request: pb.ContactPeerMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.ContactPeerMessage();
    encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    encodedRequest.setTimeout(request.timeout);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('FindPeer', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async FindSocialPeer(request: pb.ContactPeerMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.ContactPeerMessage();
    encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    encodedRequest.setTimeout(request.timeout);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('FindSocialPeer', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async GetOAuthClient(): Promise<pb.OAuthClientMessage.AsObject> {
    return await ipcRenderer.invoke('GetOAuthClient');
  }
  static async GetKey(keyName: string): Promise<string> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(keyName);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke('GetKey', encodedRequest.serializeBinary()),
    );
    return res.getS();
  }
  static async GetLocalPeerInfo(): Promise<pb.PeerInfoMessage.AsObject> {
    return await ipcRenderer.invoke('GetLocalPeerInfo');
  }
  static async GetPeerInfo(publicKey: string): Promise<pb.PeerInfoMessage.AsObject> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(publicKey);
    const res = pb.PeerInfoMessage.deserializeBinary(
      await ipcRenderer.invoke('GetPeerInfo', encodedRequest.serializeBinary()),
    );
    return res.toObject();
  }
  static async GetPrimaryKeyPair(includePrivateKey: boolean): Promise<pb.KeyPairMessage.AsObject> {
    const encodedRequest = new pb.BooleanMessage();
    encodedRequest.setB(includePrivateKey);
    const res = pb.KeyPairMessage.deserializeBinary(
      await ipcRenderer.invoke('GetPrimaryKeyPair', encodedRequest.serializeBinary()),
    );
    return res.toObject();
  }
  static async GetRootCertificate(): Promise<string> {
    return await ipcRenderer.invoke('GetRootCertificate');
  }
  static async GetSecret(request: pb.SecretPathMessage.AsObject): Promise<string> {
    const encodedRequest = new pb.SecretPathMessage();
    encodedRequest.setVaultName(request.vaultName);
    encodedRequest.setSecretName(request.secretName);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke('GetSecret', encodedRequest.serializeBinary()),
    );
    return res.getS();
  }
  static async GetStatus(): Promise<string> {
    const res = pb.AgentStatusMessage.deserializeBinary(await ipcRenderer.invoke('GetStatus'));
    return pb.AgentStatusType[res.getStatus()];
  }
  static async ListOAuthTokens(): Promise<string[]> {
    const res = pb.StringListMessage.deserializeBinary(await ipcRenderer.invoke('ListOAuthTokens'));
    return res.getSList();
  }
  static async ListKeys(): Promise<string[]> {
    const res = pb.StringListMessage.deserializeBinary(await ipcRenderer.invoke('ListKeys'));
    return res.getSList();
  }
  static async ListPeers(): Promise<string[]> {
    const res = pb.StringListMessage.deserializeBinary(await ipcRenderer.invoke('ListPeers'));
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
  static async ListVaults(): Promise<string[]> {
    const res = pb.StringListMessage.deserializeBinary(await ipcRenderer.invoke('ListVaults'));
    return res.getSList();
  }
  static async NewClientCertificate(
    request: pb.NewClientCertificateMessage.AsObject,
  ): Promise<pb.NewClientCertificateMessage.AsObject> {
    const encodedRequest = new pb.NewClientCertificateMessage();
    encodedRequest.setDomain(request.domain);
    encodedRequest.setCertFile(request.certFile);
    encodedRequest.setKeyFile(request.keyFile);
    const res = pb.NewClientCertificateMessage.deserializeBinary(
      await ipcRenderer.invoke('NewClientCertificate', encodedRequest.serializeBinary()),
    );
    return res.toObject();
  }
  static async NewNode(request: pb.NewNodeMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.NewNodeMessage();
    encodedRequest.setUserid(request.userid);
    encodedRequest.setPassphrase(request.passphrase);
    encodedRequest.setNbits(request.nbits);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('NewNode', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async NewSecret(request: pb.SecretContentMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.SecretContentMessage();
    const secretPathMessage = new pb.SecretPathMessage();
    secretPathMessage.setVaultName(request.secretPath!.vaultName);
    secretPathMessage.setSecretName(request.secretPath!.secretName);
    encodedRequest.setSecretPath(secretPathMessage);
    encodedRequest.setSecretFilePath(request.secretFilePath);
    encodedRequest.setSecretContent(request.secretContent);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('NewSecret', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async NewOAuthToken(request: pb.NewOAuthTokenMessage.AsObject): Promise<string> {
    const encodedRequest = new pb.NewOAuthTokenMessage();
    encodedRequest.setScopesList(request.scopesList);
    encodedRequest.setExpiry(request.expiry);
    const res = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke('NewOAuthToken', encodedRequest.serializeBinary()),
    );
    return res.getS();
  }
  static async NewVault(vaultName: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(vaultName);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('NewVault', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async PingPeer(request: pb.ContactPeerMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.ContactPeerMessage();
    encodedRequest.setPublicKeyOrHandle(request.publicKeyOrHandle);
    encodedRequest.setTimeout(request.timeout);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('PingPeer', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async PullVault(request: pb.VaultPathMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.VaultPathMessage();
    encodedRequest.setPublicKey(request.publicKey);
    encodedRequest.setVaultName(request.vaultName);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('PullVault', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async RegisterNode(passphrase: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(passphrase);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('RegisterNode', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async RevokeOAuthToken(token: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(token);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('RevokeOAuthToken', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async RequestHolePunch(publicKey: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(publicKey);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('RequestHolePunch', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async RequestRelay(publicKey: string): Promise<boolean> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(publicKey);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('RequestRelay', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async ScanVaultNames(publicKey: string): Promise<string[]> {
    const encodedRequest = new pb.StringMessage();
    encodedRequest.setS(publicKey);
    const res = pb.StringListMessage.deserializeBinary(
      await ipcRenderer.invoke('ScanVaultNames', encodedRequest.serializeBinary()),
    );
    return res.getSList();
  }
  static async SignFile(request: pb.SignFileMessage.AsObject): Promise<string> {
    const encodedRequest = new pb.SignFileMessage();
    const response = pb.StringMessage.deserializeBinary(
      await ipcRenderer.invoke('SignFile', encodedRequest.serializeBinary()),
    );
    return response.getS();
  }
  static async StopAgent(): Promise<boolean> {
    return await ipcRenderer.invoke('StopAgent');
  }
  static async ToggleStealthMode(isActive: boolean): Promise<boolean> {
    const encodedRequest = new pb.BooleanMessage();
    encodedRequest.setB(isActive);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('ToggleStealthMode', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async UpdateLocalPeerInfo(request: pb.PeerInfoMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.PeerInfoMessage();
    encodedRequest.setPublicKey(request.publicKey);
    encodedRequest.setRelayPublicKey(request.relayPublicKey);
    encodedRequest.setPeerAddress(request.peerAddress);
    encodedRequest.setApiAddress(request.apiAddress);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('UpdateLocalPeerInfo', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async UpdatePeerInfo(request: pb.PeerInfoMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.PeerInfoMessage();
    encodedRequest.setPublicKey(request.publicKey);
    encodedRequest.setRelayPublicKey(request.relayPublicKey);
    encodedRequest.setPeerAddress(request.peerAddress);
    encodedRequest.setApiAddress(request.apiAddress);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('UpdatePeerInfo', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async UpdateSecret(request: pb.SecretContentMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.SecretContentMessage();
    const secretPathMessage = new pb.SecretPathMessage();
    secretPathMessage.setVaultName(request.secretPath!.vaultName);
    secretPathMessage.setSecretName(request.secretPath!.secretName);
    encodedRequest.setSecretPath(secretPathMessage);
    encodedRequest.setSecretFilePath(request.secretFilePath);
    encodedRequest.setSecretContent(request.secretContent);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('UpdateSecret', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
  static async VerifyFile(request: pb.VerifyFileMessage.AsObject): Promise<boolean> {
    const encodedRequest = new pb.VerifyFileMessage();
    encodedRequest.setFilePath(request.filePath);
    encodedRequest.setPublicKeyPath(request.publicKeyPath);
    const res = pb.BooleanMessage.deserializeBinary(
      await ipcRenderer.invoke('VerifyFile', encodedRequest.serializeBinary()),
    );
    return res.getB();
  }
}

export default PolykeyClient;
