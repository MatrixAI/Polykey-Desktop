import Vue from "vue";
import Vuex from "vuex";
import { Mutex } from 'async-mutex';
import Keys from '@/store/modules/Keys';
import Peers from '@/store/modules/Peers';
import Alert from '@/store/modules/Alert';
import Vaults from '@/store/modules/Vaults';
import Drawer from '@/store/modules/Drawer';
import Secrets from '@/store/modules/Secrets';
import Configuration from '@/store/modules/Configuration';
import RendererIPCStream from '@/store/RendererIPCStream';
// import PolykeyClient from 'js-polykey/dist/lib/browser-client';
import ConfirmationDialog from '@/store/modules/ConfirmationDialog';

const mutex = new Mutex()

// const polykeyClient = new PolykeyClient(
//   () => {
//     const ipcStream = new RendererIPCStream('polykey-agent', {})

//     mutex.acquire()
//       .then((release) => {
//         ipcStream.on('data', (data) => {
//           ipcStream.emit('end')
//           release()
//         })
//       })

//     return <any>ipcStream
//   }
// )
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
      private: 'private key',
    }
  },
  updateSecret: (vaultName: string, secretName: string, secretContent: Buffer) => {
    return true
  },
  newVault: (vaultName: string, ) => {
    return true
  },
  createSecret: (vaultName: string, secretName: string, secretContent: string) => {
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
  }
}

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Alert: Alert,
    Drawer: Drawer,
    ConfirmationDialog: ConfirmationDialog,
    Peers: Peers,
    Vaults: Vaults,
    Secrets: Secrets,
    Keys: Keys,
    Configuration: Configuration
  }
})

export default store
export { polykeyClient }
