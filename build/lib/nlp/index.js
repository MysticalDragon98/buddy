"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.NLP = void 0;
var containerBootstrap = require('@nlpjs/core').containerBootstrap;
var node_nlp_1 = require("node-nlp");
var NLP = /** @class */ (function () {
    function NLP(buddy, options) {
        this.buddy = buddy;
        this.options = options;
    }
    NLP.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var intent, _i, _a, text, intent, _b, _c, text, category, entity, matches;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.nlp = new node_nlp_1.NlpManager({
                            languages: [this.options.language],
                            ner: {
                                builtins: []
                            },
                            autoSave: false
                        });
                        this.buddy.log(NLP, "Training classifier.");
                        for (intent in this.options.trainingSet.input) {
                            for (_i = 0, _a = this.options.trainingSet.input[intent]; _i < _a.length; _i++) {
                                text = _a[_i];
                                this.nlp.addDocument(this.options.language, text, intent);
                            }
                        }
                        for (intent in this.options.trainingSet.output) {
                            for (_b = 0, _c = this.options.trainingSet.output[intent]; _b < _c.length; _b++) {
                                text = _c[_b];
                                this.nlp.addAnswer(this.options.language, intent, text);
                            }
                        }
                        for (category in this.options.trainingSet.entities) {
                            for (entity in this.options.trainingSet.entities[category]) {
                                matches = this.options.trainingSet.entities[category][entity];
                                this.nlp.addNamedEntityText(category, entity, [this.options.language], matches);
                            }
                        }
                        return [4 /*yield*/, this.nlp.train()];
                    case 1:
                        _d.sent();
                        this.buddy.log(NLP, "Classifier trained.");
                        return [2 /*return*/];
                }
            });
        });
    };
    NLP.prototype.process = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nlp.process(this.options.language, input)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, output), { entities: output.entities.map(function (entity) { return ({
                                    category: entity.entity,
                                    tag: entity.option
                                }); }) })];
                }
            });
        });
    };
    NLP.prototype.entities = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nlp.extractEntities(input, this.options.language)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return NLP;
}());
exports.NLP = NLP;
//# sourceMappingURL=index.js.map