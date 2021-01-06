<template>
  <div class="flex flex-row h-screen justify-center items-center">
    <div class="w-1/2 flex justify-end">
      <Illustration />
    </div>
    <div class="w-1/2">
      <div class="flex flex-col">
        <div class="flex flex-col h-80vh justify-center items-center">
          <div>
            <div class="mb-12 flex flex-row items-center">
              <ArrowLeftOutlined /><span class="font-bold ml-3">Go Back</span>
            </div>
            <div class="font-bold text-2xl leading-7 tracking-widest mt-2 mb-2">Confirm Code</div>
            <div class="text-sm mb-5 w-72">
              <p>
                Please select words to complete the phrase that matches your recovery code.
              </p>
            </div>
            <a-form class="w-72" layout="vertical">
              <a-form-item>
                <div class="w-72 h-32 border p-2">
                  <a-tag class="rounded-full p-1 px-2" :visible="visible" closable>
                    Movies
                  </a-tag>
                  <a-tag class="rounded-full p-1 px-2" :visible="visible" closable>
                    Cabbage
                  </a-tag>
                </div>
              </a-form-item>
              <a-form-item>
                <div class="w-72h h-12 mb-2">
                  <a-tag class="rounded-full p-1 px-2 mb-2" :visible="visible">
                    Movies
                  </a-tag>
                  <a-tag class="rounded-full p-1 px-2 mb-2" :visible="visible">
                    Cabbage
                  </a-tag>
                  <a-tag class="rounded-full p-1 px-2 mb-2" :visible="visible">
                    Suit
                  </a-tag>
                  <a-tag class="rounded-full p-1 px-2 mb-2" :visible="visible">
                    Apple
                  </a-tag>
                  <a-tag class="rounded-full p-1 px-2 mb-2" :visible="visible">
                    Run
                  </a-tag>
                  <a-tag class="rounded-full p-1 px-2 mb-2" :visible="visible">
                    Sprint
                  </a-tag>
                  <a-tag class="rounded-full p-1 px-2 mb-2" :visible="visible">
                    Jump
                  </a-tag>
                </div>
              </a-form-item>
              <a-form-item>
                <a-button type="default">
                  CONFIRM
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <div class="flex flex-col h-20vh justify-center items-center">
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
import Illustration from '@renderer/components/bootstrap/Illustration.vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    Illustration,
    ArrowLeftOutlined
  },
  setup() {
    return {}
  }
})
</script>
