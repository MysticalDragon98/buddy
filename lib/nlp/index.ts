const { containerBootstrap } = require('@nlpjs/core');
import { NlpManager, NerManager } from "node-nlp";


export interface NLPOptions {
    language: "es" | "en";
    trainingSet: { 
        input : { [text: string]: string[] },
        output: { [text: string]: string[] },
        
        entities: {
            [category: string] : {
                [tag: string]: string[]
            }
        }
    };
}

export interface NLPProcessOutput {
    answer?: string;
    intent?: string;
    entities: {
        category: string;
        tag: string;
    }[]
}

export class NLP {

    nlp: NlpManager;

    constructor (public buddy: Buddy, public options: NLPOptions) {

    }

    async init () {
        this.nlp = new NlpManager({
            languages: [this.options.language],
            ner: {
                builtins: []
            },
            autoSave: false
        });

        this.buddy.log(NLP, "Training classifier.");

        for (const intent in this.options.trainingSet.input) {
            for (const text of this.options.trainingSet.input[intent]) {
                this.nlp.addDocument(this.options.language, text, intent);
            }
        }

        for (const intent in this.options.trainingSet.output) {
            for (const text of this.options.trainingSet.output[intent]) {
                this.nlp.addAnswer(this.options.language, intent, text);
            }
        }

       for (const category in this.options.trainingSet.entities) {
            for (const entity in this.options.trainingSet.entities[category]) {
                const matches = this.options.trainingSet.entities[category][entity];

                this.nlp.addNamedEntityText(
                    category,
                    entity,
                    [this.options.language],
                    matches
                );
            }
        }

        await this.nlp.train();
        this.buddy.log(NLP, "Classifier trained.");
    }

    async process (input: string): Promise<NLPProcessOutput> {
        const output = await this.nlp.process(this.options.language, input);

        return {
            ...output,
            entities: output.entities.map(entity => ({
                category: entity.entity,
                tag: entity.option
            }))
        }
    }

    async entities (input: string) {
        return await this.nlp.extractEntities(input, this.options.language);
    }

}

import { Buddy } from "../..";