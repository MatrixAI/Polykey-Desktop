<template>
  <!-- Controls -->
  <div class="flex justify-between align-middle items-center mt-5">
    <div>
      <ul class="list-none text-sm">
        <li class="float-left cursor-pointer font-bold text-primary1 border-r border-content2 border-opacity-10 pr-3">
          My Vaults
        </li>
        <li class="float-left cursor-pointer text-content2 pl-3">Shared with Me</li>
      </ul>
    </div>
    <div class="flex">
      <div class="pr-2"><Search type="large" /></div>
      <div class="pr-2"><Input /></div>
      <div><PrimaryButton>+ CREATE VAULT</PrimaryButton></div>
    </div>
  </div>
</template>
<script>
import Search from '@/renderer/molecules/search/Search.vue'
import Input from '@/renderer/atoms/input/Input.vue'
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Search,
    Input,
    PrimaryButton
  }
})
</script>
