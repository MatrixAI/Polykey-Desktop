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
          <div class="text-xl font-bold -mt-8">Select A Key Node</div>
          <div class="flex items-center">
            <div>
              Select a Key Node to what is the purpose of this, expound <br />
              here.
            </div>
          </div>
          <div class="font-bold mt-8">
            KEYNODE
          </div>
          <div class="mt-2">
            <Input class="w-full" type="input" placeholder="~/.polykey" />
          </div>
          <div class="font-bold mt-6">
            CONFIRM PASSWORD
          </div>
          <div class="mt-2">
            <Input v-model="password" class="w-full" type="password" />
          </div>
          <div class="mt-4">
            <PrimaryButton @click="unseal">UNSEAL</PrimaryButton>
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
import Input from '@/renderer/atoms/input/Input.vue';
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';

/** Store */
import { actions } from '@/renderer/store/modules/Nodes';

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
    Input
  },
  setup() {
    const store = useStore();
    const password = ref('');

    return {
      password,
      unseal: async function() {
        store.dispatch(actions.UnlockKeyNode, password.value);
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
