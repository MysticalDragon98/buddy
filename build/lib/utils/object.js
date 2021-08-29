"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUtils = void 0;
var ObjectUtils = /** @class */ (function () {
    function ObjectUtils() {
    }
    ObjectUtils.setDefault = function (object, property, defaultValue) {
        if (object[property] === undefined)
            object[property] = defaultValue;
    };
    ObjectUtils.setDefaults = function (object, properties) {
        for (var key in properties)
            ObjectUtils.setDefault(object, key, properties[key]);
    };
    ObjectUtils.fromArray = function (array, filter) {
        var resultObject = {};
        var i = 0;
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var item = array_1[_i];
            var name_1 = filter(item, i++);
            resultObject[name_1] = resultObject[name_1] || [];
            resultObject[name_1].push(item);
        }
        return resultObject;
    };
    ObjectUtils.map = function (obj, map) {
        var resultObject = {};
        for (var key in obj) {
            resultObject[key] = map(key, obj[key]);
        }
        return resultObject;
    };
    ObjectUtils.toArray = function (obj) {
        var arr = [];
        for (var i in obj)
            arr.push({
                key: i,
                value: obj[i]
            });
        return arr;
    };
    return ObjectUtils;
}());
exports.ObjectUtils = ObjectUtils;
//# sourceMappingURL=object.js.map