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
        publicKey: '',
        privateKey: '',
        keyNames: [],
        selectedKeyName: '',
        selectedKeyContent: ''
    },
    actions: {
        loadKeyNames: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var keyNames;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, PolykeyClient_1["default"].ListKeys()];
                        case 1:
                            keyNames = _b.sent();
                            commit('loadKeyNames', keyNames);
                            return [2 /*return*/];
                    }
                });
            });
        },
        deleteKey: function (_a, keyName) {
            var commit = _a.commit, state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var successful, keyNames;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, PolykeyClient_1["default"].DeleteKey(keyName)];
                        case 1:
                            successful = _b.sent();
                            if (!successful) return [3 /*break*/, 3];
                            return [4 /*yield*/, PolykeyClient_1["default"].ListKeys()];
                        case 2:
                            keyNames = _b.sent();
                            return [2 /*return*/, commit('loadKeyNames', keyNames)];
                        case 3: return [2 /*return*/, commit('loadKeyNames', state.keyNames)];
                    }
                });
            });
        },
        loadKeyPair: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var keyPair;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, PolykeyClient_1["default"].GetPrimaryKeyPair(true)];
                        case 1:
                            keyPair = _b.sent();
                            console.log('keyPair', keyPair);
                            return [2 /*return*/];
                    }
                });
            });
        },
        selectKey: function (_a, keyName) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var keyContent;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, PolykeyClient_1["default"].GetKey(keyName)];
                        case 1:
                            keyContent = _b.sent();
                            commit('selectKey', { selectedKeyName: keyName, selectedKeyContent: keyContent });
                            return [2 /*return*/];
                    }
                });
            });
        }
    },
    mutations: {
        loadKeyNames: function (state, keyNames) {
            state.keyNames = keyNames;
        },
        loadKeyPair: function (state, _a) {
            var publicKey = _a.publicKey, privateKey = _a.privateKey;
            state.publicKey = publicKey;
            state.privateKey = privateKey;
        },
        selectKey: function (state, _a) {
            var selectedKeyName = _a.selectedKeyName, selectedKeyContent = _a.selectedKeyContent;
            state.selectedKeyName = selectedKeyName;
            state.selectedKeyContent = selectedKeyContent;
        }
    },
    getters: {}
};
// import { polykeyClient } from '@/store'
// import { getConfiguration } from '@/store/modules/Configuration'
// import { VuexModule, Module, Mutation, MutationAction } from 'vuex-module-decorators'
// @Module({ namespaced: true })
// class Keys extends VuexModule {
//   public publicKey: string = ''
//   public privateKey: string = ''
//   public keyNames: string[] = []
//   public selectedKeyName: string = ''
//   public selectedKeyContent: string = ''
//   @MutationAction({ rawError: true, mutate: ['keyNames'] })
//   public async loadKeyNames() {
//     const keyNames = await polykeyClient.listKeys()
//     return { keyNames }
//   }
//   @MutationAction({ rawError: true, mutate: ['keyNames'] })
//   public async deleteKey(keyName: string) {
//     const successful = await polykeyClient.deleteKey(keyName)
//     if (successful) {
//       const keyNames = await polykeyClient.listKeys()
//       return { keyNames }
//     } else {
//       return { keyNames: this.keyNames }
//     }
//   }
//   @Mutation
//   public setKeyPair(keyPair: { public: string, private: string }): void {
//     this.publicKey = keyPair.public
//     this.privateKey = keyPair.private
//   }
//   @MutationAction({ rawError: true, mutate: ['publicKey', 'privateKey'] })
//   public async loadKeyPair() {
//     const keyPair = await polykeyClient.getPrimaryKeyPair(true)
//     return { publicKey: keyPair.public, privateKey: keyPair.private }
//   }
//   @MutationAction({ rawError: true, mutate: ['selectedKeyName', 'selectedKeyContent'] })
//   public async selectKey(keyName: string) {
//     const keyContent = await polykeyClient.getKey(keyName)
//     return { selectedKeyName: keyName, selectedKeyContent: keyContent }
//   }
// }
// export default Keys
