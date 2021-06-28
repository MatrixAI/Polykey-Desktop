import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import { STATUS } from "@/renderer/store/modules/Agent";

const [actionsInt, actionsExt] = makeIdentifiers('Bootstrap', [
  'BootstrapKeynode',
]);

const enum mutations {
  SetIsUnlocked = 'Agent/SetIsUnlocked',
  SetStatus = 'Agent/SetStatus',
  SetPassword = 'Agent/SetPassword',
}

type State = {};

const state: State = {};

export { actionsExt as actions };

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.BootstrapKeynode]({ commit }, password) {
      try {
        console.log('Starting to InitializeKeyNode');
        await PolykeyClient.BootstrapKeynode('./tmp', password);
        commit(mutations.SetPassword, password, {root: true});
        return commit(mutations.SetStatus, STATUS.INITIALIZED, {root: true});
      } catch (e) {
        console.log('Error InitializeKeyNode', e);
      }
    },
  },
  mutations: {},
  getters: {},
};
