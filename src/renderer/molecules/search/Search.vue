<template>
  <div :class="['relative', full ? 'w-full' : '']">
    <div :class="iconClass"><Search /></div>
    <input :class="[inputClass, full ? 'w-full' : '']" placeholder="Search" />
  </div>
</template>
<script>
import Search from '@renderer/assets/magnify.svg';
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    type: {
      type: String,
      required: false
    },
    full: {
      type : Boolean
    }
  },
  data(props) {
    let defaultStyle = 'rounded-md bg-grey2 border border-content4 pl-8 pr-2';
    let defaultIconStyle = 'absolute top-0 ml-2';

    let height = 'h-search';
    let iconMargin = 'mt-1';

    if (this.type && this.type == 'large') {
      height = 'h-large-input';
      iconMargin = 'mt-2';
    }

    return {
      full : props.full,
      inputClass: `${defaultStyle} ${height}`,
      iconClass: `${defaultIconStyle} ${iconMargin}`
    };
  },
  components: {
    Search
  }
});
</script>
