<template>
  <a-button v-bind="attributes">
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData"><slot :name="name" v-bind="slotData"/></template>
  </a-button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    const attributes = {
      type: this.type
    };
    return {
      attributes
    };
  }
};
</script>
