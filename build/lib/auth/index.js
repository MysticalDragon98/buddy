"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
var Auth = /** @class */ (function () {
    function Auth(buddy, options) {
        this.buddy = buddy;
        this.options = options;
    }
    Auth.prototype.createToken = function (userId) {
        return this.buddy.crypto.jwtSign({
            type: 'auth',
            userId: userId,
            issuedAt: new Date().toString()
        });
    };
    Auth.prototype.user = function (token) {
        var tokenData = this.buddy.crypto.jwtVerify(token);
        if (tokenData.type !== "auth")
            throw new Error("Invalid authentication token type.");
        return tokenData.userId;
    };
    Auth.prototype.registerUser = function (name, password) {
    };
    return Auth;
}());
exports.Auth = Auth;
//# sourceMappingURL=index.js.map