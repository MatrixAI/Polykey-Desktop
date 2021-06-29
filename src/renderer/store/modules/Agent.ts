import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import { keynodePath } from "@/main/server";
import { getDefaultNodePath } from "@matrixai/polykey/src/utils";
import type { BootstrapEvent } from "@/renderer/store/modules/Bootstrap";
import { actions as BootstrapActions } from "@/renderer/store/modules/Bootstrap";
import { checkAgentRunning } from '@/utils'
const DELAY = 0;

const [actionsInt, actionsExt] = makeIdentifiers('Agent', [
  'CheckAgentStatus',
  'SetKeynodePath',
  'BootstrapKeynode',
  'StartAgent',
  'SetStatus',
]);

const enum mutations {
  SetStatus = 'SetStatus',
  SetKeynodePath = 'SetKeynodePath',
  SetPassword = 'SetPassword',
  SetPid = 'SetPid',
}

const enum STATUS {
  PENDING = 'PENDING',
  ONLINE = 'ONLINE',
  LOCKED = 'LOCKED',
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZED = 'INITIALIZED',
}

type State = {
  status: STATUS;
  pid: number;
  keynodePath: string;
  password: string;
};

const state: State = {
  status: STATUS.PENDING,
  pid: 0,
  keynodePath: '',
  password: '',
};

export { actionsExt as actions };
export { STATUS };

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.CheckAgentStatus]({ commit }) {
      /**OK, so we need to do a few things here.
       * There are 4 states we need to check for.
       * 1. ONLINE: agent running, session open.
       * 2. LOCKED: agent running, session closed.
       * 3. INITIALIZED: proper keynode at path.
       * 4. UNINITILIZED: path has no keynode.
       */

      commit(mutations.SetKeynodePath, './tmp'); //FIXME: Temp path for now.
      if (!state.keynodePath) throw Error("keynode path not set");
      try{
      await PolykeyClient.ConnectClient(state.keynodePath);
      console.log("Agent running");
      try {
        await PolykeyClient.vaultsList();
      } catch (e) {// FIXME, check if error is due to locked keynode.
        console.log("LOCKED: agent running but locked.");
        commit(mutations.SetStatus, STATUS.LOCKED);
        return;
      }
      console.log("ONLINE: Agent running, unlocked.");
      commit(mutations.SetStatus, STATUS.ONLINE);
      return;

      }catch (e) {
        console.log("Agent not running.");
        console.log("keynodePath: ", state.keynodePath);
        const result = await PolykeyClient.CheckKeynodeState(state.keynodePath);
        switch (result) {
          case 0: // un-initialized
            console.log("UNINITILIZED: path has no keynode.");
            commit(mutations.SetStatus, STATUS.UNINITIALIZED);
            return;
          case 1:// Initialized
            console.log("INITIALIZED: proper keynode at path.");
            commit(mutations.SetStatus, STATUS.INITIALIZED);
            return;
          case 2:// Invalid.
            throw Error("Directory is not keynode but has contents.");
            break;
        }
      }

    },
    async [actionsInt.SetKeynodePath]({ commit, dispatch }, keynodePath) {
      commit(mutations.SetKeynodePath, keynodePath);
      return;
    },
    async [actionsInt.StartAgent]({ commit, dispatch }, password) {// Need to throw actual errors if something goes wrong.
      if(!await checkAgentRunning(state.keynodePath)){
        try{
          console.warn("Printing starting agent");
          await dispatch(BootstrapActions.AddEvent, {action: 'Starting', name: 'Agent'}, {root: true});
          const pid = await PolykeyClient.SpawnAgent(state.keynodePath, password);
          commit(mutations.SetPid, pid);
        } catch (e) {
          console.error("Problem starting agent.", e);
        }
      }
      commit(mutations.SetStatus, STATUS.LOCKED);
    },
    async [actionsInt.SetStatus]({ commit }, status) {
      commit(mutations.SetStatus, status);
    },
  },
  mutations: {
    [mutations.SetStatus](state, status) {
      console.log('status was set to ', status);
      state.status = status;
    },
    [mutations.SetKeynodePath](state, keynodePath){
      state.keynodePath = keynodePath;
    },
    [mutations.SetPassword](state, password) {
      state.password = password;
    },
    [mutations.SetPid](state, pid) {
      state.pid = pid;
    },
  },
  getters: {},
};
