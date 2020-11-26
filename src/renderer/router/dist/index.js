"use strict";
exports.__esModule = true;
var vue_router_1 = require("vue-router");
var Vaults_vue_1 = require("@/components/vaults/Vaults.vue");
var NewVault_vue_1 = require("@/components/vaults/NewVault.vue");
var NewSecret_vue_1 = require("@/components/vaults/secrets/NewSecret.vue");
var VaultInformation_vue_1 = require("@/components/vaults/VaultInformation.vue");
var SecretInformation_vue_1 = require("@/components/vaults/secrets/SecretInformation.vue");
var Social_vue_1 = require("@/components/social/Social.vue");
var AddPeer_vue_1 = require("@/components/social/AddPeer.vue");
var Keys_vue_1 = require("@/components/keys/Keys.vue");
var NewKey_vue_1 = require("@/components/keys/NewKey.vue");
var Configuration_vue_1 = require("@/components/configuration/Configuration.vue");
var NewKeyNode_vue_1 = require("@/components/configuration/NewKeyNode.vue");
var UnlockKeyNode_vue_1 = require("@/components/configuration/UnlockKeyNode.vue");
var RegisterNode_vue_1 = require("@/components/configuration/RegisterNode.vue");
var Bootstrap_vue_1 = require("@/pages/bootstrap/Bootstrap.vue");
var Installation_vue_1 = require("@/pages/installation/Installation.vue");
var SelectKeyNode_vue_1 = require("@/pages/bootstrap/SelectKeyNode.vue");
var routes = [
    {
        path: '/Bootstrap',
        component: Bootstrap_vue_1["default"]
    },
    {
        path: '/Installation',
        component: Installation_vue_1["default"]
    },
    {
        path: '/SelectKeyNode',
        component: SelectKeyNode_vue_1["default"]
    },
    // Vaults
    {
        path: '/Vaults',
        component: Vaults_vue_1["default"]
    },
    {
        path: '/VaultInformation',
        name: 'VaultInformation',
        component: VaultInformation_vue_1["default"]
    },
    {
        path: '/Vaults/NewSecret',
        component: NewSecret_vue_1["default"]
    },
    {
        path: '/Vaults/NewVault',
        component: NewVault_vue_1["default"]
    },
    // Secrets
    {
        path: '/Vaults/SecretInformation',
        component: SecretInformation_vue_1["default"]
    },
    // Social
    {
        path: '/Social',
        component: Social_vue_1["default"]
    },
    {
        path: '/Social/AddPeer',
        component: AddPeer_vue_1["default"]
    },
    // Keys
    {
        path: '/Keys',
        component: Keys_vue_1["default"]
    },
    {
        path: '/Keys/NewKey',
        component: NewKey_vue_1["default"]
    },
    // Configuration
    {
        path: '/Configuration',
        component: Configuration_vue_1["default"]
    },
    {
        path: '/Configuration/NewKeyNode',
        component: NewKeyNode_vue_1["default"]
    },
    {
        path: '/Configuration/UnlockKeyNode',
        component: UnlockKeyNode_vue_1["default"]
    },
    {
        path: '/Configuration/RegisterNode',
        component: RegisterNode_vue_1["default"]
    }
];
var router = vue_router_1.createRouter({
    history: vue_router_1.createWebHashHistory(),
    routes: routes
});
exports["default"] = router;
