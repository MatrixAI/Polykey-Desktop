"use strict";
exports.__esModule = true;
var vuex_1 = require("vuex");
var Alert_1 = require("@/store/modules/Alert");
var Configuration_1 = require("@/store/modules/Configuration");
var ConfirmationDialog_1 = require("@/store/modules/ConfirmationDialog");
var Drawer_1 = require("@/store/modules/Drawer");
var Keys_1 = require("@/store/modules/Keys");
var Peers_1 = require("@/store/modules/Peers");
var Secrets_1 = require("@/store/modules/Secrets");
var Vaults_1 = require("@/store/modules/Vaults");
var User_1 = require("@/store/modules/User");
exports["default"] = vuex_1.createStore({
    modules: {
        Alert: Alert_1["default"],
        Configuration: Configuration_1["default"],
        ConfigurationDialog: ConfirmationDialog_1["default"],
        Drawer: Drawer_1["default"],
        Keys: Keys_1["default"],
        Peers: Peers_1["default"],
        Secrets: Secrets_1["default"],
        Vaults: Vaults_1["default"],
        User: User_1["default"]
    }
});
// PolykeyClient.NewNode(<any>{
//   userid: 'robdog',
//   passphrase: 'passphrase',
// })
//   .then(async b => {
//     console.log('heyyyy1');
//     console.log(b);
//     console.log(await PolykeyClient.NewVault('heyy'));
//     console.log(await PolykeyClient.ListVaults());
//   })
//   .catch(e => {
//     console.log('heyyyy2');
//     console.log(e);
//   });
// PolykeyClient.StartAgent()
//   .then(async (b) => {
//     console.log('heyyyy1');
//     console.log(b)
//   })
//   .catch(e => {
//     console.log('heyyyy2');
//     console.log(e);
//   });
