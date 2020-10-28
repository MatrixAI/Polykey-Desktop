<template>
  <v-snackbar timeout="2000" v-model="snackbar" :color="color" class="text-xs-center">
    {{message}}
    <template v-slot:action="{ attrs }">
      <v-btn color="black" icon v-bind="attrs" @click="snackbar = false">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const visible = ref(false)
    const snackbar = () => {
      visible.value = !visible.value
    }

    return {
      visible,
      snackbar
    }
  }
})
</script>

<style scoped>
</style>
