<template>
  <div class="flex px-5">
    <!-- div class="w-3/4" -->
    <div class="w-full">
      <Control />
      <div class="h-body">
        <div class="mt-8">
          <div class="flex items-center">
            <VaultIcon />
            <div class="text-content1 text-lg font-bold ml-1">{{ vault }}</div>
          </div>
          <div>
            <Filter />
            <SecretsList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/** Libs */
import { useRouter } from 'vue-router';
import { defineComponent, ref, watchEffect } from 'vue';

/** Components */
import Control from '@/renderer/organisms/controls/Controls.vue';
import Filter from '@/renderer/molecules/filters/Filter.vue';
import SecretsList from '@/renderer/organisms/secrets-list/SecretsList.vue';

/** Assets */
import VaultIcon from '@/renderer/assets/vault.svg';

export default defineComponent({
  components: {
    Control,
    Filter,
    VaultIcon,
    SecretsList
  },
  setup() {
    const router = useRouter();

    /** local state */
    const vault = ref('');

    /** Listen
     * 1. Every time the route changes check the param
     * 2. Currently we get the name of the vault from the parameter
     */
    watchEffect(() => {
      const id = router.currentRoute.value.params.id;
      vault.value = id;
    });

    return {
      vault
    };
  }
});
</script>
<style scoped>
.h-body {
  height: calc(100vh - 42px - 100px);
}
</style>
