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
        vaultNames: [],
        selectedVaultName: ''
    },
    actions: {
        loadVaultNames: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var vaultNames;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, PolykeyClient_1["default"].ListVaults()];
                        case 1:
                            vaultNames = _b.sent();
                            commit('setVaultNames', vaultNames);
                            return [2 /*return*/];
                    }
                });
            });
        },
        selectVault: function (_a, vaultName) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('setSelectedVault', vaultName);
                    return [2 /*return*/];
                });
            });
        },
        deleteVault: function (_a, vaultName) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var vaultNames;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, PolykeyClient_1["default"].DeleteVault(vaultName)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, PolykeyClient_1["default"].ListVaults()];
                        case 2:
                            vaultNames = _b.sent();
                            commit('setVaultNames', vaultNames);
                            return [2 /*return*/];
                    }
                });
            });
        }
    },
    mutations: {
        setVaultNames: function (state, vaultNames) {
            state.vaultNames = vaultNames;
        },
        setSelectedVault: function (state, vaultName) {
            state.selectedVaultName = vaultName;
        }
    },
    getters: {}
};
// import { polykeyClient } from '@/store'
// import { getConfiguration } from '@/store/modules/Configuration'
// import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
// @Module({ namespaced: true })
// class Vaults extends VuexModule {
//   public vaultNames: string[] = []
//   public selectedVaultName: string = ''
//   @Mutation
//   public setVaultNames(vaultNames: string[]): void {
//     this.vaultNames = vaultNames
//   }
//   @Mutation
//   public setSelectedVault(vaultName: string): void {
//     this.selectedVaultName = vaultName
//   }
//   @Action({ rawError: true })
//   public async loadVaultNames(): Promise<void> {
//     const vaultNames = await polykeyClient.listVaults()
//     this.context.commit('setVaultNames', vaultNames)
//   }
//   @Action({ rawError: true })
//   public selectVault(vaultName: string): void {
//     this.context.commit('setSelectedVault', vaultName)
//   }
// }
// export default Vaults
