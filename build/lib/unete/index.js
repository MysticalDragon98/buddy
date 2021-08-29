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
exports.Unete = void 0;
var io_1 = require("@unete/io");
var termx_1 = require("termx");
var object_1 = require("../utils/object");
var FileSystem_1 = require("../utils/FileSystem");
var Unete = /** @class */ (function () {
    function Unete(buddy, options) {
        this.buddy = buddy;
        this.options = options;
        this.connections = {};
        object_1.ObjectUtils.setDefaults(options, {
            endpoints: {},
            connections: {}
        });
        if (options.port) {
            this.server = new io_1.Server(options.endpoints);
        }
        for (var name_1 in options.connections)
            this.connections[name_1] = io_1.Socket(options.connections[name_1]);
    }
    Unete.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, name_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.options.port) {
                            this.server.listen(this.options.port);
                            this.buddy.log("UNETE", "Server running at port", termx_1.highlight(this.options.port.toString()));
                        }
                        this.buddy.storage.mkdir("unete");
                        this.buddy.storage.mkdir("unete/interfaces");
                        _a = [];
                        for (_b in this.connections)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        name_2 = _a[_i];
                        return [4 /*yield*/, this.generateInterfacesForConnection(name_2)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Unete.prototype.generateInterfacesForConnection = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, publicEndpoints, collections, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.buddy.log("UNETE", "Generating interfaces for connection", termx_1.cold(name), "with url", termx_1.highlight(this.options.connections[name]));
                        conn = this.connections[name];
                        return [4 /*yield*/, conn.$public()];
                    case 1:
                        publicEndpoints = _a.sent();
                        collections = "";
                        text = "export default interface UneteInterface_" + name + " " + endpointToSchema(publicEndpoints, "    ");
                        return [4 /*yield*/, FileSystem_1.FileSystem.write(this.buddy.path("unete/interfaces/" + name + ".ts"), text)];
                    case 2:
                        _a.sent();
                        this.buddy.log("UNETE", "Interfaces for connection", termx_1.cold(name), "with url", termx_1.highlight(this.options.connections[name]), "generated");
                        return [2 /*return*/];
                }
            });
        });
    };
    return Unete;
}());
exports.Unete = Unete;
function endpointToSchema(endpoint, pre) {
    if (pre === void 0) { pre = ""; }
    var fields = [];
    if (Object.keys(endpoint).toString() === "arguments")
        return "(" + endpoint.arguments.join(", ") + ") => any;";
    for (var name_3 in endpoint) {
        fields.push(name_3 + ": " + endpointToSchema(endpoint[name_3], pre + "    "));
    }
    ;
    return "{\n" + pre + fields.join("\n" + pre) + "\n" + pre.substring(0, pre.length - 4) + "};\n";
}
//# sourceMappingURL=index.js.map