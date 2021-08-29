"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Buddy = void 0;
var termx_1 = require("termx");
var enums_1 = require("../../enums");
var SolC = __importStar(require("solc"));
var object_1 = require("../utils/object");
var proxy_1 = require("../proxy");
var FileSystem_1 = require("../utils/FileSystem");
var HDWalletProvider = require('@truffle/hdwallet-provider');
var Web3 = require('web3');
var Web3Buddy = /** @class */ (function () {
    function Web3Buddy(buddy, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.buddy = buddy;
        this.options = options;
        this.contracts = {};
        this._contracts = {};
        object_1.ObjectUtils.setDefaults(this.options, {
            contracts: {},
            abi: [],
            src: [],
            bin: []
        });
        this.options.abi.push(this.buddy.path('web3/abi'));
        this.options.src.push(this.buddy.path('web3/contracts'));
        this.options.bin.push(this.buddy.path('web3/binaries'));
        var _loop_1 = function (contractName) {
            this_1.contracts[contractName] = proxy_1.ElasticProxy.new({
                recursive: true,
                apply: function (path, args) { return __awaiter(_this, void 0, void 0, function () {
                    var methodName, _a, abi, contract, abiMethod, execution;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                methodName = path.join('.');
                                return [4 /*yield*/, this.getContract(contractName)];
                            case 1:
                                _a = _c.sent(), abi = _a.abi, contract = _a.contract;
                                abiMethod = abi.find(function (_a) {
                                    var name = _a.name;
                                    return name === methodName;
                                });
                                if (!abiMethod)
                                    throw new Error("Method " + termx_1.highlight(methodName) + " not found in contract: " + termx_1.highlight(methodName));
                                return [4 /*yield*/, (_b = contract.methods)[methodName].apply(_b, args)];
                            case 2:
                                execution = _c.sent();
                                if (!(abiMethod.stateMutability === "view" || abiMethod.stateMutability === "pure")) return [3 /*break*/, 4];
                                this.buddy.log(Web3Buddy, termx_1.cold("[CALL]") + " " + contractName + "." + methodName + "(" + args.map(function (x) { return typeof (x); }).join(', ') + ")");
                                return [4 /*yield*/, execution.call({
                                        from: this.options.account.address,
                                        chainId: this.options.chainId,
                                        gasPrice: this.options.gasPrice
                                    })];
                            case 3: return [2 /*return*/, _c.sent()];
                            case 4:
                                this.buddy.log(Web3Buddy, termx_1.highlight("[SEND]") + " " + contractName + "." + methodName + "(" + args.map(function (x) { return typeof (x); }).join(', ') + ")");
                                return [4 /*yield*/, execution.send({
                                        from: this.options.account.address,
                                        chainId: this.options.chainId,
                                        gasPrice: this.options.gasPrice
                                    })];
                            case 5: return [2 /*return*/, _c.sent()];
                        }
                    });
                }); }
            });
        };
        var this_1 = this;
        for (var contractName in this.options.contracts) {
            _loop_1(contractName);
        }
        // console.log(this.contracts, this.options)
    }
    Web3Buddy.prototype.init = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var web3, defaultAccount, account, _d, network, _e, provider, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this.buddy.storage.mkdir("web3")];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, this.buddy.storage.mkdir("web3/abi")];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, this.buddy.storage.mkdir("web3/contracts")];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, this.buddy.storage.mkdir("web3/binaries")];
                    case 4:
                        _g.sent();
                        web3 = new Web3();
                        defaultAccount = web3.eth.accounts.create();
                        if (!((_a = this.options.account) !== null && _a !== void 0)) return [3 /*break*/, 5];
                        _d = _a;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.buddy.storage.read("web3-account.json", defaultAccount)];
                    case 6:
                        _d = _g.sent();
                        _g.label = 7;
                    case 7:
                        account = _d;
                        if (!((_b = this.options.network) !== null && _b !== void 0)) return [3 /*break*/, 8];
                        _e = _b;
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.buddy.storage.env.web3_network()];
                    case 9:
                        _e = _g.sent();
                        _g.label = 10;
                    case 10:
                        network = _e;
                        if (!((_c = this.options.provider) !== null && _c !== void 0)) return [3 /*break*/, 11];
                        _f = _c;
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, this.buddy.storage.env.web3_provider()];
                    case 12:
                        _f = _g.sent();
                        _g.label = 13;
                    case 13:
                        provider = _f;
                        if (!!network) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.buddy.prompt.choice("Which network do you want to use?", enums_1.ETHEREUM_NETWORKS)];
                    case 14:
                        network = _g.sent();
                        return [4 /*yield*/, this.buddy.storage.env.web3_network(network)];
                    case 15:
                        _g.sent();
                        _g.label = 16;
                    case 16:
                        if (!!provider) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.buddy.prompt.text("Enter your Web3 provider:")];
                    case 17:
                        provider = _g.sent();
                        return [4 /*yield*/, this.buddy.storage.env.web3_provider(provider)];
                    case 18:
                        _g.sent();
                        _g.label = 19;
                    case 19:
                        this.buddy.log(Web3Buddy, termx_1.highlight("Network:"), network);
                        this.buddy.log(Web3Buddy, termx_1.highlight("Provider:"), provider);
                        this.options.network = network;
                        this.options.provider = provider;
                        this.options.account = account;
                        this.web3 = new Web3(new HDWalletProvider(this.options.account.privateKey, this.options.provider));
                        return [2 /*return*/];
                }
            });
        });
    };
    Web3Buddy.prototype.getContract = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var ABI, abi;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._contracts[name])
                            return [2 /*return*/, this._contracts[name]];
                        this.buddy.log(Web3Buddy, "Loading contract: " + termx_1.highlight(name));
                        return [4 /*yield*/, FileSystem_1.FileSystem.lookup(this.options.abi, name + ".json")];
                    case 1:
                        ABI = _a.sent();
                        if (!ABI)
                            throw new Error("Could not find contract: " + name);
                        abi = JSON.parse(ABI);
                        return [2 /*return*/, this._contracts[name] = {
                                abi: abi,
                                contract: new this.web3.eth.Contract(abi, this.options.contracts[name])
                            }];
                }
            });
        });
    };
    Web3Buddy.prototype.deploy = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var src, output;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.buddy.log(Web3Buddy, "Deploying contract " + termx_1.highlight(name) + "...");
                        return [4 /*yield*/, FileSystem_1.FileSystem.lookup(this.options.src, name + ".sol")];
                    case 1:
                        src = _b.sent();
                        if (!src)
                            throw new Error('Could not find contract ' + termx_1.highlight(name));
                        output = JSON.parse(SolC.compile(JSON.stringify({
                            language: 'Solidity',
                            sources: (_a = {},
                                _a[name + ".sol"] = {
                                    content: src
                                },
                                _a),
                            settings: {
                                outputSelection: {
                                    "*": {
                                        "*": ["*"]
                                    }
                                }
                            }
                        }), {
                            import: function (path) {
                                var importPath = require.resolve(path);
                                return {
                                    contents: FileSystem_1.FileSystem.readSync(importPath)
                                };
                            }
                        }));
                        this.buddy.log(Web3Buddy, output);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Web3Buddy;
}());
exports.Web3Buddy = Web3Buddy;
//# sourceMappingURL=index.js.map