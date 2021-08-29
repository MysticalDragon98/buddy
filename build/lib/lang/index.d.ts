import { Buddy } from "../..";
export interface LangOptions {
    default: string;
    current?: string;
    dict: {
        [lang: string]: {
            [word: string]: string | string[];
        };
    };
}
export declare class Lang {
    private buddy;
    private options;
    current: string;
    constructor(buddy: Buddy, options: LangOptions);
    get(name: string, data?: any): any;
}
