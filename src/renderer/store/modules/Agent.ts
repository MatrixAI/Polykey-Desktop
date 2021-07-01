import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import { keynodePath } from "@/main/server";
import { getDefaultNodePath } from "@matrixai/polykey/src/utils";
import { actions as BootstrapActions } from "@/renderer/store/modules/Bootstrap";
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
    async [actionsInt.CheckAgentStatus]({ commit }): Promise<void> {
      /**OK, so we need to do a few things here.
       * There are 4 states we need to check for.
       * 1. ONLINE: agent running, session open.
       * 2. LOCKED: agent running, session closed.
       * 3. INITIALIZED: proper keynode at path.
       * 4. UNINITILIZED: path has no keynode.
       */
      commit(mutations.SetKeynodePath, './tmp'); //FIXME: Temp path for now.
      if (!state.keynodePath) throw Error("keynode path not set");
    if(await PolykeyClient.CheckAgent(state.keynodePath)) {
        try {
          await PolykeyClient.vaultsList();
        } catch (e) {// FIXME, check if error is due to locked keynode.
          console.log("LOCKED: agent running but locked.");
          commit(mutations.SetStatus, STATUS.LOCKED);
          return;
        }
        console.log("Agent running");
        commit(mutations.SetStatus, STATUS.ONLINE);
        return;
    } else
    {
        console.log("Agent not running.");
        console.log("keynodePath: ", state.keynodePath);
        const result = await PolykeyClient.CheckKeynodeState(state.keynodePath);
        switch (result) {
          case 'EMPTY_DIRECTORY': // un-initialized
          case 'NO_DIRECTORY': // un-initialized
            console.log("UNINITILIZED: path has no keynode.");
            commit(mutations.SetStatus, STATUS.UNINITIALIZED);
            return;
          case 'KEYNODE_EXISTS':// Initialized
            console.log("INITIALIZED: proper keynode at path.");
            commit(mutations.SetStatus, STATUS.INITIALIZED);
            return;
          case 'OTHER_EXISTS':// Invalid.
            throw Error("Directory is not keynode but has contents.");
        }
      }
    },
    async [actionsInt.SetKeynodePath]({ commit, dispatch }, keynodePath) {
      commit(mutations.SetKeynodePath, keynodePath);
      return;
    },
    async [actionsInt.StartAgent]({ commit, dispatch }, password) {// Need to throw actual errors if something goes wrong.
      if(!await PolykeyClient.CheckAgent(state.keynodePath)) {
        //Agent not runing.
        try{
          console.warn("Printing starting agent");
          await dispatch(BootstrapActions.AddEvent, {action: 'Starting', name: 'Agent'}, {root: true});
          const pid = await PolykeyClient.SpawnAgent(state.keynodePath, password);
          commit(mutations.SetPid, pid);
          commit(mutations.SetStatus, STATUS.LOCKED);
        } catch (e) {
          console.error("Problem starting agent.", e);
        }
      } else {
        //Agent was already running.
        commit(mutations.SetStatus, STATUS.LOCKED);
      }
        await PolykeyClient.ConnectClient(state.keynodePath); //TODO: Make a connect to agent goober
    },
    async [actionsInt.SetStatus]({ commit }, status) {
      commit(mutations.SetStatus, status);
    },
  },
  mutations: {
    [mutations.SetStatus](state, status) {
      console.log('status was set to ', status); //FIXME: remove when done with.
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
