const polykeyClient = {
  listKeys: () => {
    return ['some-key']
  },
  listPeers: () => {
    return ['some-peer']
  },
  listSecrets: (vaultName: string) => {
    return ['some-secret']
  },
  listVaults: () => {
    return ['some-vault']
  },
  deleteKey: (keyName: string) => {
    return true
  },
  getPrimaryKeyPair: (includePrivateKey: boolean) => {
    return {
      public: 'public key',
      private: 'private key'
    }
  },
  updateSecret: (vaultName: string, secretName: string, secretContent: Buffer) => {
    return true
  },
  newVault: (vaultName: string) => {
    return true
  },
  createSecret: (vaultName: string, secretName: string, secretContent: Buffer) => {
    return true
  },
  getSecret: (vaultName: string, secretName: string) => {
    return Buffer.from('some secret content')
  },
  getKey: (keyName: string) => {
    return 'key content'
  },
  getAgentStatus: () => {
    return 'online'
  },
  unlockNode: (passphrase: string) => {
    return true
  },
  deleteVault: (vaultName: string) => {
    return true
  },
  deriveKey: (keyName: string, keyContent: string) => {
    return true
  },
  deleteSecret: (vaultName: string, secretName: string) => {
    return true
  }
}

export { polykeyClient }