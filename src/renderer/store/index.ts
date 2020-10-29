import { createStore } from 'vuex'

import Alert from '@/store/modules/Alert'
import Configuration from '@/store/modules/Configuration'
import ConfigurationDialog from '@/store/modules/ConfirmationDialog'
import Drawer from '@/store/modules/Drawer'
import Keys from '@/store/modules/Keys'
import Peers from '@/store/modules/Peers'
import Secrets from '@/store/modules/Secrets'
import Vaults from '@/store/modules/Vaults'
import PolykeyClient from './PolykeyClient'

export default createStore({
  modules: {
    Alert,
    Configuration,
    ConfigurationDialog,
    Drawer,
    Keys,
    Peers,
    Secrets,
    Vaults
  }
})

PolykeyClient.StartAgent().then((pid) => {
  console.log(pid);

}).catch((e) => {
  console.log(e);

})

// PolykeyClient.NewNode(<any>{
//   userid: "robdog",
//   passphrase: "passphrase"
// }).then((b) => {
//   console.log(b);
//   console.log(PolykeyClient.StartAgent());

// }).catch((e) => {
//   console.log(e);

// })

