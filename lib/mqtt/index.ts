const express = require('express');
const bodyParser = require('body-parser');
const Aedes = require('aedes');

import * as net from "net";

import { highlight, danger } from 'termx';
import { Buddy } from '../..';
import { ObjectUtils } from '../utils/object';

export interface MQTTbrokerOptions {
    protocol?: 'tcp' | 'ssl' | 'ws' | 'wss' | 'mqtt';
    host?: string;
    port?: number;

    ssl?: {
        key: string,
        cert: string
    },

    endpoints?: any
}

export interface MQTTOptions {
    brokers?: MQTTbrokerOptions[];
}

export class MQTT {

    private _lastPort = 1883;

    constructor (private buddy: Buddy, private options: MQTTOptions) {
        ObjectUtils.setDefaults(options, {
            broker: []
        });
    }

    init () {
        for (const broker of this.options.brokers!) {
            this.setupBroker(broker)
        }
    }

    setupBroker (brokerOptions: MQTTbrokerOptions) {
        const port = brokerOptions.port || this._lastPort++;
        
        ObjectUtils.setDefaults(brokerOptions, {
            protocol: 'tcp',
            host: '127.0.0.1',
            port,
            endpoints: {}
        });

        const aedes = Aedes();
        
        net.createServer(aedes.handle).listen(port);

        this.buddy.log("MQTT", "MQTT broker running at port", highlight(port.toString()));

        aedes.on('client', () => this.buddy.log("MQTT", highlight(`[:${port}]`), "Client received."));
    }

}

/*class HTTPbroker {

    app: any;
    broker: http.broker | https.broker;

    constructor (private buddy: Buddy, public options: HTTPOptions) {
        ObjectUtils.setDefaults(this.options, {
            responseType: "object",
            interface: {}
        });

        this.app = express();
        this.broker = options.ssl? https.createbroker({
            key : readFileSync(resolve(process.cwd(), options.ssl.key)),
            cert: readFileSync(resolve(process.cwd(), options.ssl.cert)),
            ca  : readFileSync(resolve(process.cwd(), options.ssl.ca))
        }, this.app) : http.createbroker(this.app);

        

        this.app.use(bodyParser.urlencoded())
        this.app.use(bodyParser.json({
            verify: (req, res, buf) => {
                (req as any).rawBody = buf
            }
        }));

        this.app.use(async (rq, rs) => {
            //? Parsing
                const { url, method } = rq;
                const URL = parse(url).pathname;
                const path = URL?.split('/').slice(1) || [];
                const body = method === "GET"? rq.query : rq.body;
        
                this.buddy.log("HTTP-REQ", `(${danger(rq.connection.remoteAddress)}) ${highlight(method)} - ${URL}`, body)
        
                let fn: any = this.options.endpoints;
                
            //? Routing
                for(const route of path) {
                    fn = FunctionUtils.getObjectPropertyIgnoreCase(fn, route)
        
                    if(!fn) return rs.status(404).end("Method " + URL + " not found.");
                }
                
                if(typeof fn !== "function") return rs.status(404).end("Method " + URL + " not found.");
        
            //? Executing
                const params = fn.params || FunctionUtils.getParamNames(fn);
                const args = [];
                
                if(params.includes("$request")) body.$request = rq;
        
                for(const i in body) body[i.replace(/[^a-z0-9]/gi, '').toLowerCase()] = body[i]; //? Ignore param case
                for(const param of params) {
                    try {
                        var res = JSON.parse(body[param.toLowerCase()]);
        
                        args.push(res);
                    } catch (exc) {
                        args.push(body[param.toLowerCase()]);
                    }
                }
        
                rs.header('Content-Type', 'application/json');
        
                try {
                    var result = await fn(...args);
        
                    if(result?.$raw) {
                        if(result.ctype) rs.header("Content-Type", result.ctype);
                        return rs.status(200).end(result.$raw)
                    }
                    else if (!Array.isArray(result) && isObservable(result)) result = await result.pipe(toArray()).toPromise();
                    
                    if (this.options.responseType === "object") rs.status(200).json({ result });
                    else if (this.options.responseType === "raw") rs.status(200).json(result);
                } catch (exc) {
                    this.buddy.log("HTTP-REQ", danger(exc.message || exc));
                    if (this.options.responseType === "object") rs.status(500).json({ message: exc.message })
                    else if (this.options.responseType === "raw") rs.status(500).json(exc.message);  
                    
                }
        });

    }

    async init () {
        let appsToListen = [{
            app: this.app,
            port: this.options.port
        }];

        for (const staticPath in this.options.interfaces) {
            const app = express();
            const port = this.options.interfaces[staticPath];

            app.use(express.static(staticPath))
            appsToListen.push({ app, port })
        }

        return await Promise.all(
            appsToListen.map(app => new Promise ((done, err) => {
                app.app.listen(app.port, () => {
                    this.buddy.log(HTTP, "HTTP broker running at port:", highlight(app.port))
                    done(null);
                })
        })))
    }

}*/