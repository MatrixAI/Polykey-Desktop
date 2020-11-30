<template>
  <div class="flex flex-row h-screen justify-center items-center">
    <div class="w-1/2 flex justify-end">
      <Illustration />
    </div>
    <div class="w-1/2">
      <div class="flex flex-col">
        <div class="flex flex-col h-70vh justify-center items-center">
          <div>
            <div class="font-bold text-2xl leading-7 tracking-widest mt-2 mb-2">Recovery Code</div>
            <div class="text-sm mb-10 w-72">
              <p>
                Your account recovery code is used to access your account in the event that you forget your master
                password.
              </p>
              <br />
              <p>Warning: Never disclose your recovery code to anyone.</p>
            </div>
            <a-form class="w-72" layout="vertical">
              <a-form-item>
                <div class="w-72 h-32 border p-6">
                    <p>suit cabbage wrap antenna thank cross crucial flock piece fortune insane survey</p>
                </div>
              </a-form-item>
              <a-form-item>
                <a-button type="default">
                  REMIND ME LATER
                </a-button>
                <a-button class="ml-2" type="default">
                  NEXT
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <div class="flex flex-col h-30vh justify-center items-center">
          <div class="font-roboto text-xs w-72 bg-gray-50 p-5 h-15">
            <div class="overflow-y-auto h-8">
              <p class="opacity-50 -mb-0.5">Initializing...</p>
              <p class="opacity-50 -mb-0.5">Initializing Polykey...</p>
              <p class="opacity-50 -mb-0.5">Intalling Agent...</p>
              <p class="opacity-50 -mb-0.5">Initializing...</p>
              <p class="opacity-50 -mb-0.5">Initializing Polykey...</p>
              <p class="opacity-50 -mb-0.5">Intalling Agent...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Illustration from '@/components/bootstrap/Illustration.vue'
import { FolderOpenOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    Illustration,
    FolderOpenOutlined,
    EyeInvisibleOutlined
  },
  setup() {
    return {}
  }
})
</script>
