import { join } from "path";
import { Crypto } from "./lib/crypto";
import { Logger, LoggerOptions } from "./lib/logger";
import { Prompt } from "./lib/prompt";
import { Storage } from "./lib/storage";
import { ObjectUtils } from "./lib/utils/object";
import { Web3Buddy, Web3BuddyOptions } from "./lib/web3";

interface BuddyOptions {
    dir: string;
    password: string;

    logger?: LoggerOptions;
    web3?: Web3BuddyOptions;
}

export class Buddy {

    storage: Storage;
    crypto: Crypto;
    web3: Web3Buddy;
    prompt: Prompt;
    logger: Logger;

    constructor (public options: BuddyOptions) {
        ObjectUtils.setDefault(options, 'logger', {});

        this.storage = new Storage(this);
        this.crypto = new Crypto(this);
        this.web3 = new Web3Buddy(this, options.web3);
        this.prompt = new Prompt(this);
        this.logger = new Logger(this, options.logger);
    }
    
    async init () {
        await this.storage.init();
        await this.logger.init();
        await this.web3.init();
    }

    log (_class: any, ...data: any) {
        this.logger.log(_class, ...data);
    }

    path (name: string) {
        return join(this.options.dir, name);
    }

}