<template>
  <v-navigation-drawer
    v-model="toggleDrawerVModel"
    mobile-breakpoint="0"
    app
    clipped
    mini-variant
    color="primary"
  >
    <NavigationButton faIcon="fas fa-lock" route="Vaults" />
    <NavigationButton faIcon="fas fa-users" route="Social" />
    <NavigationButton faIcon="fas fa-key" route="Keys" />
    <NavigationButton faIcon="fas fa-share-alt-square" route="Sharing" />
    <template v-slot:append>
      <NavigationButton faIcon="fas fa-cogs" route="Configuration" />
    </template>
  </v-navigation-drawer>
</template>
