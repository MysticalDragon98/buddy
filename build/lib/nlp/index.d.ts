import { NlpManager } from "node-nlp";
export interface NLPOptions {
    language: "es" | "en";
    trainingSet: {
        input: {
            [text: string]: string[];
        };
        output: {
            [text: string]: string[];
        };
        entities: {
            [category: string]: {
                [tag: string]: string[];
            };
        };
    };
}
export interface NLPProcessOutput {
    answer?: string;
    intent?: string;
    entities: {
        category: string;
        tag: string;
    }[];
}
export declare class NLP {
    buddy: Buddy;
    options: NLPOptions;
    nlp: NlpManager;
    constructor(buddy: Buddy, options: NLPOptions);
    init(): Promise<void>;
    process(input: string): Promise<NLPProcessOutput>;
    entities(input: string): Promise<any>;
}
import { Buddy } from "../..";
