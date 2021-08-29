"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionUtils = void 0;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
var FunctionUtils = /** @class */ (function () {
    function FunctionUtils() {
    }
    FunctionUtils.getParamNames = function (func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    };
    FunctionUtils.getObjectPropertyIgnoreCase = function (obj, prop) {
        prop = prop.toLowerCase();
        for (var i in obj)
            if (i.toLowerCase() === prop)
                return obj[i];
    };
    return FunctionUtils;
}());
exports.FunctionUtils = FunctionUtils;
//# sourceMappingURL=function.js.map