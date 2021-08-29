import { Buddy } from "../..";
export interface UneteOptions {
    port?: number;
    endpoints?: any;
    connections?: {
        [name: string]: string;
    };
}
export declare class Unete {
    private buddy;
    private options;
    private server;
    connections: {
        [key: string]: any;
    };
    constructor(buddy: Buddy, options: UneteOptions);
    init(): Promise<void>;
    generateInterfacesForConnection(name: string): Promise<void>;
}
