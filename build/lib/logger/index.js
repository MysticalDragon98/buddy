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
exports.Logger = exports.verboseLog = void 0;
var termx_1 = require("termx");
var chalk_1 = require("chalk");
var object_1 = require("../utils/object");
var string_1 = require("../utils/string");
var util_1 = require("util");
function verboseLog(name) {
    return termx_1.customLog(termx_1.sequencialColor(), chalk_1.bold(name));
}
exports.verboseLog = verboseLog;
var Logger = /** @class */ (function () {
    function Logger(buddy, options) {
        if (options === void 0) { options = {}; }
        this.buddy = buddy;
        this.options = options;
        this.verboseLogs = {};
        object_1.ObjectUtils.setDefault(options, 'enabled', true);
        object_1.ObjectUtils.setDefault(options, 'hide', []);
        object_1.ObjectUtils.setDefault(options, 'pipe', []);
        object_1.ObjectUtils.setDefault(options, 'speak', []);
    }
    Logger.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buddy.storage.mkdir("logs")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Mainstream buddy console.log
    Logger.prototype.log = function (_class) {
        var _a;
        var _this = this;
        var _b, _c;
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        { // Definitions
            var name = typeof _class == "string" ? _class : _class.name;
            var log = {
                class: name,
                data: data
            };
        }
        { // Break if logs are not enabled or is hidden
            if (!this.options.enabled)
                return;
            if ((_b = this.options.hidden) === null || _b === void 0 ? void 0 : _b.find(function (filter) { return _this.matches(log, filter); }))
                return;
        }
        { // Create log if doesn't exists
            if (!this.verboseLogs[name])
                this.verboseLogs[name] = verboseLog(name);
        }
        { // Pipes content to file based on pipe
            var pipes = this.options.pipe.filter(function (filter) { return _this.matches(log, filter.filter); });
            for (var _d = 0, pipes_1 = pipes; _d < pipes_1.length; _d++) {
                var pipe = pipes_1[_d];
                var stream = this.buddy.storage.stream("logs/" + pipe.name + ".log");
                stream.write(string_1.StringUtils.escapeANSI(termx_1.timestamp()) +
                    " | " + name + " | " +
                    data.map(function (s) {
                        if (typeof s === "string")
                            return string_1.StringUtils.escapeANSI(s);
                        else
                            return util_1.inspect(s);
                    }).join(" ") + "\n");
            }
        }
        { // Speak based on pipe
            if ((_c = this.options.speak) === null || _c === void 0 ? void 0 : _c.find(function (filter) { return _this.matches(log, filter); })) {
                this.buddy.speak(data.toString());
            }
        }
        (_a = this.verboseLogs)[name].apply(_a, data);
    };
    Logger.prototype.matches = function (log, filter) {
        if (filter.class === "*")
            return true;
        return filter.class === log.class;
    };
    Logger.prototype.matchesAll = function (log, filter) {
        var _this = this;
        return filter.length == filter.filter(function (f) { return _this.matches(log, f); }).length;
    };
    Logger.prototype.bm = function (promise, name) {
        return __awaiter(this, void 0, void 0, function () {
            var now, result, duration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = Date.now();
                        if (name)
                            this.buddy.log("LOGGER", "Benchmarking", termx_1.highlight(name));
                        return [4 /*yield*/, promise];
                    case 1:
                        result = _a.sent();
                        duration = Date.now() - now;
                        this.buddy.log("LOGGER", termx_1.highlight(name), "finished after", termx_1.cold(duration + "ms"));
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=index.js.map