import { Buddy } from "../..";
export declare class Prompt {
    private buddy;
    prompt: any;
    constructor(buddy: Buddy);
    choice(message: string, options: string[]): Promise<any>;
    text(message: string): Promise<any>;
}
