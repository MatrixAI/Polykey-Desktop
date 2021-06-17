import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import { STATUS } from "@/renderer/store/modules/Agent";

const [actionsInt, actionsExt] = makeIdentifiers('Bootstrap', [
  'CreateNewNode',
]);

const enum mutations {
  SetIsUnlocked = 'Agent/SetIsUnlocked',
  SetStatus = 'Agent/SetStatus',
}

type State = {};

const state: State = {};

export { actionsExt as actions };

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
          commit(mutations.SetIsUnlocked, true, {root: true});
          return commit(mutations.SetStatus, STATUS.ONLINE, {root: true});
        }
      } catch (e) {
        console.log('Error InitializeKeyNode', e);
      }
    },
  },
  mutations: {},
  getters: {},
};
