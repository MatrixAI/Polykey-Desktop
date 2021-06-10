import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';

const [actionsInt, actionsExt] = makeIdentifiers('Vaults', [
  'NewVault',
  'SearchFilter',
  'LoadVaultNames',
  'SelectVault',
  'DeleteVault',
]);

const enum mutations {
  SetVaultNames = 'SetVaultNames',
  SetSelectedVault = 'SetSelectedVault',
  SetSearchFilter = 'SetSearchFilter',
}

type State = {
  vaultNames: Array<string>;
  selectedVaultName: string;
  searchFilter: string;
};

const state: State = {
  vaultNames: [],
  selectedVaultName: '',
  searchFilter: '',
};

export { actionsExt as actions };

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.NewVault]({ commit }, vaultName: string) {
      await PolykeyClient.NewVault(vaultName);
      const vaultNames = await PolykeyClient.ListVaults();
      commit(mutations.SetVaultNames, vaultNames);
    },

    async [actionsInt.SearchFilter]({ commit }, filter: string) {
      commit(mutations.SetSearchFilter, filter);
    },

    async [actionsInt.LoadVaultNames]({ commit }) {
      const vaultNames = await PolykeyClient.ListVaults();
      commit(mutations.SetVaultNames, vaultNames);
    },

    async [actionsInt.SelectVault]({ commit }, vaultName: string) {
      commit(mutations.SetSelectedVault, vaultName);
    },

    async [actionsInt.DeleteVault]({ commit }, vaultName: string) {
      await PolykeyClient.DeleteVault(vaultName);
      const vaultNames = await PolykeyClient.ListVaults();
      commit(mutations.SetVaultNames, vaultNames);
    },
  },
  mutations: {
    [mutations.SetVaultNames]: function (
      state: State,
      vaultNames: Array<string>,
    ) {
      state.vaultNames = vaultNames;
    },
    [mutations.SetSelectedVault]: function (state: State, vaultName: string) {
      state.selectedVaultName = vaultName;
    },
    [mutations.SetSearchFilter]: function (state: State, filter: string) {
      state.searchFilter = filter;
    },
  },
  getters: {},
};
