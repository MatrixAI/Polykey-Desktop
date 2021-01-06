<template>
  <div class="flex flex-row h-screen justify-center items-center">
    <div class="w-1/2 flex justify-end">
      <Illustration />
    </div>
    <div class="w-1/2">
      <div class="flex flex-col">
        <div class="flex flex-col h-70vh justify-center items-center">
          <div>
            <div class="font-bold text-2xl leading-7 tracking-widest mt-2 mb-10">Select A Key Node</div>
            <a-form class="w-72" layout="vertical">
              <a-form-item label="KEYNODE">
                <a-input placeholder="~/.polykey">
                  <template #suffix>
                    <a-button type="default">
                      <template #icon><FolderOpenOutlined /></template>
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item class="-mt-2" label="PASSWORD">
                <a-input type="password" placeholder="Enter Root Key">
                  <template #suffix>
                    <a-button type="default">
                      <template #icon><EyeInvisibleOutlined /></template>
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary">
                  Unseal
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <div class="flex flex-col h-30vh justify-center items-center">
          <Console />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Illustration from '@renderer/components/bootstrap/Illustration.vue'
import Console from '@renderer/molecules/console/Console.vue'
import { FolderOpenOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    Console,
    Illustration,
    FolderOpenOutlined,
    EyeInvisibleOutlined
  },
  setup() {
    return {}
  }
})
</script>
