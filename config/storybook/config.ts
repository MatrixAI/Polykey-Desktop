/* eslint-disable import/no-extraneous-dependencies */
import { configure, addDecorator } from "@storybook/vue";
import vuetify from "../../src/renderer/plugins/vuetify";

// import "@mdi/font/css/materialdesignicons.css";

// Ensures every story is wrapped in a v-app tag
addDecorator(() => ({
  vuetify: vuetify,
  template: '<v-app><v-main><story/></v-main></v-app>',
}))

const req = require.context("../../src/renderer/stories", true, /.*stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
