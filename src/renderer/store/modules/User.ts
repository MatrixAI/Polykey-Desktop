import PolykeyClient from '@renderer/resources/client';
import { makeIdentifiers } from '@renderer/store/utils';

const DELAY = 2500;

const [actionsInt, actionsExt] = makeIdentifiers('User', [
  'CreateNewNode',
  'UnlockKeyNode',
  'CheckUserStatus',
  'SetIsUnlocked',
  'SetIsInitialized',
  'SetStatus'
]);

const enum mutations {
  SetIsUnlocked = 'SetIsUnlocked',
  SetIsInitialized = 'SetIsInitialized',
  SetStatus = 'SetStatus'
}

const enum STATUS {
  PENDING = 'PENDING',
  ONLINE = 'ONLINE',
  LOCKED = 'LOCKED',
  UNINITIALIZED = 'UNINITIALIZED'
}

type State = {
  isUnlocked: boolean;
  isInitialized: boolean;
  status: STATUS;
};

const state: State = {
  isUnlocked: false,
  isInitialized: false,
  status: STATUS.PENDING
};

export { actionsExt as actions };
export { STATUS };

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.CreateNewNode]({ commit }, node) {
      const result = await PolykeyClient.NewNode(node);
      if (result) {
        commit(mutations.SetIsUnlocked, true);
        return commit(mutations.SetStatus, STATUS.ONLINE);
      }
    },
    async [actionsInt.UnlockKeyNode]({ commit }, passphrase: string) {
      const result = await PolykeyClient.UnlockNode({
        timeout: 0,
        passphrase
      });
      if (result) {
        commit(mutations.SetIsUnlocked, true);
        return commit(mutations.SetStatus, STATUS.ONLINE);
      }
    },
    async [actionsInt.CheckUserStatus]({ commit }) {
      try {
        const pid = await PolykeyClient.StartAgent();
        // This needs to discussed
        commit(mutations.SetIsInitialized, true);

        // We can get the actual error if we load this up
        await PolykeyClient.ListKeys();
        commit(mutations.SetIsUnlocked, true);
        setTimeout(() => {
          return commit(mutations.SetStatus, STATUS.ONLINE);
        }, DELAY);
      } catch (error) {
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
    }
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
    }
  },
  getters: {}
};
