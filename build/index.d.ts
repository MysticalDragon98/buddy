import { Crypto } from "./lib/crypto";
import { HTTP, HTTPOptions } from "./lib/http";
import { Logger, LoggerOptions } from "./lib/logger";
import { Prompt } from "./lib/prompt";
import { Storage } from "./lib/storage";
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
export declare class Buddy {
    options: BuddyOptions;
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
    private _registry;
    constructor(options: BuddyOptions);
    init(cb?: any): Promise<void>;
    speak(text: string): Promise<void>;
    log(_class: any, ...data: any): void;
    path(name: string): string;
    setRegistry(name: string, data: any): void;
    getRegistry(name: string): any;
}
export {};
