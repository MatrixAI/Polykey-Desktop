<template>
  <ul class="list-none text-sm">
    <!-- Active -->
    <li
      class="float-left h-header px-2 flex items-center cursor-pointer border-b-2 border-primary1 bg-opacity-5 font-bold bg-content2 text-content1"
      @click="goto('/vaults')"
    >
      <div>Vaults</div>
    </li>
    <li class="float-left h-header px-2 flex items-center cursor-pointer text-content2"><div>Sharing</div></li>
    <li class="float-left h-header px-2 flex items-center cursor-pointer text-content2"><div>Identities</div></li>
    <li class="float-left h-header px-2 flex items-center cursor-pointer text-content2"><div>Keynodes</div></li>
  </ul>
</template>
<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    return {
      goto: path => {
        router.replace(path);
      }
    };
  }
});
</script>
