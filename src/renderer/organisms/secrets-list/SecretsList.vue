<template>
  <div class="mt-3">
    <div class="flex bg-grey6 font-bold text-content2 py-3 px-3">
      <div class="w-1/12"><CheckBox /></div>
      <div class="w-6/12">File</div>
      <div class="w-2/12">Type</div>
      <div class="w-2/12">Date Created</div>
      <div class="w-1/12 text-right">Actions</div>
    </div>

    <div
      v-bind:class="[dragging ? draggingClass : defaultContainerClass]"
      @drop="drop"
      @dragover="dragover"
      @dragleave="dragleave"
    >
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
          <Download class="mr-2 cursor-pointer" @click="download(secret.name)" />
          <Copy class="mr-2 cursor-pointer" @click="copy(secret.name)"/>
          <More />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/** Libs */
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { defineComponent, ref, watchEffect, onMounted, watch } from 'vue';

/** Store */
import { actions } from '@renderer/store/modules/Secrets';

/** Assets */
import CheckBox from '@/renderer/assets/checkbox.svg';
import Download from '@/renderer/assets/download.svg';
import More from '@/renderer/assets/more.svg';
import File from '@/renderer/assets/file1.svg';
import Copy from '@/renderer/assets/copy.svg';

export default defineComponent({
  components: {
    CheckBox,
    Download,
    More,
    File,
    Copy
  },
  setup(props, context) {
    const defaultContainerClass = 'secrets-container';
    const draggingClass = `${defaultContainerClass} border-dashed border-2 border-gray-900 border-opacity-20`;
    const store = useStore();
    const router = useRouter();

    const dragging = ref(false);
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
      defaultContainerClass,
      draggingClass,
      dragging,
      secretsList,
      download(secretName) {
        store.dispatch(actions.GetSecret, {
          vaultName: router.currentRoute.value.params.id,
          secretName
        });
      },
      copy(secretName) {
        store.dispatch(actions.GetSecret, {
          vaultName: router.currentRoute.value.params.id,
          secretName,
          copy: true
        });
        this.$notification['info']({
            message: 'Copying secret',
            description: `Copied secret ${secretName}`
          });
      },
      dragover(event) {
        event.preventDefault();
        dragging.value = true;
      },
      dragleave() {
        dragging.value = false;
      },
      drop(event) {
        console.log(this)
        event.preventDefault();
        dragging.value = false;
        for (let i = 0; i < event.dataTransfer.files.length; ++i) {
          let file = event.dataTransfer.files[i];
          store.dispatch(actions.NewSecret, {
            secretPath: {
              vaultName: router.currentRoute.value.params.id,
              secretName: file.name
            },
            secretFilePath: file.path
          });
          this.$notification['success']({
            message: 'Done uploading secret',
            description: 'Encrypting secret'
          });
        }
      }
    };
  }
});
</script>

<style scoped>
.secrets-container {
  height: calc(100vh - 300px);
  overflow-y: auto;
}
</style>
