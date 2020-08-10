<template>
  <v-container>
    <v-row>
      <v-btn class="mx-2" fab dark small :color="color" @click="goToRoute()">
        <v-icon dark>{{faIcon}}</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>
