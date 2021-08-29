export declare class Storage {
    private buddy;
    private _streams;
    json: any;
    env: any;
    constructor(buddy: Buddy);
    init(): Promise<void>;
    write(name: string, data: any): Promise<void>;
    writeSync(name: string, data: any): void;
    read(name: string, defaultValue?: any): Promise<any>;
    readSync(name: string, defaultValue?: any): any;
    mkdir(path: string): Promise<void>;
    stream(path: string): any;
}
import { Buddy } from "../../index";
