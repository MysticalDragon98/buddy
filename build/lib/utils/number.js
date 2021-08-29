"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberUtils = void 0;
var NumberUtils = /** @class */ (function () {
    function NumberUtils() {
    }
    NumberUtils.randInt = function (from, to) {
        return Math.floor(Math.random() * (to - from) + from);
    };
    return NumberUtils;
}());
exports.NumberUtils = NumberUtils;
//# sourceMappingURL=number.js.map