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
var logger_1 = require("@matrixai/logger");
var client_1 = require("@matrixai/polykey/dist/client");
var clientService_1 = require("@matrixai/polykey/dist/client/clientService");
var KeyManager_1 = require("@matrixai/polykey/dist/keys/KeyManager");
var VaultManager_1 = require("@matrixai/polykey/dist/vaults/VaultManager");
var NodeManager_1 = require("@matrixai/polykey/dist/nodes/NodeManager");
var GestaltGraph_1 = require("@matrixai/polykey/dist/gestalts/GestaltGraph");
var SessionManager_1 = require("@matrixai/polykey/dist/session/SessionManager");
var IdentitiesManager_1 = require("@matrixai/polykey/dist/identities/IdentitiesManager");
var ForwardProxy_1 = require("@matrixai/polykey/dist/network/ForwardProxy");
var ReverseProxy_1 = require("@matrixai/polykey/dist/network/ReverseProxy");
var GitBackend_1 = require("@matrixai/polykey/dist/git/GitBackend");
var GRPCServer_1 = require("@matrixai/polykey/dist/grpc/GRPCServer");
var agent_1 = require("@matrixai/polykey/dist/agent");
var utils_1 = require("@matrixai/polykey/dist/network/utils");
var lockfile_1 = require("@matrixai/polykey/dist/lockfile");
var path_1 = require("path");
var utils = require("@matrixai/polykey/dist/utils");
var errors = require("@matrixai/polykey/dist/errors");
var workers_1 = require("@matrixai/polykey/dist/workers");
var fs_1 = require("fs");
var utils_2 = require("@matrixai/polykey/dist/utils");
var nodePath = utils_2.getDefaultNodePath();
console.log(nodePath);
var keysPath = './tmp/keys';
var nodesPath = './tmp/nodes';
var vaultsPath = './tmp/vaults';
var identitiesPath = './tmp/identities';
var gestaltsPath = './tmp/gestalts';
var grpcHost = '127.0.0.1';
var grpcPort = 0;
var fresh = false;
var authToken = 'asdf';
var password = 'Password';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, keyManager, vaultManager, fwdProxy, revProxy, nodeManager, identitiesManager, gestaltGraph, sessionManager, gitBackend, workerManager, lockfile, clientService, agentService, grpcServer, lock, keyPrivatePem, certChainPem, cert, nodeId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new logger_1["default"]('Polykey');
                    keyManager = new KeyManager_1["default"]({ keysPath: keysPath, logger: logger });
                    vaultManager = new VaultManager_1["default"]({
                        vaultsPath: vaultsPath,
                        keyManager: keyManager,
                        logger: logger
                    });
                    fwdProxy = new ForwardProxy_1["default"]({ authToken: authToken, logger: logger });
                    revProxy = new ReverseProxy_1["default"]({ logger: logger });
                    nodeManager = new NodeManager_1["default"]({
                        fwdProxy: fwdProxy,
                        keyManager: keyManager,
                        nodesPath: nodesPath,
                        revProxy: revProxy,
                        logger: logger
                    });
                    identitiesManager = new IdentitiesManager_1["default"]({
                        identitiesPath: identitiesPath,
                        keyManager: keyManager,
                        logger: logger
                    });
                    gestaltGraph = new GestaltGraph_1["default"]({
                        gestaltsPath: gestaltsPath,
                        keyManager: keyManager,
                        logger: logger
                    });
                    sessionManager = new SessionManager_1["default"]({
                        keyManager: keyManager,
                        logger: logger
                    });
                    gitBackend = new GitBackend_1["default"]({
                        getVault: vaultManager.getVault.bind(vaultManager),
                        getVaultID: vaultManager.getVaultIds.bind(vaultManager),
                        getVaultNames: vaultManager.listVaults.bind(vaultManager),
                        logger: logger
                    });
                    workerManager = new workers_1.WorkerManager({ logger: logger });
                    lockfile = new lockfile_1.Lockfile({
                        nodePath: nodePath,
                        logger: logger
                    });
                    clientService = clientService_1["default"]({
                        gestaltGraph: gestaltGraph,
                        identitiesManager: identitiesManager,
                        keyManager: keyManager,
                        nodeManager: nodeManager,
                        sessionManager: sessionManager,
                        vaultManager: vaultManager
                    });
                    agentService = agent_1.createAgentService({
                        keyManager: keyManager,
                        vaultManager: vaultManager,
                        nodeManager: nodeManager,
                        gitBackend: gitBackend
                    });
                    grpcServer = new GRPCServer_1["default"]({
                        services: [
                            [client_1.ClientService, clientService],
                            [agent_1.AgentService, agentService],
                        ],
                        logger: logger
                    });
                    return [4 /*yield*/, lockfile_1.Lockfile.checkLock(fs_1["default"], path_1["default"].join(nodePath, 'agent-lock.json'))];
                case 1:
                    if (!((_a.sent()) !==
                        'DOESNOTEXIST')) return [3 /*break*/, 3];
                    return [4 /*yield*/, lockfile_1.Lockfile.parseLock(fs_1["default"], path_1["default"].join(nodePath, 'agent-lock.json'))];
                case 2:
                    lock = _a.sent();
                    if (utils.pidIsRunning(lock.pid)) {
                        logger.error("PolykeyAgent already started at pid: " + lock.pid);
                        throw new errors.ErrorPolykey("PolykeyAgent already started at pid: " + lock.pid);
                    }
                    _a.label = 3;
                case 3: 
                //starting everything.
                return [4 /*yield*/, workerManager.start()];
                case 4:
                    //starting everything.
                    _a.sent();
                    return [4 /*yield*/, keyManager.start({ password: password, fresh: fresh })];
                case 5:
                    _a.sent();
                    keyManager.setWorkerManager(workerManager);
                    keyPrivatePem = keyManager.getRootKeyPairPem().privateKey;
                    return [4 /*yield*/, keyManager.getRootCertChainPem()];
                case 6:
                    certChainPem = _a.sent();
                    cert = keyManager.getRootCert();
                    nodeId = utils_1.certNodeId(cert);
                    return [4 /*yield*/, vaultManager.start({ fresh: fresh })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, grpcServer.start({
                            host: grpcHost,
                            port: grpcPort
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, fwdProxy.start({
                            tlsConfig: {
                                keyPrivatePem: keyPrivatePem,
                                certChainPem: certChainPem
                            }
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, revProxy.start({
                            serverHost: grpcHost,
                            serverPort: grpcPort,
                            tlsConfig: {
                                keyPrivatePem: keyPrivatePem,
                                certChainPem: certChainPem
                            }
                        })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, lockfile.start({ nodeId: nodeId })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, lockfile.updateLockfile('host', grpcHost)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, lockfile.updateLockfile('port', grpcServer.getPort())];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, lockfile.updateLockfile('fwdProxyHost', fwdProxy.getProxyHost())];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, lockfile.updateLockfile('fwdProxyPort', fwdProxy.getProxyPort())];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, nodeManager.start({ nodeId: nodeId, fresh: fresh })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, identitiesManager.start({ fresh: fresh })];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, gestaltGraph.start({ fresh: fresh })];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, sessionManager.start({})];
                case 19:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () { return console.log('Done'); });
