"use strict";
exports.__esModule = true;
var vuex_1 = require("vuex");
exports["default"] = (function (module) {
    var store = vuex_1.useStore();
    return {
        state: store.state[module],
        dispatch: function (action, params) {
            store.dispatch(module + "/" + action, params);
        }
    };
});
