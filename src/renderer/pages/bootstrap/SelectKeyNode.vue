<template>
  <div class="flex h-screen">
    <div class="w-2/3 flex flex-col">
      <div class="flex m-5 h-action w-12 justify-between">
        <Action />
        <Action />
        <Action />
      </div>
      <div class="h-body flex flex-col justify-center items-center">
        <div>
          <div class="text-xl font-bold -mt-8">Create Password</div>
          <div class="flex items-center">
            <div>Create password for &nbsp;</div>
            <div class="font-bold text-primary1">Root Key Pair &nbsp;</div>
            <div><Helper /></div>
          </div>
          <div class="font-bold mt-8">
            PASSWORD
          </div>
          <div class="mt-2">
            <Input v-model="password" class="w-full" type="password" />
          </div>
          <div class="font-bold mt-6">
            CONFIRM PASSWORD
          </div>
          <div class="mt-2">
            <Input v-model="confirmPassword" class="w-full" type="password" />
          </div>
          <div class="mt-4">
            <PrimaryButton @click="seal">SEAL</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/3 flex flex-col items-center bg-grey7 p-8">
      <div class="mt-5 mb-8"><Logo /></div>
      <div class="bg-grey8 bg-opacity-10 w-full p-5 text-primary4 text-xs font-robotomono">
        <p>Installing <span>Agent...</span></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/** Libs */
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

/** Components */
import PrimaryButton from '@renderer/atoms/button/PrimaryButton.vue';
import Input from '@renderer/atoms/input/Input.vue';

/** Store */
import { STATUS, actions } from '@renderer/store/modules/User';

/** Assets */
import Action from '@renderer/assets/action.svg';
import Logo from '@renderer/assets/logo2.svg';
import Helper from '@renderer/assets/helper.svg';

export default defineComponent({
  components: {
    Logo,
    Action,
    PrimaryButton,
    Helper,
    Input
  },
  setup() {
    const store = useStore();
    const password = ref('');
    const confirmPassword = ref('');

    return {
      password,
      confirmPassword,
      seal: async function() {
        if (password.value == confirmPassword.value) {
          store.dispatch(actions.CreateNewNode, {
            userid: 'polykey',
            passphrase: password.value
          });
        }
      }
    };
  }
});
</script>

<style scoped>
.h-body {
  height: calc(100vh - 12px);
}
</style>
