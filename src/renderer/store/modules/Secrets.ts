import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';
import * as pb from '@matrixai/polykey/dist/proto/js/Agent_pb';
import FileSaver from 'file-saver';

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
      const secret = await PolykeyClient.GetSecret({ vaultName, secretName });
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
          vaultName: state.selectedVaultName,
          secretName,
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
        secretPath: {
          vaultName: state.selectedVaultName,
          secretName,
        },
        secretContent: secretContent,
        secretFilePath: '',
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
        vaultName: state.selectedVaultName,
        secretName,
      });
    },
    async [actionsInt.NewSecret](
      { dispatch, commit },
      secret: pb.SecretContentMessage.AsObject,
    ) {
      /** Add error checking here */
      await PolykeyClient.NewSecret(secret);

      /** dispatch and reload the page */
      commit(mutations.SetUploadCount);
      dispatch(actionsInt.LoadSecretNames, secret.secretPath!.vaultName);
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
