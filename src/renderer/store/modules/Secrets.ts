import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import FileSaver from 'file-saver';
import { clientPB } from '@matrixai/polykey/src/client';
import content from "*.svg";

const [actionsInt, actionsExt] = makeIdentifiers('Secrets', [
  'LoadSecretNames',
  'NewSecret',
  'GetSecret',
  'SelectSecret',
  'UpdateSecret',
  'DeleteSecret',
]);

const enum mutations {
  SetSecretNames = 'SetSecretNames',
  SetSelectedSecret = 'SetSelectedSecret',
  SetUploadCount = 'SetUploadCount',
}

type State = {
  selectedVaultName: string;
  selectedSecretName: string;
  selectedSecretContent: string;
  secretNames: Array<string>;
  uploadCount: number;
};

const state: State = {
  selectedVaultName: '',
  selectedSecretName: '',
  selectedSecretContent: '',
  secretNames: [],
  uploadCount: 0,
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
    async [actionsInt.GetSecret](
      { commit },
      { secretName = '', vaultName = '', copy = false },
    ) {
      const secret = await PolykeyClient.GetSecret({
      vault: {name: vaultName, id: ''}, //TODO, need to switch this to using IDs not names.
        name: secretName,
      });
      if (copy) {
        navigator.clipboard.writeText(secret).then(
          function () {
            console.log('Async: Copying to clipboard was successful!');
          },
          function (err) {
            console.error('Async: Could not copy text: ', err);
          },
        );
        return;
      }
      const file = new File([secret], secretName, {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(file);
    },
    async [actionsInt.SelectSecret]({ commit, state }, secretName?: string) {
      if (secretName) {
        const secretContent = await PolykeyClient.GetSecret({
          vault: { name: state.selectedVaultName, id: '' },
          name: secretName,
        });
        commit(mutations.SetSelectedSecret, { secretName, secretContent });
      } else {
        commit(mutations.SetSelectedSecret, {
          secretName: '',
          secretContent: '',
        });
      }
    },
    async [actionsInt.UpdateSecret](
      { commit, state },
      {
        secretName,
        secretContent,
      }: { secretName: string; secretContent: string },
    ) {
      const successful = await PolykeyClient.UpdateSecret({
          vault: {
            vault: {name: state.selectedVaultName, id: ''},
            name: secretName,
          },
          content: secretContent,
        });
      if (successful !== null || successful !== undefined) {
        commit(mutations.SetSelectedSecret, {
          secretName: secretName,
          secretContent: secretContent,
        });
      }
    },
    async [actionsInt.DeleteSecret]({ state }, secretName: string) {
      await PolykeyClient.DeleteSecret({
        vault: { name: state.selectedVaultName, id: '' },
        name: secretName,
      });
    },
    async [actionsInt.NewSecret](
      { dispatch, commit },
      secret: clientPB.VaultSpecificMessage.AsObject,
    ) {
      /** Add error checking here */
      await PolykeyClient.NewSecret(secret);

      /** dispatch and reload the page */
      if(secret.vault){
        commit(mutations.SetUploadCount);
        dispatch(actionsInt.LoadSecretNames, secret.vault.name);
      } else throw new Error("Undefined property vault");
    },
  },
  mutations: {
    [mutations.SetSecretNames]: function (
      state,
      { vaultName, secretNames }: { vaultName: string; secretNames: string[] },
    ) {
      state.selectedVaultName = vaultName;
      state.secretNames = secretNames;
    },
    [mutations.SetSelectedSecret]: function (
      state,
      {
        secretName,
        secretContent,
      }: { secretName: string; secretContent: string },
    ) {
      state.selectedSecretName = secretName;
      state.selectedSecretContent = secretContent;
    },
    [mutations.SetUploadCount]: function (state) {
      state.uploadCount = ++state.uploadCount;
    },
  },
  getters: {},
};
