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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSHConnection = exports.SSH = exports.SSHOptions = void 0;
var termx_1 = require("termx");
var object_1 = require("../utils/object");
var node_ssh_1 = require("node-ssh");
var proxy_1 = require("../proxy");
var generateKeypair = require("keypair");
var nodeForge = require("node-forge");
var SSHOptions = /** @class */ (function () {
    function SSHOptions() {
    }
    return SSHOptions;
}());
exports.SSHOptions = SSHOptions;
var SSH = /** @class */ (function () {
    function SSH(buddy, options) {
        var _this = this;
        this.buddy = buddy;
        this.options = options;
        this.bash = {};
        this.sudo = {};
        object_1.ObjectUtils.setDefaults(options, {
            remote: {}
        });
        var _loop_1 = function (host) {
            this_1.bash[host] = proxy_1.ElasticProxy.new({
                recursive: false,
                get: function (path) {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return __awaiter(_this, void 0, void 0, function () {
                            var conn, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.connect(host)];
                                    case 1:
                                        conn = _a.sent();
                                        return [4 /*yield*/, conn.exec(path, args)];
                                    case 2:
                                        result = _a.sent();
                                        return [4 /*yield*/, conn.close()];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        });
                    };
                }
            });
            this_1.sudo[host] = proxy_1.ElasticProxy.new({
                recursive: false,
                get: function (path) {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return __awaiter(_this, void 0, void 0, function () {
                            var conn, result, exc_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.connect(host)];
                                    case 1:
                                        conn = _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, conn.exec("sudo", __spreadArray([path], args))];
                                    case 3:
                                        result = _a.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        exc_1 = _a.sent();
                                        if (!exc_1.message.includes("sudo: unable to resolve host"))
                                            throw exc_1;
                                        result = "ok";
                                        return [3 /*break*/, 5];
                                    case 5: return [4 /*yield*/, conn.close()];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        });
                    };
                }
            });
        };
        var this_1 = this;
        for (var host in options.remote) {
            _loop_1(host);
        }
    }
    SSH.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rsa, exc_2, pair, publicKey, ssh;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.buddy.storage.mkdir("ssh")];
                    case 1:
                        _b.sent();
                        if (!!this.options.sshKeys) return [3 /*break*/, 9];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 9]);
                        _a = {};
                        return [4 /*yield*/, this.buddy.storage.read("ssh/private.key")];
                    case 3:
                        _a.private = _b.sent();
                        return [4 /*yield*/, this.buddy.storage.read("ssh/public.key")];
                    case 4:
                        rsa = (_a.public = _b.sent(),
                            _a);
                        return [3 /*break*/, 9];
                    case 5:
                        exc_2 = _b.sent();
                        this.buddy.log(SSH, termx_1.danger("Could not load RSA keys from workdir:"), exc_2.code);
                        if (!(exc_2.code === "ENOENT")) return [3 /*break*/, 8];
                        this.buddy.log(SSH, "Generating ssh keys.");
                        pair = generateKeypair();
                        publicKey = nodeForge.pki.publicKeyFromPem(pair.public);
                        ssh = nodeForge.ssh.publicKeyToOpenSSH(publicKey) + (this.options.username || "");
                        rsa = {
                            private: pair.private,
                            public: ssh.trim()
                        };
                        return [4 /*yield*/, this.buddy.storage.write("ssh/public.key", rsa.public)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, this.buddy.storage.write("ssh/private.key", rsa.private)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [3 /*break*/, 9];
                    case 9:
                        this.buddy.log(SSH, "Public Key:\n" + termx_1.highlight(rsa.public));
                        this.options.sshKeys = rsa;
                        return [2 /*return*/];
                }
            });
        });
    };
    SSH.prototype.connect = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var host, conn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.options.remote[name])
                            throw new Error("Host " + name + " doesn't exists in the ssh.remote options");
                        host = this.options.remote[name];
                        conn = new SSHConnection(this, host);
                        return [4 /*yield*/, conn.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, conn];
                }
            });
        });
    };
    return SSH;
}());
exports.SSH = SSH;
var SSHConnection = /** @class */ (function () {
    function SSHConnection(ssh, host) {
        this.ssh = ssh;
        this.host = host;
        this.nodessh = new node_ssh_1.NodeSSH();
    }
    SSHConnection.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodessh.connect({
                            host: this.host,
                            username: this.ssh.options.username,
                            privateKey: this.ssh.options.sshKeys.private
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SSHConnection.prototype.exec = function (command, args) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = this.nodessh.exec(command, args, {
                    stream: "stdout"
                });
                return [2 /*return*/, result];
            });
        });
    };
    SSHConnection.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodessh.dispose()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SSHConnection;
}());
exports.SSHConnection = SSHConnection;
//# sourceMappingURL=index.js.map