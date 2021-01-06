<template>
  <div class="flex items-center mr-1">
    <!-- This will be derived from public key -->
    <div v-html="identity" class="mr-1 rounded-md border border-content4"></div>
    <CarretDown class="cursor-pointer"/>
  </div>
</template>
<script>
import { toSvg } from 'jdenticon'
import CarretDown from '@renderer/assets/carret-down.svg'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    CarretDown
  },
  setup() {
    return {
      identity: toSvg('Polykey', 29)
    }
  }
})
</script>
