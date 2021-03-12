<template>
  <div :class="['flex flex-col h-full', paultDrawer ? 'block' : 'hidden']">
    <div class="flex flex-row-reverse p-4"><Close @click="close" class="cursor-pointer" /></div>
    <div class="flex-grow p-6">
      <div class="text-2xl font-bold">Pull vaults</div>
      <div>
        Select vaults to pull from this Keynode
      </div>
      <div class="mt-6 flex items-center">
        <Search @input="searchVault" type="large" full />
      </div>
      <div class="mt-2 mb-2 text-sm text-content2">
        Recently Updated
      </div>

      <template v-for="vault in activeVaults" :key="vault">
        <!-- sample content -->
        <div class="flex items-center mt-2">
          <div class="mr-2">
            <!-- <a-checkbox @change="onChange" :checked="vale"></a-checkbox> -->
            <a-checkbox @change="onChange(vault, $event)" :checked="selectedVaults[vault]"></a-checkbox>
          </div>
          <div class="flex items-center">
            <div v-html="icon" class="mr-1 border border-content4"></div>
            <div class="fex flex-col">
              <div class="text-primary1 font-bold opacity-90">{{ vault }}</div>
              <div class="text-sm">pushed by</div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="px-5 py-8 w-full">
      <PrimaryButton full @click="pullVaults">PULL ALL VAULTS</PrimaryButton>
    </div>
  </div>
</template>
<script>
/** Libs */
import PolykeyClient from '@/renderer/resources/client';
import { toSvg } from 'jdenticon';
import { defineComponent, computed, reactive, watchEffect, ref } from 'vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';

/** Components */
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';
import ClearButton from '@/renderer/atoms/button/ClearButton.vue';
import Search from '@/renderer/molecules/search/Search.vue';

/** Assets */
import CheckBox from '@/renderer/assets/checkbox.svg';
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
    Search,
    CheckBox
  },
  setup() {
    const store = useStore();
    const selectedVaults = reactive({});
    const paultDrawer = computed(() => store.state.Gestalt.pullVaultDrawer);
    const activeVaults = ref([]);
    const activeKeynode = computed(() => store.state.Gestalt.activeKeynode);

    const close = () => {
      store.dispatch(actions.PullVaultDrawer, false);
    };

    const searchVault = () => {};

    watchEffect(()=>{
      PolykeyClient.ScanVaultNames(activeKeynode.value)
        .then((vaults) => {
          activeVaults.value = vaults
        })
    });

    return {
      paultDrawer,
      activeVaults,
      close,
      searchVault,
      selectedVaults,
      icon: toSvg('vault', 40),
      onChange(vault, e) {
        selectedVaults[vault] = e.target.checked;
      },
      pullVaults: async () => {
        try {
          const vaults = Object.keys(selectedVaults);
          for (let i = 0; i < vaults.length; ++i) {
            const vault = vaults[i];
            console.log(vault)
            if (selectedVaults[vault]) {
              const result = await PolykeyClient.PullVault({
                publicKey: activeKeynode.value,
                vaultName: vault
              });
              console.log(result)
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
  }
});
</script>
