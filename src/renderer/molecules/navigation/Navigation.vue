<template>
  <ul class="list-none text-sm">
    <!-- Active -->
    <li :class="[ 'float-left h-header px-2 flex items-center cursor-pointer', path.match(/vaults|sharing/) ? active : inactive]" @click="goto('/vaults')">
      <div>Vaults</div>
    </li>
    <li :class="[ 'float-left h-header px-2 flex items-center cursor-pointer', path == '/identities' ? active : inactive]" @click="goto('/identities')">
      <div>Identities</div>
    </li>
  </ul>
</template>
<script>
import { defineComponent, watch, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const path = ref(router.currentRoute.value.path);
    const active = 'border-b-2 border-primary1 bg-opacity-5 font-bold bg-content2 text-content1';
    const inactive = 'text-content2';

    watch(
      () => route.path,
      async newPath => {
        path.value = newPath;
      }
    );

    return {
      path,
      active,
      inactive,
      goto: path => {
        router.replace(path);
      }
    };
  }
});
</script>
