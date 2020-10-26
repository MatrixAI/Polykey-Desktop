<template>
  <v-snackbar class="text-xs-center" :value="true">
    This is an alert
    <template v-slot:action="{ attrs }">
      <v-btn color="black" icon v-bind="attrs">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
