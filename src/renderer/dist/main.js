"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var App_vue_1 = require("@/App.vue");
var router_1 = require("@/router");
var store_1 = require("@/store");
var balm_ui_1 = require("balm-ui");
var balm_ui_plus_1 = require("balm-ui/dist/balm-ui-plus");
require("balm-ui/dist/balm-ui.css");
require("../index.css");
vue_1.createApp(App_vue_1["default"])
    .use(balm_ui_1["default"])
    .use(balm_ui_plus_1["default"])
    .use(store_1["default"])
    .use(router_1["default"])
    .mount('#app');
