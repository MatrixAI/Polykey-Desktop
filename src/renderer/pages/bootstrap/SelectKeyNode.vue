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
                    <Button type="default">
                      <template #icon><FolderOpenOutlined /></template>
                    </Button>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <Button type="danger">
                  Create
                </Button>
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
import Button from '@renderer/atoms/button/Button.vue'
import Illustration from '@renderer/components/bootstrap/Illustration.vue'
import { FolderOpenOutlined } from '@ant-design/icons-vue'
import Console from '@renderer/molecules/console/Console.vue'

export default defineComponent({
  components: {
    Button,
    Console,
    Illustration,
    FolderOpenOutlined
  },
  setup() {
    return {}
  }
})
</script>
