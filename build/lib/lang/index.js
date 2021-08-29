"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lang = void 0;
var number_1 = require("../utils/number");
var object_1 = require("../utils/object");
var string_1 = require("../utils/string");
var Lang = /** @class */ (function () {
    function Lang(buddy, options) {
        this.buddy = buddy;
        this.options = options;
        object_1.ObjectUtils.setDefaults(options, {
            current: options.default
        });
        this.current = options.current;
    }
    Lang.prototype.get = function (name, data) {
        var phrase = this.options.dict[this.options.current][name] || this.options.dict[this.options.default][name];
        if (!phrase)
            return null;
        if (Array.isArray(phrase))
            phrase = phrase[number_1.NumberUtils.randInt(0, phrase.length)];
        if (data)
            phrase = string_1.StringUtils.template(phrase, data);
        return phrase;
    };
    return Lang;
}());
exports.Lang = Lang;
//# sourceMappingURL=index.js.map