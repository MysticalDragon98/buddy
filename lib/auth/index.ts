import { Buddy } from "../..";

interface AuthTokenData {
    type: 'auth';
    userId: string;
    issuedAt: string;
}

export interface AuthOptions {
    // storageType: StorageType
}

export class Auth {

    constructor (private buddy: Buddy, private options: AuthOptions) {

    }

    createToken (userId: string) {
        return this.buddy.crypto.jwtSign({
            type: 'auth',
            userId,
            issuedAt: new Date().toString()
        });
    }

    user (token: string) {
        const tokenData: AuthTokenData = this.buddy.crypto.jwtVerify(token) as any;

        if (tokenData.type !== "auth") throw new Error("Invalid authentication token type.");

        return tokenData.userId;
    }

    registerUser (name: string, password: string) {
    
    }

}