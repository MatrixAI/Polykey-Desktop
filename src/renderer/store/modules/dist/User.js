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
        isUnlocked: false,
        isInitialized: false,
        step: 2
    },
    actions: {
        checkUserStatus: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var pid, vaultsList, error_1, vaultsList, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // first set both initialized and unlocked to false, they will be changed in the process
                            commit('setIsUnlocked', false);
                            commit('setIsInitialized', false);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 12]);
                            return [4 /*yield*/, PolykeyClient_1["default"].StartAgent()];
                        case 2:
                            pid = _b.sent();
                            console.log("Agent has been started with a pid of: " + pid);
                            return [4 /*yield*/, PolykeyClient_1["default"].ListVaults()];
                        case 3:
                            vaultsList = _b.sent();
                            console.log(vaultsList);
                            commit('setIsUnlocked', true);
                            commit('setIsInitialized', true);
                            return [3 /*break*/, 12];
                        case 4:
                            error_1 = _b.sent();
                            console.log(error_1);
                            if (!error_1.message.includes('not been initialized')) return [3 /*break*/, 5];
                            commit('setIsUnlocked', false);
                            commit('setIsInitialized', false);
                            return [3 /*break*/, 11];
                        case 5:
                            if (!error_1.message.includes('already running')) return [3 /*break*/, 10];
                            _b.label = 6;
                        case 6:
                            _b.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, PolykeyClient_1["default"].ListVaults()];
                        case 7:
                            vaultsList = _b.sent();
                            console.log(vaultsList);
                            commit('setIsUnlocked', true);
                            commit('setIsInitialized', true);
                            return [3 /*break*/, 9];
                        case 8:
                            error_2 = _b.sent();
                            commit('setIsUnlocked', false);
                            commit('setIsInitialized', false);
                            return [3 /*break*/, 9];
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (error_1.message.includes('locked')) {
                                commit('setIsUnlocked', false);
                                commit('setIsInitialized', true);
                            }
                            else {
                                // some other error
                                commit('setIsUnlocked', false);
                                commit('setIsInitialized', false);
                                throw Error("something else went wrong: " + error_1.message);
                            }
                            _b.label = 11;
                        case 11: return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        },
        setIsUnlocked: function (_a, isUnlocked) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('setIsUnlocked', isUnlocked);
                    return [2 /*return*/];
                });
            });
        },
        setIsInitialized: function (_a, isInitialized) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('setIsInitialized', isInitialized);
                    return [2 /*return*/];
                });
            });
        }
    },
    mutations: {
        setIsUnlocked: function (state, isUnlocked) {
            state.isUnlocked = isUnlocked;
        },
        setIsInitialized: function (state, isInitialized) {
            state.isInitialized = isInitialized;
        }
    },
    getters: {}
};
