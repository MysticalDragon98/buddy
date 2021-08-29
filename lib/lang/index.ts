import { Buddy } from "../..";
import { NumberUtils } from "../utils/number";
import { ObjectUtils } from "../utils/object";
import { StringUtils } from "../utils/string";

export interface LangOptions {
    default: string;
    current?: string;
    dict: { [lang: string]: {
        [word: string]: string | string[] 
    }};
}

export class Lang {

    current: string;

    constructor (private buddy: Buddy, private options: LangOptions) {
        ObjectUtils.setDefaults(options, {
            current: options.default
        });

        this.current = options.current;
    }

    get (name: string, data?: any) {
        let phrase = this.options.dict[this.options.current][name] || this.options.dict[this.options.default][name];

        if (!phrase) return null;
        if (Array.isArray(phrase)) phrase = phrase[NumberUtils.randInt(0, phrase.length)];
        if (data) phrase = StringUtils.template(phrase, data);

        return phrase;
    }

}