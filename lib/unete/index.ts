import { Buddy } from "../..";
import { Server, Socket } from "@unete/io";
import { cold, highlight } from "termx";
import { ObjectUtils } from "../utils/object";
import { FileSystem } from "../utils/FileSystem";

export interface UneteOptions {

    port?: number;
    endpoints?: any;
    connections?: {
        [name: string]: string
    }
}

export class Unete {


    private server: Server;
    public connections: { [key: string]: any } = {};

    constructor (private buddy: Buddy, private options: UneteOptions) {
        ObjectUtils.setDefaults(options, {
            endpoints: {},
            connections: {}
        })
        if (options.port) {
            this.server = new Server(options.endpoints);   
        }

        for (const name in options.connections) this.connections[name] = Socket(options.connections[name]);
    }

    async init () {
        if (this.options.port) {
            this.server.listen(this.options.port);
            this.buddy.log("UNETE", "Server running at port", highlight(this.options.port.toString()));
        }

        this.buddy.storage.mkdir("unete");
        this.buddy.storage.mkdir("unete/interfaces");

        for (const name in this.connections) {
            await this.generateInterfacesForConnection(name);
        }
    }

    async generateInterfacesForConnection (name: string) {
        this.buddy.log("UNETE", "Generating interfaces for connection", cold(name), "with url", highlight(this.options.connections[name]));
        const conn = this.connections[name];
        const publicEndpoints = await conn.$public();
        const collections = "";
        
        const text = `export default interface UneteInterface_${name} ${endpointToSchema(publicEndpoints, "    ")}`;
    
        await FileSystem.write(this.buddy.path("unete/interfaces/" + name + ".ts"), text);
        this.buddy.log("UNETE", "Interfaces for connection", cold(name), "with url", highlight(this.options.connections[name]), "generated");
    }

}

function endpointToSchema (endpoint: any, pre="") {
    let fields = [];
    if (Object.keys(endpoint).toString() === "arguments") return "(" + endpoint.arguments.join(", ") + ") => any;";

    for (const name in endpoint) {
        fields.push(`${name}: ` + endpointToSchema(endpoint[name], pre + "    "))
    };

    return "{\n" + pre + fields.join("\n" + pre) + "\n" + pre.substring(0, pre.length - 4) + "};\n";
}