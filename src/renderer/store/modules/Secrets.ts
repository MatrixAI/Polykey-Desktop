import PolykeyClient from '@renderer/resources/client';
import { makeIdentifiers } from '@renderer/store/utils';

const [actionsInt, actionsExt] = makeIdentifiers('Secrets', [
  'LoadSecretNames',
  'SelectSecret',
  'UpdateSecret',
  'DeleteSecret'
]);

const enum mutations {
  SetSecretNames = 'SetSecretNames',
  SetSelectedSecret = 'SetSelectedSecret'
}

type State = {
  selectedVaultName: string;
  selectedSecretName: string;
  selectedSecretContent: string;
  secretNames: Array<string>;
};

const state: State = {
  selectedVaultName: '',
  selectedSecretName: '',
  selectedSecretContent: '',
  secretNames: []
};

export { actionsExt as actions };

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.LoadSecretNames]({ commit }, vaultName: string) {
      const secretNames = await PolykeyClient.ListSecrets(vaultName);
      commit(mutations.SetSecretNames, { vaultName, secretNames });
    },
    async [actionsInt.SelectSecret]({ commit, state }, secretName?: string) {
      if (secretName) {
        const secretContent = await PolykeyClient.GetSecret({ vaultName: state.selectedVaultName, secretName });
        commit(mutations.SetSelectedSecret, { secretName, secretContent });
      } else {
        commit(mutations.SetSelectedSecret, { secretName: '', secretContent: '' });
      }
    },
    async [actionsInt.UpdateSecret](
      { commit, state },
      { secretName, secretContent }: { secretName: string; secretContent: string }
    ) {
      const successful = await PolykeyClient.UpdateSecret({
        secretPath: {
          vaultName: state.selectedVaultName,
          secretName
        },
        secretContent: secretContent,
        secretFilePath: ''
      });
      if (successful) {
        commit(mutations.SetSelectedSecret, { secretName: secretName, secretContent: secretContent });
      }
    },
    async [actionsInt.DeleteSecret]({ state }, secretName: string) {
      await PolykeyClient.DeleteSecret({
        vaultName: state.selectedVaultName,
        secretName
      });
    }
  },
  mutations: {
    [mutations.SetSecretNames]: function(
      state,
      { vaultName, secretNames }: { vaultName: string; secretNames: string[] }
    ) {
      state.selectedVaultName = vaultName;
      state.secretNames = secretNames;
    },
    [mutations.SetSelectedSecret]: function(
      state,
      { secretName, secretContent }: { secretName: string; secretContent: string }
    ) {
      state.selectedSecretName = secretName;
      state.selectedSecretContent = secretContent;
    }
  },
  getters: {}
};
