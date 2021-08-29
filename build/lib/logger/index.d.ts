import { Buddy } from "../..";
export interface LogDescriptor {
    class?: string;
    data?: string[];
}
export interface LoggerOptions {
    enabled?: boolean;
    hidden?: LogDescriptor[];
    pipe?: {
        name: string;
        filter: LogDescriptor;
    }[];
    speak?: LogDescriptor[];
}
export declare function verboseLog(name: string): (...args: any[]) => number | false;
export declare class Logger {
    buddy: Buddy;
    options: LoggerOptions;
    verboseLogs: any;
    constructor(buddy: Buddy, options?: LoggerOptions);
    init(): Promise<void>;
    log(_class: any, ...data: any): void;
    matches(log: LogDescriptor, filter: LogDescriptor): boolean;
    matchesAll(log: LogDescriptor, filter: LogDescriptor[]): boolean;
    bm<T>(promise: Promise<T>, name: string): Promise<T>;
}
