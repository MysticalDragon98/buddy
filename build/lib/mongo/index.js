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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mongo = void 0;
var mongoose_1 = require("mongoose");
var proxy_1 = require("../proxy");
var Mongo = /** @class */ (function () {
    function Mongo(buddy, options) {
        var _this = this;
        this.buddy = buddy;
        this.options = options;
        this.clients = {};
        this.db = proxy_1.ElasticProxy.new({
            recursive: false,
            get: function (path) {
                return _this.client(path).proxy();
            }
        });
    }
    Mongo.prototype.client = function (name) {
        if (this.clients[name])
            return this.clients[name];
        if (!this.options.connections[name]) {
            this.buddy.log("MONGO", "Client \"" + name + "\" not found.");
            throw new Error("MongoDB: Client \"" + name + "\" not found.");
        }
        this.clients[name] = new MongoClient(this, name, mongoose_1.createConnection(this.options.connections[name], {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }));
        return this.clients[name];
    };
    return Mongo;
}());
exports.Mongo = Mongo;
var MongoClient = /** @class */ (function () {
    function MongoClient(mongo, name, conn) {
        this.mongo = mongo;
        this.name = name;
        this.conn = conn;
        this.models = {};
    }
    MongoClient.prototype.model = function (name) {
        if (this.models[name])
            return this.models[name];
        this.models[name] = this.conn.model(name, this.mongo.options.models[name]);
        return this.models[name];
    };
    MongoClient.prototype.proxy = function () {
        var _this = this;
        return proxy_1.ElasticProxy.new({
            recursive: false,
            get: function (path) {
                if (path === "$") {
                    return function (cmd) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.conn.$initialConnection];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, this.conn.db.executeDbAdminCommand(cmd)];
                                case 2: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                }
                return _this.model(path);
            }
        });
    };
    return MongoClient;
}());
//# sourceMappingURL=index.js.map