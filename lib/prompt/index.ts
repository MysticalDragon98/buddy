import { Buddy } from "../..";
import * as Inquirer from "inquirer";

export class Prompt {
    
    prompt: any;

    constructor (private buddy: Buddy) {
        this.prompt = Inquirer.createPromptModule();
    }

    async choice (message: string, options: string[]) {
        const { answer } = await this.prompt([{
            type: "list",
            name: "answer",
            message,
            choices: options
        }]);

        return answer;
    }

    async text (message: string) {
        const { answer } = await this.prompt([{
            type: "input",
            name: "answer",
            message
        }]);

        return answer;
    }

}