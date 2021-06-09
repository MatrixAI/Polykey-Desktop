import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import { clientPB } from '@matrixai/polykey/src/client';

const DELAY = 0;

const [actionsInt, actionsExt] = makeIdentifiers('User', [
  'CreateNewNode',
  'UnlockKeyNode',
  'CheckUserStatus',
  'SetIsUnlocked',
  'SetIsInitialized',
  'SetStatus',
  'GetLocalPeerInfo',
]);

const enum mutations {
  SetIsUnlocked = 'SetIsUnlocked',
  SetIsInitialized = 'SetIsInitialized',
  SetStatus = 'SetStatus',
  SetGetLocalPeerInfo = 'SetGetLocalPeerInfo',
}

const enum STATUS {
  PENDING = 'PENDING',
  ONLINE = 'ONLINE',
  LOCKED = 'LOCKED',
  UNINITIALIZED = 'UNINITIALIZED',
}

type State = {
  isUnlocked: boolean;
  isInitialized: boolean;
  status: STATUS;
  localPeerInfo: clientPB.EmptyMessage.AsObject/*pb.NodeInfoMessage.AsObject*/;
};

const state: State = {
  isUnlocked: false,
  isInitialized: false,
  status: STATUS.PENDING,
  localPeerInfo: {
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
export { STATUS };

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.CreateNewNode]({ commit }, node) {
      try {
        console.log('Starting to InitializeKeyNode');
        const result = await PolykeyClient.InitializeKeyNode(node);
        console.log(result);
        if (result === undefined) {
          commit(mutations.SetIsUnlocked, true);
          return commit(mutations.SetStatus, STATUS.ONLINE);
        }
      } catch (e) {
        console.log('Error InitializeKeyNode', e);
      }
    },
    async [actionsInt.UnlockKeyNode]({ commit }, passphrase: string) {
      const result = await PolykeyClient.UnlockNode({
        timeout: 0,
        passphrase,
      });
      if (result !== null) {
        commit(mutations.SetIsUnlocked, true);
        return commit(mutations.SetStatus, STATUS.ONLINE);
      }
    },
    async [actionsInt.CheckUserStatus]({ commit }) {
      try {
        console.log('Checking CheckUserStatus');
        const pid = await PolykeyClient.StartAgent();

        console.log(`Done starting agent CheckUserStatus : ${pid}`);
        // This needs to discussed
        commit(mutations.SetIsInitialized, true);

        // We can get the actual error if we load this up
        console.log('Starting to ListKeyts');
        await PolykeyClient.ListKeys();
        commit(mutations.SetIsUnlocked, true);
        setTimeout(() => {
          return commit(mutations.SetStatus, STATUS.ONLINE);
        }, DELAY);
      } catch (error) {
        console.log('Error:', error);
        if (error.message.includes('locked')) {
          setTimeout(() => {
            return commit(mutations.SetStatus, STATUS.LOCKED);
          }, DELAY);
        }

        if (error.message.includes('not been initialized')) {
          setTimeout(() => {
            return commit(mutations.SetStatus, STATUS.UNINITIALIZED);
          }, DELAY);
        }
      }
    },
    async [actionsInt.SetIsUnlocked]({ commit }, isUnlocked: boolean) {
      commit(mutations.SetIsUnlocked, isUnlocked);
    },
    async [actionsInt.SetIsInitialized]({ commit }, isInitialized: boolean) {
      commit(mutations.SetIsInitialized, isInitialized);
    },
    async [actionsInt.SetStatus]({ commit }, status: string) {
      commit(mutations.SetStatus, status);
    },
    async [actionsInt.GetLocalPeerInfo]({ commit }) {
      const localPeerInfo = await PolykeyClient.GetLocalPeerInfo();
      commit(mutations.SetGetLocalPeerInfo, localPeerInfo);
    },
  },
  mutations: {
    [mutations.SetIsUnlocked](state, isUnlocked) {
      state.isUnlocked = isUnlocked;
    },
    [mutations.SetIsInitialized](state, isInitialized) {
      state.isInitialized = isInitialized;
    },
    [mutations.SetStatus](state, status) {
      state.status = status;
    },
    [mutations.SetGetLocalPeerInfo](state, localPeerInfo) {
      state.localPeerInfo = localPeerInfo;
    },
  },
  getters: {},
};
