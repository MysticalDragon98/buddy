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
exports.Buddy = void 0;
var path_1 = require("path");
var crypto_1 = require("./lib/crypto");
var http_1 = require("./lib/http");
var logger_1 = require("./lib/logger");
var prompt_1 = require("./lib/prompt");
var storage_1 = require("./lib/storage");
var object_1 = require("./lib/utils/object");
var web3_1 = require("./lib/web3");
var slackbot_1 = require("./lib/slackbot");
var nlp_1 = require("./lib/nlp");
var ssh_1 = require("./lib/ssh");
var lang_1 = require("./lib/lang");
var mongo_1 = require("./lib/mongo");
var os_1 = require("./lib/os");
var gcloud_1 = require("./lib/gcloud");
var unete_1 = require("./lib/unete");
var auth_1 = require("./lib/auth");
var mqtt_1 = require("./lib/mqtt");
var Buddy = /** @class */ (function () {
    function Buddy(options) {
        this.options = options;
        this._registry = {};
        object_1.ObjectUtils.setDefault(options, 'logger', {});
        this.storage = new storage_1.Storage(this);
        this.crypto = new crypto_1.Crypto(this);
        this.prompt = new prompt_1.Prompt(this);
        this.logger = new logger_1.Logger(this, options.logger);
        this.os = options.os && new os_1.OS(this, options.os);
        this.http = options.http && new http_1.HTTP(this);
        this.nlp = options.nlp && new nlp_1.NLP(this, options.nlp);
        this.web3 = options.web3 && new web3_1.Web3Buddy(this, options.web3);
        this.slackbot = options.slackbot && new slackbot_1.SlackBot(this, options.slackbot);
        this.ssh = options.ssh && new ssh_1.SSH(this, options.ssh);
        this.lang = options.lang && new lang_1.Lang(this, options.lang);
        this.mongo = options.mongo && new mongo_1.Mongo(this, options.mongo);
        this.gcloud = options.gcloud && new gcloud_1.GCloud(this, options.gcloud);
        this.unete = options.unete && new unete_1.Unete(this, options.unete);
        this.auth = options.auth && new auth_1.Auth(this, options.auth);
        this.mqtt = options.mqtt && new mqtt_1.MQTT(this, options.mqtt);
    }
    Buddy.prototype.init = function (cb) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, this.storage.mkdir(".")];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, this.storage.init()];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, this.logger.init()];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, ((_a = this.web3) === null || _a === void 0 ? void 0 : _a.init())];
                    case 4:
                        _h.sent();
                        return [4 /*yield*/, ((_b = this.nlp) === null || _b === void 0 ? void 0 : _b.init())];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, ((_c = this.ssh) === null || _c === void 0 ? void 0 : _c.init())];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, ((_d = this.http) === null || _d === void 0 ? void 0 : _d.create(this.options.http))];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, ((_e = this.os) === null || _e === void 0 ? void 0 : _e.init())];
                    case 8:
                        _h.sent();
                        return [4 /*yield*/, ((_f = this.unete) === null || _f === void 0 ? void 0 : _f.init())];
                    case 9:
                        _h.sent();
                        return [4 /*yield*/, ((_g = this.mqtt) === null || _g === void 0 ? void 0 : _g.init())];
                    case 10:
                        _h.sent();
                        if (!cb) return [3 /*break*/, 12];
                        return [4 /*yield*/, cb(this)];
                    case 11:
                        _h.sent();
                        _h.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Buddy.prototype.speak = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.gcloud)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.gcloud.speak(text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Buddy.prototype.log = function (_class) {
        var _a;
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        (_a = this.logger).log.apply(_a, __spreadArray([_class], data));
    };
    Buddy.prototype.path = function (name) {
        return path_1.join(this.options.dir, name);
    };
    Buddy.prototype.setRegistry = function (name, data) {
        this._registry[name] = data;
    };
    Buddy.prototype.getRegistry = function (name) {
        return this._registry[name];
    };
    return Buddy;
}());
exports.Buddy = Buddy;
//# sourceMappingURL=index.js.map