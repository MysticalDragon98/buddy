"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = exports.sha256 = exports.decrypt = exports.encrypt = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var iv = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
var encrypt = function (text, secretKey) {
    secretKey = keyFromPassword(secretKey);
    var cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    var encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted;
};
exports.encrypt = encrypt;
var decrypt = function (hash, secretKey) {
    secretKey = keyFromPassword(secretKey);
    var decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    var decrpyted = Buffer.concat([decipher.update(hash), decipher.final()]);
    return decrpyted;
};
exports.decrypt = decrypt;
function sha256(data) {
    if (data instanceof Buffer)
        return crypto.createHash('sha256').update(data).digest('hex');
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}
exports.sha256 = sha256;
// Uses the PBKDF2 algorithm to stretch the string 's' to an arbitrary size,
// in a way that is completely deterministic yet impossible to guess without
// knowing the original string
function stretchString(s, outputLength) {
    var salt = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return crypto.pbkdf2Sync(s, salt, 100000, outputLength, 'sha512');
}
// Stretches the password in order to generate a key (for encrypting)
// and a large salt (for hashing)
function keyFromPassword(password) {
    // We need 32 bytes for the key
    var keyPlusHashingSalt = stretchString(password, 32 + 16);
    return keyPlusHashingSalt.slice(0, 32);
}
var Crypto = /** @class */ (function () {
    function Crypto(buddy) {
        this.buddy = buddy;
    }
    Crypto.prototype.encrypt = function (data) {
        return exports.encrypt(JSON.stringify(data), this.buddy.options.password);
    };
    Crypto.prototype.decrypt = function (data) {
        return JSON.parse(exports.decrypt(data, this.buddy.options.password).toString());
    };
    Crypto.prototype.sha256 = function (data) {
        return sha256(data);
    };
    Crypto.prototype.jwtSign = function (data) {
        return jsonwebtoken_1.sign(data, this.buddy.options.password);
    };
    Crypto.prototype.jwtVerify = function (token) {
        return jsonwebtoken_1.verify(token, this.buddy.options.password);
    };
    return Crypto;
}());
exports.Crypto = Crypto;
//# sourceMappingURL=index.js.map