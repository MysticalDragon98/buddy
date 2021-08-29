/// <reference types="node" />
export declare const encrypt: (text: any, secretKey: any) => Buffer;
export declare const decrypt: (hash: any, secretKey: any) => Buffer;
export declare function sha256(data: any): any;
export declare class Crypto {
    private buddy;
    constructor(buddy: Buddy);
    encrypt(data: any): Buffer;
    decrypt(data: any): any;
    sha256(data: any): any;
    jwtSign(data: any): string;
    jwtVerify(token: string): string | import("jsonwebtoken").JwtPayload;
}
import { Buddy } from "../../index";
