<template>
  <div class="flex flex-col">
    <div class="flex flex-col h-70vh justify-center items-center">
      <div>
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="29.5" cy="29.5" r="21.5" stroke="url(#paint0_angular)" stroke-width="14.6383" />
          <defs>
            <radialGradient
              id="paint0_angular"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(29.5 29.5) scale(21.5)"
            >
              <stop stop-color="white" />
              <stop offset="1" stop-color="#C6C6C6" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div class="font-nunito font-bold text-2xl leading-7 tracking-widest my-2">POLYKEY</div>
      <div class="font-nunito opacity-40 text-sm">A one-liner descriptor about the app</div>
    </div>
    <div class="flex flex-col h-30vh justify-center items-center">
      <Console />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Console from '@renderer/molecules/console/Console.vue'

export default defineComponent({
  components: {
    // Logo
    Console
  },
  setup() {
    console.log('awdawd')
    // console.log(Logo)
    return {}
  }
})
</script>
