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
import PolykeyClient from 'js-polykey/dist/lib/browser-client';
import ConfirmationDialog from '@/store/modules/ConfirmationDialog';

const mutex = new Mutex()

const polykeyClient = new PolykeyClient(
  () => {
    const ipcStream = new RendererIPCStream('polykey-agent', {})

    mutex.acquire()
      .then((release) => {
        ipcStream.on('data', (data) => {
          ipcStream.emit('end')
          release()
        })
      })

    return <any>ipcStream
  }
)

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
