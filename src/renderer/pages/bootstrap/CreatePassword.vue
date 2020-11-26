<template>
  <div class="flex flex-row h-screen justify-center items-center">
    <div class="w-1/2 flex justify-end">
      <Illustration />
    </div>
    <div class="w-1/2">
      <div class="flex flex-col">
        <div class="flex flex-col h-70vh justify-center items-center">
          <div>
            <div class="font-bold text-2xl leading-7 tracking-widest mt-2">Create Password</div>
            <div class="text-sm opacity-50 mb-10">Create password for Root Key Pair</div>
            <a-form class="w-72" layout="vertical">
              <a-form-item class="-mt-2" label="PASSWORD">
                <a-input type="password" placeholder="Enter password">
                  <template #suffix>
                    <a-button type="default">
                      <template #icon><EyeInvisibleOutlined /></template>
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item class="-mt-2" label="CONFIRM PASSWORD">
                <a-input type="password" placeholder="Confirm password">
                  <template #suffix>
                    <a-button type="default">
                      <template #icon><EyeInvisibleOutlined /></template>
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary">
                  Seal
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
import { EyeInvisibleOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    Illustration,
    EyeInvisibleOutlined
  },
  setup() {
    return {}
  }
})
</script>
