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
exports.OS = exports.OSOptions = void 0;
var object_1 = require("../utils/object");
var Math_1 = require("../utils/Math");
var termx_1 = require("termx");
var proxy_1 = require("../proxy");
var key_1 = require("./key");
var FileSystem_1 = require("../utils/FileSystem");
var Audic = require("audic");
var Robot = require("robotjs");
var OSOptions = /** @class */ (function () {
    function OSOptions() {
    }
    return OSOptions;
}());
exports.OSOptions = OSOptions;
var OS = /** @class */ (function () {
    function OS(buddy, options) {
        var _this = this;
        this.buddy = buddy;
        this.options = options;
        object_1.ObjectUtils.setDefaults(options, {
            terminal: false,
            mouse: false,
            keyboard: false,
            ffmpeg: {}
        });
        object_1.ObjectUtils.setDefaults(options.ffmpeg, {
            device: "/dev/video0"
        });
        this.keyboard = proxy_1.ElasticProxy.new({
            recursive: false,
            get: function (path) {
                return new key_1.OS_Key(_this, path);
            }
        });
    }
    OS.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buddy.storage.mkdir("temp")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.buddy.storage.mkdir("temp/audio")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OS.prototype._validateMouse = function () {
        if (!this.options.mouse)
            throw new Error("The mouse feature is disabled in buddy os options.");
    };
    Object.defineProperty(OS.prototype, "mouse", {
        get: function () {
            var _this = this;
            this._validateMouse();
            var pos = Robot.getMousePos();
            this.buddy.log("OS-DEBUG", termx_1.cold("get"), "mouse", "=>", termx_1.warning(pos.x.toString()), ":", termx_1.warning(pos.y.toString()));
            return new Math_1.Vector2(pos.x, pos.y, function (prev, next) {
                _this.mouse = next;
            });
        },
        set: function (vec) {
            this._validateMouse();
            this.buddy.log("OS-DEBUG", termx_1.cold("set"), "mouse", "=>", termx_1.warning(vec.x.toString()), ":", termx_1.warning(vec.y.toString()));
            Robot.moveMouse(vec.x, vec.y);
        },
        enumerable: false,
        configurable: true
    });
    OS.prototype.moveMouse = function (val, steps) {
        if (steps === void 0) { steps = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var currentPos, diff, i;
            return __generator(this, function (_a) {
                this._validateMouse();
                this.buddy.log("OS-DEBUG", termx_1.cold("move"), "mouse", "=>", termx_1.warning(val.x.toString()), ":", termx_1.warning(val.y.toString()));
                currentPos = this.mouse;
                diff = currentPos.minus(val);
                for (i = 1; i <= steps; i++) {
                    Robot.moveMouse(currentPos.x - (i * (diff.x / steps)), currentPos.y - (i * (diff.y / steps)));
                }
                return [2 /*return*/];
            });
        });
    };
    OS.prototype.screenSize = function () {
        var _a = Robot.getScreenSize(), width = _a.width, height = _a.height;
        return new Math_1.Vector2(width, height);
    };
    OS.prototype.screenshot = function (position, size) {
        if (position && size) {
            return Robot.screen.capture(position.x, position.y, size.x, size.y);
        }
        return Robot.screen.capture();
    };
    OS.prototype.playAudio = function (audio, format) {
        return __awaiter(this, void 0, void 0, function () {
            var path, audio_1, exc_1, exc_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.buddy.path("temp/audio/" + Date.now() + "-" + Math.random().toString().substring(2) + "." + format);
                        return [4 /*yield*/, this.buddy.log("OS-DEBUG", "Playing", termx_1.highlight(path))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, FileSystem_1.FileSystem.write(path, audio)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 7]);
                        audio_1 = new Audic(path);
                        return [4 /*yield*/, audio_1.play()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        exc_1 = _a.sent();
                        return [4 /*yield*/, this.buddy.log("OS-DEBUG", "Could not play", termx_1.highlight(path) + ":", termx_1.danger(exc_1.message))];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        if (!true) return [3 /*break*/, 13];
                        return [4 /*yield*/, new Promise(function (d) { return setTimeout(d, 50); })];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, FileSystem_1.FileSystem.remove(path)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 11:
                        exc_2 = _a.sent();
                        if (exc_2.code === "EBUSY")
                            return [3 /*break*/, 7];
                        throw exc_2;
                    case 12: return [3 /*break*/, 7];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    OS.prototype.onScreenFrame = function (evt) {
    };
    return OS;
}());
exports.OS = OS;
//# sourceMappingURL=index.js.map