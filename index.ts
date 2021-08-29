import { join } from "path";
import { Crypto } from "./lib/crypto";
import { HTTP, HTTPOptions } from "./lib/http";
import { Logger, LoggerOptions } from "./lib/logger";
import { Prompt } from "./lib/prompt";
import { Storage } from "./lib/storage";
import { ObjectUtils } from "./lib/utils/object";
import { Web3Buddy, Web3BuddyOptions } from "./lib/web3";
import { SlackBotOptions, SlackBot } from "./lib/slackbot";
import { NLP, NLPOptions } from "./lib/nlp";
import { SSH, SSHOptions } from "./lib/ssh";
import { Lang, LangOptions } from "./lib/lang";
import { Mongo, MongoOptions } from "./lib/mongo";
import { OS, OSOptions } from "./lib/os";
import { GCloud, GCloudOptions } from "./lib/gcloud";
import { Unete, UneteOptions } from "./lib/unete";
import { Auth, AuthOptions } from "./lib/auth";
import { MQTT, MQTTOptions } from "./lib/mqtt";

interface BuddyOptions {
    dir: string;
    password: string;

    http?: HTTPOptions;
    logger?: LoggerOptions;
    web3?: Web3BuddyOptions;
    slackbot?: SlackBotOptions;
    nlp?: NLPOptions;
    ssh?: SSHOptions;
    lang?: LangOptions;
    mongo?: MongoOptions;
    os?: OSOptions;

    gcloud?: GCloudOptions;
    unete?: UneteOptions;
    auth?: AuthOptions;
    mqtt?: MQTTOptions;
}

export class Buddy {

    storage: Storage;
    crypto: Crypto;
    prompt: Prompt;
    logger: Logger;
    http: HTTP;
    web3?: Web3Buddy;
    slackbot?: SlackBot;
    nlp?: NLP;
    ssh?: SSH;
    lang?: Lang;
    mongo?: Mongo;
    os?: OS;
    gcloud?: GCloud;
    unete?: Unete;
    auth?: Auth;
    mqtt?: MQTT;

    private _registry: any = {};

    constructor (public options: BuddyOptions) {
        ObjectUtils.setDefault(options, 'logger', {});

        this.storage = new Storage(this);
        this.crypto = new Crypto(this);
        this.prompt = new Prompt(this);
        this.logger = new Logger(this, options.logger);
        
        this.os = options.os && new OS(this, options.os);

        this.http = options.http && new HTTP(this);
        this.nlp = options.nlp && new NLP(this, options.nlp);

        this.web3     = options.web3 && new Web3Buddy(this, options.web3);
        this.slackbot = options.slackbot && new SlackBot(this, options.slackbot);
        this.ssh      = options.ssh && new SSH(this, options.ssh)
        this.lang     = options.lang && new Lang(this, options.lang);
        this.mongo    = options.mongo && new Mongo(this, options.mongo);
        this.gcloud   = options.gcloud && new GCloud(this, options.gcloud);
        this.unete    = options.unete && new Unete(this, options.unete);
        this.auth     = options.auth && new Auth(this, options.auth);
        this.mqtt     = options.mqtt && new MQTT(this, options.mqtt);
    }
    
    async init (cb?: any) {
        await this.storage.mkdir(".");
        await this.storage.init();
        await this.logger.init();
        await this.web3?.init();
        await this.nlp?.init();
        await this.ssh?.init();

        await this.http?.create(this.options.http);
        await this.os?.init();

        await this.unete?.init();
        await this.mqtt?.init();

        if (cb) await cb(this);
    }

    async speak (text: string) {
        if (!this.gcloud) return;

        await this.gcloud.speak(text);
    }

    log (_class: any, ...data: any) {
        this.logger.log(_class, ...data);
    }

    path (name: string) {
        return join(this.options.dir, name);
    }

    setRegistry (name: string, data: any) {
        this._registry[name] = data;
    }

    getRegistry (name: string) {
        return this._registry[name];
    }

}