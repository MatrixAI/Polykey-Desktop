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
            <Input v-model="password" class="w-full" type="password" v-on:keyup.enter="seal"/>
          </div>
          <div class="font-bold mt-6">
            CONFIRM PASSWORD
          </div>
          <div class="mt-2">
            <Input v-model="confirmPassword" class="w-full" type="password" v-on:keyup.enter="seal"/>
          </div>
          <div v-if="error" class="text-xs text-red-400 mt-1">Passwords dont match</div>
          <div class="mt-4">
            <PrimaryButton @click="seal">SEAL</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
    <console-small />
  </div>
</template>

<script lang="ts">
/** Libs */
import { defineComponent, onMounted, ref } from "vue";
import { useStore } from 'vuex';

/** Components */
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';
import Input from '@/renderer/atoms/input/Input.vue';
import ConsoleSmall from "@/renderer/molecules/console/ConsoleSmall.vue";

/** Store */
import { actions } from '@/renderer/store/modules/Bootstrap';

/** Assets */
import Action from '@/renderer/assets/action.svg';
import Logo from '@/renderer/assets/logo2.svg';
import Helper from '@/renderer/assets/helper.svg';

export default defineComponent({
  components: {
    Logo,
    Action,
    PrimaryButton,
    Helper,
    Input,
    ConsoleSmall,
  },
  setup() {
    const store = useStore();
    const error = ref(false);
    const password = ref('');
    const confirmPassword = ref('');

    onMounted(async () => {
      await store.dispatch(actions.AddEvent, {action: 'Setting up', name: 'keynode'});
    });

    return {
      error,
      password,
      confirmPassword,
      seal: async function() {
        if (password.value == confirmPassword.value) {
          return store.dispatch(actions.BootstrapKeynode, password.value);
        }
        error.value = true;
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
