import { cold } from "termx";
import { OS } from ".";
const Robot = require("robotjs");

export class OS_Key {
    
    constructor (private os: OS, public name: string) {

    }

    tap () {
        this.os.buddy.log("OS-DEBUG", cold("press"), this.name)
        Robot.keyTap(this.name);
    }

}