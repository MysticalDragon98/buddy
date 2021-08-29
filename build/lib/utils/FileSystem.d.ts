/// <reference types="node" />
export declare class FileSystem {
    static readCSV(path: string, separator?: string): Promise<{}[]>;
    static read(path: string): Promise<any>;
    static write(path: string, data: string | Buffer): Promise<any>;
    static remove(path: string): Promise<any>;
    static readSync(path: string): any;
    static writeSync(path: string, data: string): any;
    static lookup(dirs: string[], name: string): Promise<any>;
}
