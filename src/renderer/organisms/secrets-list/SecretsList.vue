<template>
  <div class="mt-3 border-dashed">
    <div class="flex bg-grey6 font-bold text-content2 py-3 px-3">
      <div class="w-1/12"><CheckBox /></div>
      <div class="w-6/12">File</div>
      <div class="w-2/12">Type</div>
      <div class="w-2/12">Date Created</div>
      <div class="w-1/12 text-right">Actions</div>
    </div>

    <!-- Sample Content -->
    <div v-for="secret in secretsList" class="flex py-4 pl-3 border-b border-content4 border-opacity-50">
      <div class="w-1/12 flex items-center"><CheckBox /></div>
      <div class="w-6/12 flex">
        <div class="flex items-center">
          <File />
        </div>
        <div class="flex flex-col cursor-pointer ml-2">
          <div class="text-primary1 font-bold opacity-90 mr-3">{{ secret.name }}</div>
          <div class="text-content1 text-xxs flex">
            <div class="font-bold">You&nbsp;</div>
            <div>commited 3 days</div>
          </div>
        </div>
      </div>
      <div class="w-2/12 flex items-center">Secret</div>
      <div class="w-2/12 flex items-center">25/11/2020 11:30AM</div>
      <div class="w-1/12 flex flex-row justify-end items-center">
        <Download class="mr-2" />
        <More />
      </div>
    </div>

    <div>Pagination</div>
  </div>
</template>
<script>
/** Libs */
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { defineComponent, ref, watchEffect, onMounted } from 'vue';

/** Components */
import Control from '@/renderer/organisms/controls/Controls.vue';

/** Store */
import { actions } from '@renderer/store/modules/Secrets';

/** Assets */
import CheckBox from '@/renderer/assets/checkbox.svg';
import Download from '@/renderer/assets/download.svg';
import More from '@/renderer/assets/more.svg';
import File from '@/renderer/assets/file1.svg';

export default defineComponent({
  components: {
    CheckBox,
    Download,
    More,
    File
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const secretsList = ref([]);

    watchEffect(() => {
      const secrets = store.state.Secrets.secretNames;
      secretsList.value = Object.keys(secrets).map(key => {
        return {
          name: secrets[key]
        };
      });
    });

    onMounted(() => {
      store.dispatch(actions.LoadSecretNames, router.currentRoute.value.params.id);
    });

    return {
      secretsList
    };
  }
});
</script>
