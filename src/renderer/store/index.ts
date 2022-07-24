import { createStore } from 'vuex';

/// Other modules
import Alert from '@/renderer/store/modules/Alert';
import Configuration from '@/renderer/store/modules/Configuration';
import ConfigurationDialog from '@/renderer/store/modules/ConfirmationDialog';
import Drawer from '@/renderer/store/modules/Drawer';
/// Subdomain modules
import Keys from '@/renderer/store/modules/Keys';
import Secrets from '@/renderer/store/modules/Secrets';
import Vaults from '@/renderer/store/modules/Vaults';
import Nodes from '@/renderer/store/modules/Nodes';
import Gestalt from '@/renderer/store/modules/Gestalt';
import Agent from '@/renderer/store/modules/Agent';
import Bootstrap from '@/renderer/store/modules/Bootstrap';

export default createStore({
  modules: {
    Alert,
    Configuration,
    ConfigurationDialog,
    Drawer,

    /** Related to subdomains of js-polykey*/
    Bootstrap,
    Keys,
    /** Currently used */
    Agent,
    Secrets,
    Vaults,
    Nodes,
    Gestalt,
  },
});
