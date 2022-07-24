import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import type { STATUS } from '@/renderer/store/modules/Agent';
import { actions as agentActions } from '@/renderer/store/modules/Agent';

const [actionsInt, actionsExt] = makeIdentifiers('Bootstrap', [
  'BootstrapKeynode',
  'AddEvent',
]);

const enum mutations {
  SetIsUnlocked = 'Agent/SetIsUnlocked',
  SetStatus = 'Agent/SetStatus',
  SetPassword = 'Agent/SetPassword',
  AddEvent = 'AddEvent',
}

type BootstrapEvent = {
  action: string;
  name: string;
};
export { BootstrapEvent };

type State = {
  events: BootstrapEvent[];
};

const state: State = {
  events: [
    // {action: 'Bootstrapping', name: 'Keynode'},
    // {action: 'Installing', name: 'Agent'},
  ],
};

export { actionsExt as actions };

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.BootstrapKeynode]({ commit, dispatch }, password) {
      try {
        console.log('Starting to InitializeKeyNode');
        commit(mutations.AddEvent, {
          action: 'Bootstrapping',
          name: 'Keynode',
        });
        await PolykeyClient.BootstrapKeynode('./tmp', password);
        dispatch(agentActions.StartAgent, password, { root: true });
      } catch (e) {
        commit(mutations.AddEvent, { action: 'Bootstrapping', name: 'Failed' });
        console.log('Error InitializeKeyNode', e);
      }
    },
    async [actionsInt.AddEvent]({ commit }, event: BootstrapEvent) {
      commit(mutations.AddEvent, event);
    },
  },
  mutations: {
    [mutations.AddEvent](state, event: BootstrapEvent) {
      state.events.push(event);
    },
  },
  getters: {},
};
