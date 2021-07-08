import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import { STATUS } from '@/renderer/store/modules/Agent';

const [actionsInt, actionsExt] = makeIdentifiers('Nodes', [
  'SetIsUnlocked',
  'SetIsInitialized',
  'SetStatus',
  'GetLocalNodeInfo',
  'ListNodes',
  'ScanNode',
  'PullVaults',
  'PingNode',
]);

const enum mutations {
  SetGetLocalNodeInfo = 'SetGetLocalNodeInfo',
  SetListNodes = 'SetListNodes',
  //Note, these are modifying mutations inside the Agents module.
  //I don't like having the side effects either.
  SetIsUnlocked = 'Agent/SetIsUnlocked',
  SetIsInitialized = 'Agent/SetIsInitialized',
  SetStatus = 'Agent/SetStatus',
}

type State = {
  nodes: string[];
  localNodeInfo; //FIXME No type, not good
  // localNodeInfo: pb.NodeInfoMessage.AsObject;
};

const state: State = {
  nodes: [],
  localNodeInfo: {
    pem: '',
    alias: '',
    publicKey: '',
    nodeId: '',
    rootPublicKey: '',
    nodeAddress: '',
    apiAddress: '',
    linkInfoList: [
      {
        type: '',
        node: '',
        identity: '',
        provider: '',
        dateissued: '',
        signature: '',
        key: '',
        url: '',
      },
    ],
  },
};

export { actionsExt as actions };

export default {
  namespaced: true,
  state,
  actions: {
    // async [actionsInt.UnlockKeyNode]({ commit }, passphrase: string) {
    //   const result = await PolykeyClient.UnlockNode({
    //     timeout: 0,
    //     passphrase,
    //   });
    //   if (result !== null) {
    //     return commit(mutations.SetStatus, STATUS.ONLINE, {root: true});
    //   }
    // }, //TODO: Now handled by sessions, move back into agent module.
    async [actionsInt.GetLocalNodeInfo]({ commit }) {
      const localNodeInfo = await PolykeyClient.NodesGetLocalInfo();
      commit(mutations.SetGetLocalNodeInfo, localNodeInfo);
    },
    async [actionsInt.ListNodes]({ commit }) {
      const NodeIds = await PolykeyClient.NodesList();
      console.log(NodeIds);
      commit(mutations.SetListNodes);
    },
    async [actionsInt.PingNode]({ commit }, NodeId: string) {
      //commit(mutations.PullVaults, searchMode);
    },
  },
  mutations: {
    [mutations.SetGetLocalNodeInfo](state, localNodeInfo) {
      state.localNodeInfo = localNodeInfo;
    },
    [mutations.SetListNodes]: function (state: State, Nodes: string[]) {
      state.nodes = Nodes;
    },
  },
  getters: {},
};
