import { Buddy } from "../..";
import { createConnection, Connection, Model } from "mongoose";
import { ElasticProxy } from "../proxy";

export interface MongoOptions {
    connections: { [name: string]: string };
    models: { [name: string]: any };
}

export class Mongo {

    public clients: { [name: string]: MongoClient } = {};
    public db: any;

    constructor (public buddy: Buddy, public options: MongoOptions) {
        this.db = ElasticProxy.new({

            recursive: false,

            get: (path: string) => {
                return this.client(path).proxy();
            }

        });
    }

    client (name: string) {
        if (this.clients[name]) return this.clients[name];
        
        if (!this.options.connections[name]) {
            this.buddy.log("MONGO", `Client "${name}" not found.`);

            throw new Error(`MongoDB: Client "${name}" not found.`);
        }

        this.clients[name] = new MongoClient(this, name, createConnection(this.options.connections[name], {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }));
        return this.clients[name];
    }

}

class MongoClient {

    private models: { [name: string]: Model<any> } = {};

    constructor (private mongo: Mongo, public name: string, private conn: Connection) {
        
    }

    model (name: string) {
        if (this.models[name]) return this.models[name];

        this.models[name] = this.conn.model(name, this.mongo.options.models[name]);

        return this.models[name];
    }

    proxy () {
        return ElasticProxy.new({
            recursive: false,

            get: (path: string) => {
                if (path === "$") {
                    return async (cmd: any) => {
                        await (this.conn as any).$initialConnection;
                        return await this.conn.db.executeDbAdminCommand(cmd)
                    }
                }

                return this.model(path);
            }

        });
    }

}