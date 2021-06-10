<template>
  <div :class="['flex flex-col h-full', showDrawer ? 'block' : 'hidden']">
    <div class="flex flex-row-reverse p-4">
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div class="flex-grow p-6">
      <div class="text-2xl font-bold">Add A Keynode</div>
      <div>
        You can either add a Keynode by pasting the public key of a keynode or
        adding through a digital identity proof.
      </div>
      <div class="mt-4 flex items-center">
        <div class="font-bold text-base">PUBLIC KEY</div>
        <div><Help /></div>
      </div>
      <div class="mt-2">
        <a-textarea
          class="rounded"
          placeholder="Paste public key"
          @input="updatePublicKey"
        />
      </div>
      <div class="mt-6 font-bold text-base">OR ADD THROUGH</div>
      <div class="flex mt-2">
        <div>
          <a-select
            class="rounded mr-3"
            label-in-value
            :default-value="{ key: 'github' }"
            style="width: 120px"
            @change="handleChange"
          >
            <!--            <a-select-option value="github"> Github </a-select-option>FIXME-->
            <!-- <a-select-option value="linked">
              Linked
            </a-select-option> -->
          </a-select>
        </div>
        <div>
          <a-input
            class="rounded"
            placeholder="Enter username"
            @input="updateUsername"
          />
        </div>
      </div>
      <div class="mt-8 flex flex-row">
        <div class="mr-3"><ClearButton @click="close">CANCEL</ClearButton></div>
        <div><PrimaryButton @click="trust">TRUST IDENTITY</PrimaryButton></div>
      </div>
    </div>
    <div class="px-5 py-8">
      Once a keynode trusts you, you should be able to pull secrets from their
      vaults quickly and easily.
    </div>
  </div>
</template>
<script>
/** Libs */
import PolykeyClient from '@/renderer/resources/client';
import { toSvg } from 'jdenticon';
import { defineComponent, computed, ref } from 'vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';

/** Components */
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';
import ClearButton from '@/renderer/atoms/button/ClearButton.vue';

/** Assets */
import Close from '@/renderer/assets/close.svg';
import Help from '@/renderer/assets/help.svg';

/** Store */
import { actions } from '@/renderer/store/modules/Gestalt';

export default defineComponent({
  components: {
    Close,
    Help,
    ClearButton,
    PrimaryButton,
    MoreOutlined,
  },
  setup() {
    const publicKey = ref('');
    const username = ref('');
    const provider = ref('github');
    const store = useStore();
    const showDrawer = computed(() => store.state.Gestalt.addKeynodeDrawer);

    const close = () => {
      store.dispatch(actions.ToggleAddKeyNode, false);
    };

    return {
      publicKey,
      username,
      showDrawer,
      close,
      updatePublicKey: (event) => {
        publicKey.value = event.target.value;
      },
      updateUsername: (event) => {
        username.value = event.target.value;
      },
      trust: async () => {
        try {
          if (username.value) {
            const trust = await PolykeyClient.TrustGestalt({
              s: username.value,
            });
            console.log(trust);
          }
        } catch (e) {
          console.log(e);
        }
      },
      handleChange: () => {},
    };
  },
});
</script>
