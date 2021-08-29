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
exports.SlackBot = void 0;
var web_api_1 = require("@slack/web-api");
var termx_1 = require("termx");
var SlackBot = /** @class */ (function () {
    function SlackBot(buddy, options) {
        this.buddy = buddy;
        this.options = options;
        this.bot = new web_api_1.WebClient(options.token);
        buddy.log("SLACK", "Bot initialized.");
    }
    SlackBot.prototype.chat = function (userId, text, templateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bot.chat.postMessage({
                            channel: userId,
                            text: templateData ?
                                string_1.StringUtils.template(text, templateData) :
                                text
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SlackBot.prototype.conversations = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bot.conversations.list()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SlackBot.prototype.users = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bot.users.list()];
                    case 1: return [2 /*return*/, (_a.sent()).members];
                }
            });
        });
    };
    SlackBot.prototype.userId = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var users, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.users()];
                    case 1:
                        users = _a.sent();
                        user = users.find(function (u) { return u.name == name; });
                        return [2 /*return*/, user ? user.id : null];
                }
            });
        });
    };
    SlackBot.prototype.handleWebhook = function (eventId, event) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (event.bot_id)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.buddy.storage.json.webhookEvents[eventId]()];
                    case 1:
                        if (_b.sent())
                            return [2 /*return*/];
                        if (event.type == "message") {
                            if (event.channel_type == "im") {
                                (_a = this.options.events) === null || _a === void 0 ? void 0 : _a.onDMReceived(this.buddy, event);
                            }
                            else {
                                this.buddy.log("SLACK", "[Webhook Event] Can't find handler for channel_type:", termx_1.danger(event.channel_type));
                            }
                        }
                        else {
                            this.buddy.log("SLACK", "[Webhook Event] Can't find handler for eventType:", termx_1.danger(event.type));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SlackBot;
}());
exports.SlackBot = SlackBot;
var string_1 = require("../utils/string");
//# sourceMappingURL=index.js.map