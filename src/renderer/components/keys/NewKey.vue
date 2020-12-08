<template>
  <ui-form nowrap>
    <h2>New Keynode</h2>
    <ui-form-field>
      <ui-textfield v-model="keyName" placeholder="Enter a new key name"></ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield v-model="keyPassphrase" placeholder="Enter a passphrase to protect the key"></ui-textfield>
    </ui-form-field>
    <br />
    <ui-form-field>
      <ui-button @click="createKey" raised>Create</ui-button>
      <ui-button @click="cancel">Cancel</ui-button>
    </ui-form-field>
  </ui-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import PolykeyClient from '@renderer/resources/PolykeyClient'

export default defineComponent({
  setup() {
    const router = useRouter()
    const keyName = ref('')
    const keyPassphrase = ref('')
    const createKey = async () => {
      const success = await PolykeyClient.DeriveKey({ vaultName: '', keyName: keyName.value, passphrase: keyPassphrase.value })
      console.log(success)
      router.back()
    }
    const cancel = () => {
      router.back()
    }
    return {
      keyName,
      keyPassphrase,
      createKey,
      cancel
    }
  }
})
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@renderer/store';
// import { getConfiguration } from '@renderer/store/modules/Configuration';

// const alert = namespace('Alert');

// const namingRule = name =>
//   /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';

// @Component({
//   name: 'NewSecret',
// })
// export default class NewSecret extends Vue {
//   @alert.Action
//   public toggleAlert!: (props: { visible: boolean; message?: string }) => void;

//   public valid: boolean = false;
//   public keyName = '';
//   public keyNameRules = [namingRule];
//   public keyPassphrase = '';

//   validate(): boolean {
//     return (<any>this.$refs.newKeyForm).validate();
//   }
//   reset() {
//     (<any>this.$refs.newKeyForm).reset();
//   }
//   resetValidation() {
//     this.reset();
//   }
//   async newKey() {
//     if (this.validate()) {
//       const successful = await polykeyClient.deriveKey(
//         this.keyName,
//         this.keyPassphrase,
//       );
//       if (successful) {
//         this.$router.back();
//       }
//     } else {
//       this.toggleAlert({
//         visible: true,
//         message: 'Please check form errors',
//       });
//     }
//   }

//   cancel() {
//     this.$router.back();
//   }
// }
</script>
