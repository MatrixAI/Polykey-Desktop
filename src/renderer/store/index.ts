import { createStore } from 'vuex';

import Alert from '@renderer/store/modules/Alert';
import Configuration from '@renderer/store/modules/Configuration';
import ConfigurationDialog from '@renderer/store/modules/ConfirmationDialog';
import Drawer from '@renderer/store/modules/Drawer';
import Keys from '@renderer/store/modules/Keys';
import Peers from '@renderer/store/modules/Peers';
import Secrets from '@renderer/store/modules/Secrets';
import Vaults from '@renderer/store/modules/Vaults';
import User from '@renderer/store/modules/User';
import Gestalt from '@renderer/store/modules/Gestalt';

export default createStore({
  modules: {
    Alert,
    Configuration,
    ConfigurationDialog,
    Drawer,
    Keys,
    Peers,

    /** Currently used */
    Secrets,
    Vaults,
    User,
    Gestalt
  }
});
