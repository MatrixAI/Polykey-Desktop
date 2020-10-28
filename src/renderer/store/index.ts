import { createStore } from 'vuex';

import Alert from '@/store/modules/Alert';
import Configuration from '@/store/modules/Configuration';
import ConfigurationDialog from '@/store/modules/ConfirmationDialog';
import Drawer from '@/store/modules/Drawer';
import Keys from '@/store/modules/Keys';
import Peers from '@/store/modules/Peers';
import Secrets from '@/store/modules/Secrets';
import Vaults from '@/store/modules/Vaults';
import PolykeyClient from './PolykeyClient';

export default createStore({
  modules: {
    Alert,
    Configuration,
    ConfigurationDialog,
    Drawer,
    Keys,
    Peers,
    Secrets,
    Vaults,
  },
});

PolykeyClient.NewNode(<any>{
  userid: 'robdog',
  passphrase: 'passphrase',
})
  .then(async b => {
    console.log('heyyyy1');

    console.log(b);
    console.log(await PolykeyClient.NewVault('heyy'));
    console.log(await PolykeyClient.ListVaults());
  })
  .catch(e => {
    console.log('heyyyy2');
    console.log(e);
  });

// PolykeyClient.StartAgent()
//   .then(async (b) => {
//     console.log('heyyyy1');
//     console.log(b)
//   })
//   .catch(e => {
//     console.log('heyyyy2');
//     console.log(e);
//   });
