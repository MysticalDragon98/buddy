import { Buddy } from "../..";
export interface AuthOptions {
}
export declare class Auth {
    private buddy;
    private options;
    constructor(buddy: Buddy, options: AuthOptions);
    createToken(userId: string): string;
    user(token: string): string;
    registerUser(name: string, password: string): void;
}
