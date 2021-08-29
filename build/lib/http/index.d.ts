/// <reference types="node" />
import * as http from 'http';
import * as https from 'https';
import { Buddy } from '../..';
export interface HTTPOptions {
    port: any;
    endpoints: any;
    responseType?: "object" | "raw";
    ssl?: {
        key: string;
        cert: string;
        ca: string;
    };
    interfaces?: {
        [folder: string]: number;
    };
}
export declare class HTTP {
    private buddy;
    constructor(buddy: Buddy);
    create(options: HTTPOptions): Promise<HTTPServer>;
}
declare class HTTPServer {
    private buddy;
    options: HTTPOptions;
    app: any;
    server: http.Server | https.Server;
    constructor(buddy: Buddy, options: HTTPOptions);
    init(): Promise<unknown[]>;
}
export {};
