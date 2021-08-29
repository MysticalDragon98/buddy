"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maths = exports.Vector3 = exports.Vector2 = void 0;
var Vector2 = /** @class */ (function () {
    function Vector2(x, y, listener) {
        this.listener = listener;
        this[0] = x;
        this[1] = y;
    }
    Object.defineProperty(Vector2.prototype, "x", {
        get: function () {
            return this[0];
        },
        set: function (val) {
            this.update(val, this.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        get: function () {
            return this[1];
        },
        set: function (val) {
            this.update(this.x, val);
        },
        enumerable: false,
        configurable: true
    });
    Vector2.prototype.update = function (x, y) {
        this.listener && this.listener(this, new Vector2(x, y));
        this[0] = x;
        this[1] = y;
    };
    Vector2.prototype.minus = function (vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    };
    Vector2.prototype.plus = function (vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
var Vector3 = /** @class */ (function () {
    function Vector3(x, y, z, listener) {
        this.listener = listener;
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }
    Object.defineProperty(Vector3.prototype, "x", {
        get: function () {
            return this[0];
        },
        set: function (val) {
            this.update(val, this.y, this.z);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "y", {
        get: function () {
            return this[1];
        },
        set: function (val) {
            this.update(this.x, val, this.z);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector3.prototype, "z", {
        get: function () {
            return this[2];
        },
        set: function (val) {
            this.update(this.x, this.y, val);
        },
        enumerable: false,
        configurable: true
    });
    Vector3.prototype.abs = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    };
    Vector3.prototype.update = function (x, y, z) {
        this.listener && this.listener(this, new Vector3(x, y, z));
        this[0] = x;
        this[1] = y;
        this[2] = z;
    };
    Vector3.prototype.minus = function (vec) {
        return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    };
    Vector3.prototype.plus = function (vec) {
        return new Vector3(this.x - vec.x, this.y - vec.y, this.z + vec.z);
    };
    Vector3.prototype.toString = function () {
        return "Vector3<" + this.x + ", " + this.y + ", " + this.z + ">";
    };
    return Vector3;
}());
exports.Vector3 = Vector3;
var Maths = /** @class */ (function () {
    function Maths() {
    }
    Maths.max = function (a, b) {
        return a > b ? a : b;
    };
    return Maths;
}());
exports.Maths = Maths;
//# sourceMappingURL=Math.js.map