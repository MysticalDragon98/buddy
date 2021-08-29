"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTT = void 0;
var express = require('express');
var bodyParser = require('body-parser');
var Aedes = require('aedes');
var net = __importStar(require("net"));
var termx_1 = require("termx");
var object_1 = require("../utils/object");
var MQTT = /** @class */ (function () {
    function MQTT(buddy, options) {
        this.buddy = buddy;
        this.options = options;
        this._lastPort = 1883;
        object_1.ObjectUtils.setDefaults(options, {
            broker: []
        });
    }
    MQTT.prototype.init = function () {
        for (var _i = 0, _a = this.options.brokers; _i < _a.length; _i++) {
            var broker = _a[_i];
            this.setupBroker(broker);
        }
    };
    MQTT.prototype.setupBroker = function (brokerOptions) {
        var _this = this;
        var port = brokerOptions.port || this._lastPort++;
        object_1.ObjectUtils.setDefaults(brokerOptions, {
            protocol: 'tcp',
            host: '127.0.0.1',
            port: port,
            endpoints: {}
        });
        var aedes = Aedes();
        net.createServer(aedes.handle).listen(port);
        this.buddy.log("MQTT", "MQTT broker running at port", termx_1.highlight(port.toString()));
        aedes.on('client', function () { return _this.buddy.log("MQTT", termx_1.highlight("[:" + port + "]"), "Client received."); });
    };
    return MQTT;
}());
exports.MQTT = MQTT;
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
//# sourceMappingURL=index.js.map