import { Buddy } from "../..";
import { Connection, Model } from "mongoose";
export interface MongoOptions {
    connections: {
        [name: string]: string;
    };
    models: {
        [name: string]: any;
    };
}
export declare class Mongo {
    buddy: Buddy;
    options: MongoOptions;
    clients: {
        [name: string]: MongoClient;
    };
    db: any;
    constructor(buddy: Buddy, options: MongoOptions);
    client(name: string): MongoClient;
}
declare class MongoClient {
    private mongo;
    name: string;
    private conn;
    private models;
    constructor(mongo: Mongo, name: string, conn: Connection);
    model(name: string): Model<any, {}, {}>;
    proxy(): any;
}
export {};
