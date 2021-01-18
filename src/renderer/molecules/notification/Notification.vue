<template>
  <div class="relative">
    <Bell />
  </div>
</template>
<script>
import Bell from '@renderer/assets/bell.svg';
import Badge from '@renderer/assets/badge.svg';

import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    Bell,
    Badge
  }
});
</script>
