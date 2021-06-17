import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';

const DELAY = 0;

const [actionsInt, actionsExt] = makeIdentifiers('Agent', [
  'CheckAgentStatus',
]);

const enum mutations {
  SetIsUnlocked = 'SetIsUnlocked',
  SetIsInitialized = 'SetIsInitialized',
  SetStatus = 'SetStatus',
}

const enum STATUS {
  PENDING = 'PENDING',
  ONLINE = 'ONLINE',
  LOCKED = 'LOCKED',
  UNINITIALIZED = 'UNINITIALIZED',
}

type State = {
  status: STATUS;
  isUnlocked: boolean;
  isInitialized: boolean;
};

const state: State = {
  status: STATUS.PENDING,
  isUnlocked: false,
  isInitialized: false,
};

export { actionsExt as actions };
export { STATUS };

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.CheckAgentStatus]({ commit }) {
      try {
        console.log('Checking CheckUserStatus');
        const pid = await PolykeyClient.StartAgent();

        console.log(`Done starting agent CheckUserStatus : ${pid}`);
        // This needs to discussed
        commit(mutations.SetIsInitialized, true);

        // We can get the actual error if we load this up
        console.log('Starting to ListKeys');
        await PolykeyClient.ListKeys();  //TODO Replace with a function that checks if node is unlocked.
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
  },
  mutations: {
    [mutations.SetStatus](state, status) {
      state.status = status;
    },
    [mutations.SetIsUnlocked](state, isUnlocked) {
      state.isUnlocked = isUnlocked;
    },
    [mutations.SetIsInitialized](state, isInitialized) {
      state.isInitialized = isInitialized;
    },
  },
  getters: {},
};
