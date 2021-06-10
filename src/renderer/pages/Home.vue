<template>
  <div>
    <p>Home of the Demo</p>
    {{ comment }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { actions } from '@/renderer/store/comments';

export default defineComponent({
  setup() {
    const store = useStore();
    onMounted(async () => {
      await store.dispatch(actions.FetchComment, { id: 1 });
    });
    const comment = computed(() => {
      return store.state.comments.comments[1];
    });
    return {
      comment,
    };
  },
});
</script>
