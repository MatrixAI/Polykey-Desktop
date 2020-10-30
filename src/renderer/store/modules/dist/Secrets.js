"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var PolykeyClient_1 = require("@/store/PolykeyClient");
exports["default"] = {
    namespaced: true,
    state: {
        selectedVaultName: '',
        selectedSecretName: '',
        selectedSecretContent: '',
        secretNames: []
    },
    actions: {
        loadSecretNames: function (_a, vaultName) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var secretNames;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, PolykeyClient_1["default"].ListSecrets(vaultName)];
                        case 1:
                            secretNames = _b.sent();
                            commit('setSecretNames', { vaultName: vaultName, secretNames: secretNames });
                            return [2 /*return*/];
                    }
                });
            });
        },
        selectSecret: function (_a, secretName) {
            var commit = _a.commit, state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var secretContent;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!secretName) return [3 /*break*/, 2];
                            return [4 /*yield*/, polykeyClient.getSecret(state.selectedVaultName, secretName)];
                        case 1:
                            secretContent = _b.sent();
                            commit('setSelectedSecret', { secretName: secretName, secretContent: secretContent });
                            return [3 /*break*/, 3];
                        case 2:
                            commit('setSelectedSecret', { secretName: '', secretContent: '' });
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        updateSecret: function (_a, _b) {
            var commit = _a.commit, state = _a.state;
            var secretName = _b.secretName, secretContent = _b.secretContent;
            return __awaiter(this, void 0, void 0, function () {
                var successful;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, polykeyClient.updateSecret(state.selectedVaultName, secretName, Buffer.from(secretContent))];
                        case 1:
                            successful = _c.sent();
                            if (successful) {
                                commit('setSelectedSecret', { secretName: secretName, secretContent: secretContent });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    },
    mutations: {
        setSecretNames: function (state, _a) {
            var vaultName = _a.vaultName, secretNames = _a.secretNames;
            state.selectedVaultName = vaultName;
            state.secretNames = secretNames;
        },
        setSelectedSecret: function (state, _a) {
            var secretName = _a.secretName, secretContent = _a.secretContent;
            state.selectedSecretName = secretName;
            state.selectedSecretContent = secretContent;
        }
    },
    getters: {}
};
// import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
// import { polykeyClient } from '..'
// import { getConfiguration } from './Configuration'
// @Module({ namespaced: true })
// class Secrets extends VuexModule {
//   public selectedVaultName: string = ''
//   public secretNames: string[] = []
//   @Mutation
//   public setSecretNames(props: { vaultName: string, secretNames: string[] }): void {
//     this.selectedVaultName = props.vaultName
//     this.secretNames = props.secretNames
//   }
//   @Action({ rawError: true })
//   public async loadSecretNames(vaultName: string): Promise<void> {
//     const secretNames = await polykeyClient.listSecrets(vaultName)
//     this.context.commit('setSecretNames', { vaultName, secretNames })
//   }
//   public selectedSecretName: string = ''
//   public selectedSecretContent: string = ''
//   @Mutation
//   public setSelectedSecret(props: { secretName: string, secretContent: string }): void {
//     this.selectedSecretName = props.secretName
//     this.selectedSecretContent = props.secretContent
//   }
//   @Action({ rawError: true })
//   public async selectSecret(secretName?: string): Promise<void> {
//     if (secretName) {
//       const secretContent = await polykeyClient.getSecret(this.selectedVaultName, secretName)
//       this.context.commit('setSelectedSecret', { secretName, secretContent })
//     } else {
//       this.context.commit('setSelectedSecret', { secretName: '', secretContent: '' })
//     }
//   }
//   @Action({ rawError: true })
//   public async updateSecret(props: { secretName: string; secretContent: string }): Promise<void> {
//     const successful = await polykeyClient.updateSecret(this.selectedVaultName, props.secretName, Buffer.from(props.secretContent))
//     if (successful) {
//       this.context.commit('setSelectedSecret', { secretName: props.secretName, secretContent: props.secretContent })
//     }
//   }
// }
// export default Secrets
