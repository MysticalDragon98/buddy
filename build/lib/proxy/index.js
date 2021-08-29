"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticProxy = void 0;
var object_1 = require("../utils/object");
var ElasticProxy = /** @class */ (function () {
    function ElasticProxy() {
    }
    ElasticProxy.new = function (options) {
        if (options.recursive)
            return ElasticProxy.newRecursive(options);
        var opts = options;
        return new Proxy(function () { }, {
            get: function (target, prop, receiver) {
                return opts.get && opts.get(prop);
            },
            set: function (target, prop, value, receiver) {
                opts.set && opts.set(prop, value);
                return true;
            },
            apply: function (target, thisArg, args) {
                return opts.apply && opts.apply(args);
            },
            construct: function (target, args) {
                return opts.new && opts.new(args);
            }
        });
    };
    ElasticProxy.newRecursive = function (options) {
        object_1.ObjectUtils.setDefaults(options, { path: [] });
        return ElasticProxy.new({
            recursive: false,
            get: function (prop) {
                return ElasticProxy.new({
                    recursive: true,
                    path: __spreadArray(__spreadArray([], options.path), [prop]),
                    apply: options.apply,
                    new: options.new
                });
            },
            apply: function (args) {
                return options.apply && options.apply(options.path, args);
            },
            new: function (args) {
                return options.new && options.new(options.path, args);
            }
        });
    };
    return ElasticProxy;
}());
exports.ElasticProxy = ElasticProxy;
//# sourceMappingURL=index.js.map