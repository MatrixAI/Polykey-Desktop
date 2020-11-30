<template>
  <div class="flex flex-row h-screen justify-center items-center">
    <div class="w-1/2 flex justify-end">
      <IllustrationContratulations />
    </div>
    <div class="w-1/2">
      <div class="flex flex-col">
        <div class="flex flex-col h-70vh justify-center items-center">
          <div>
            <div class="font-bold text-2xl leading-7 tracking-widest mt-2 mb-2">Congratulations</div>
            <div class="text-sm mb-10 w-72">
              <p>
                Keep your recovery code in a backup and don’t share it with others. PolyKey cannot recover your code.
              </p>
            </div>
            <a-form class="w-72" layout="vertical">
              <a-form-item>
                <a-button type="default">
                  ALL DONE
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
import IllustrationContratulations from '@/components/bootstrap/illustrationCongratulations.vue'

export default defineComponent({
  components: {
    IllustrationContratulations
  },
  setup() {
    return {}
  }
})
</script>
