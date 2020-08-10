<template>
  <v-app-bar app clipped-left color="primary" dense dark>
    <v-app-bar-nav-icon @click.stop="toggleDrawer()">
      <v-icon class="mx-2" fab color="" large>$vuetify.icons.MatrixAIIcon</v-icon>
    </v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <v-toolbar-title class="mr-12 align-center">
      <span class="title">PolyKey</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>fa fa-search</v-icon>
    </v-btn>
    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>fa fa-ellipsis-h</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title>Sync All</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
