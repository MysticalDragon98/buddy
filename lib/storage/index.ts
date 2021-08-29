const fs = require("fs/promises");
const { createWriteStream, readFileSync, writeFileSync } = require('fs');
import { JSONStorage } from "./json-storage";

interface StorageOptions {
    file: string;
}

export class Storage {
    
    private _streams: { [key: string]: WritableStream } = {};
    public json: any;
    public env: any;

    constructor (private buddy: Buddy) {

    }
    
    async init () {
        await this.mkdir("storage");
        await this.mkdir("storage/json");

        this.json = ElasticProxy.new({
            recursive: false,

            get: (path)  => {
                return new JSONStorage(this, "storage/json/" + path + ".json").proxy;
            }
        });

        this.env = this.json.env.proxy;
    }

    async write (name: string, data: any) {
        await fs.writeFile(this.buddy.path(name), this.buddy.crypto.encrypt(data));
    }

    writeSync (name: string, data: any) {
        writeFileSync(this.buddy.path(name), this.buddy.crypto.encrypt(data));
    }

    async read (name: string, defaultValue?: any) {
        try {
            return this.buddy.crypto.decrypt(await fs.readFile(this.buddy.path(name)));
        } catch (exc) {
            if (exc.code === "ENOENT" && defaultValue) {
                await this.write(name, defaultValue);
                return defaultValue;
            }
            throw exc;
        }
    }

    readSync (name: string, defaultValue?: any) {
        try {
            return this.buddy.crypto.decrypt(readFileSync(this.buddy.path(name)));
        } catch (exc) {
            if (exc.code === "ENOENT" && defaultValue) {
                this.writeSync(name, defaultValue);
                return defaultValue;
            }
            throw exc;
        }
    }
    
    async mkdir (path: string) {
        try {
            await fs.mkdir(this.buddy.path(path))
        } catch (exc) {
            if (exc.code !== 'EEXIST') throw exc;
        }
    }

    stream (path: string) {
        const file = this._streams[path];

        if (file) return file;

        return this._streams[path] = createWriteStream(this.buddy.path(path), {
            flags: 'a+'
        })
    }
}

import { highlight } from "termx";
import { inspect } from "util";
import { Buddy } from "../../index";
import { ElasticProxy } from "../proxy";
