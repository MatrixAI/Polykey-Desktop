<template>
  <div>
    <Header />
    <h1>💖 Hello World!</h1>
    <p>Welcome to TypeScript-Demo-Electron application.</p>
    <button @click="increment(1)">Clicked {{ count }} times.</button>
    <router-view class="content" />
    <Footer />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Config } from '@/renderer/config';

import { defineComponent, ref } from 'vue';
import Header from '@/renderer/components/Header.vue';
import Footer from '@/renderer/components/Footer.vue';

export default defineComponent({
  components: {
    Header,
    Footer,
  },
  props: {
    config: {
      type: Object as PropType<Config>,
      required: true,
    },
  },
  setup(props) {
    console.log('Root Config', props.config);
    const count = ref(0);
    const increment = (amount: number) => {
      count.value += amount;
    };
    return {
      count,
      increment,
    };
  },
});
</script>

<style scoped>
.content {
  margin: 10px;
}
</style>
