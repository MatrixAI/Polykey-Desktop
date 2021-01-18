<template>
  <PKButton
    type="default"
    class="
  bg-primary1
  text-grey1
  border-primary1b
  rounded-p2
  font-opensans
  text-sm
  hover:bg-primary1b
  hover:text-grey1
  hover:border-white
  focus:bg-primary1b
  focus:text-grey1
  focus:outline-none
  focus:border-bg-primary1
  focus:border-white"
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
