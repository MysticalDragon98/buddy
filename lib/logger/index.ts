import { Buddy } from "../..";
import { cold, customLog, highlight, log, sequencialColor, timestamp } from "termx";
import { bold } from "chalk";
import { ObjectUtils } from "../utils/object";
import { StringUtils } from "../utils/string";
import { inspect } from "util";

export interface LogDescriptor {
    class?: string;
    data?: string[];
}

export interface LoggerOptions {
    enabled?: boolean;
    
    hidden?: LogDescriptor[];
    
    pipe?: {
        name: string;
        filter: LogDescriptor
    }[];

    speak?: LogDescriptor[];
}

export function verboseLog (name: string) {
    return customLog(sequencialColor(), bold(name));
}

export class Logger {

    verboseLogs: any = {};

    constructor (public buddy: Buddy, public options: LoggerOptions = {}) {
        ObjectUtils.setDefault(options, 'enabled', true);
        ObjectUtils.setDefault(options, 'hide', []);
        ObjectUtils.setDefault(options, 'pipe', []);
        ObjectUtils.setDefault(options, 'speak', []);
    }

    async init () {
        await this.buddy.storage.mkdir("logs");
    }

    // Mainstream buddy console.log
    log (_class: any, ...data: any) {

        {// Definitions
            var name = typeof _class == "string"? _class : _class.name;
            var log: LogDescriptor = {
                class: name,
                data
            };
        }
        
        {// Break if logs are not enabled or is hidden
            if (!this.options.enabled) return;
            if (this.options.hidden?.find(filter => this.matches(log, filter))) return;
        }

        {// Create log if doesn't exists
            if(!this.verboseLogs[name]) this.verboseLogs[name] = verboseLog(name);
        }

        {// Pipes content to file based on pipe
            const pipes = this.options.pipe.filter(filter => this.matches(log, filter.filter));

            for (const pipe of pipes) {
                const stream = this.buddy.storage.stream(`logs/${pipe.name}.log`);

                stream.write(StringUtils.escapeANSI(
                    timestamp()) +
                    " | " + name + " | " +
                    data.map(s => {
                        if (typeof s === "string")
                            return StringUtils.escapeANSI(s);
                        else 
                            return inspect(s);
                    }).join(" ") + "\n"
                );
            }
        }

        {// Speak based on pipe
            if (this.options.speak?.find(filter => this.matches(log, filter))) {
                this.buddy.speak(data.toString());
            }
        }

        this.verboseLogs[name](...data);
    }

    matches (log: LogDescriptor, filter: LogDescriptor) {
        if (filter.class === "*") return true;
        return filter.class === log.class;
    }

    matchesAll (log: LogDescriptor, filter: LogDescriptor[]) {
        return filter.length == filter.filter(f => this.matches(log, f)).length;
    }

    async bm<T> (promise: Promise<T>, name: string) {
        const now = Date.now();
        if (name) this.buddy.log("LOGGER", "Benchmarking", highlight(name));
        
        const result = await promise;
        const duration = Date.now() - now;

        this.buddy.log("LOGGER", highlight(name), "finished after", cold(duration + "ms"));

        return result;
    }

}