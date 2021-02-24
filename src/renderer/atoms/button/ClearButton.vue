<template>
  <PKButton
    type="default"
    class="
  bg-none
  text-content1
  border-content4
  bg-opacity-10
  rounded-p2
  font-opensans
  text-sm
  hover:text-content1
  focus:bg-content4
  focus:text-content1
  focus:outline-none
  focus:border-bg-primary1"
  >
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData"><slot :name="name" v-bind="slotData"/></template>
  </PKButton>
</template>
<script>
import PKButton from '@/renderer/atoms/button/Button.vue';

export default {
  components: {
    PKButton
  }
};
</script>
