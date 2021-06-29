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
    <console-small />
  </div>
</template>

<script lang="ts">
/** Libs */
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

/** Components */
import Input from '@/renderer/atoms/input/Input.vue';
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';
import ConsoleSmall from "@/renderer/molecules/console/ConsoleSmall.vue";

/** Store */
// import { actions } from '@/renderer/store/modules/Nodes';
import { actions, STATUS } from '@/renderer/store/modules/Agent';

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
    const password = ref('');

    return {
      password,
      unseal: async function() {
        console.warn("Warning, not actually starting a sesson yet.");
        store.commit('Agent/SetPassword', password);
        await store.dispatch(actions.StartAgent);
        await store.dispatch(actions.SetStatus, STATUS.ONLINE);
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
