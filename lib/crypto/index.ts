const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const iv = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

export const encrypt = (text, secretKey) => {
    secretKey = keyFromPassword(secretKey);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted;
};

export const decrypt = (hash, secretKey) => {
    secretKey = keyFromPassword(secretKey);
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(<any>iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(hash), decipher.final()]);

    return decrpyted;
};

export function sha256 (data) {
    if(data instanceof Buffer)
        return crypto.createHash('sha256').update(data).digest('hex')
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
}

// Uses the PBKDF2 algorithm to stretch the string 's' to an arbitrary size,
// in a way that is completely deterministic yet impossible to guess without
// knowing the original string
function stretchString(s, outputLength) {
    var salt = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    return crypto.pbkdf2Sync(s, salt, 100000, outputLength, 'sha512');
}

// Stretches the password in order to generate a key (for encrypting)
// and a large salt (for hashing)
function keyFromPassword(password) {
    // We need 32 bytes for the key
    const keyPlusHashingSalt = stretchString(password, 32 + 16);
    return keyPlusHashingSalt.slice(0, 32);
}


export class Crypto {
    

    constructor (private buddy: Buddy) {

    }

    encrypt (data: any) {
        return encrypt(JSON.stringify(data), this.buddy.options.password);
    }

    decrypt (data: any) {
        return JSON.parse(decrypt(data, this.buddy.options.password).toString());
    }

    sha256 (data: any) {
        return sha256(data);
    }
    
}

import { Buddy } from "../../index";