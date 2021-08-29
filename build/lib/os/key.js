"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OS_Key = void 0;
var termx_1 = require("termx");
var Robot = require("robotjs");
var OS_Key = /** @class */ (function () {
    function OS_Key(os, name) {
        this.os = os;
        this.name = name;
    }
    OS_Key.prototype.tap = function () {
        this.os.buddy.log("OS-DEBUG", termx_1.cold("press"), this.name);
        Robot.keyTap(this.name);
    };
    return OS_Key;
}());
exports.OS_Key = OS_Key;
//# sourceMappingURL=key.js.map