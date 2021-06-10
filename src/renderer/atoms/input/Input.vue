<template>
  <input v-model="data" class="h-large-input rounded-md bg-grey2 border border-content4 px-2" />
</template>
<script>
export default {
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    // this allows using the `value` prop for a different purpose
    value: String,
    // use `title` as the prop which take the place of `value`
    data: {
      type: String
    }
  }
};
</script>
