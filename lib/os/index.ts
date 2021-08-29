import { Buddy } from "../..";
import { ObjectUtils } from "../utils/object";
import { Vector2, Maths } from "../utils/Math";
import { cold, danger, highlight, warning } from "termx";
import { ElasticProxy } from "../proxy";
import { OS_Key } from "./key";
import { FileSystem } from "../utils/FileSystem";
import * as FFMpeg from "fluent-ffmpeg";
import { platform } from "os";

const Audic = require("audic");
const Robot = require("robotjs");

export class OSOptions {

    terminal?: boolean;
    mouse?: boolean;
    keyboard?: boolean;

    ffmpeg?: {
        device: string;
    }

}

export class OS {

    keyboard: any;

    constructor (public buddy: Buddy, private options: OSOptions) {
        ObjectUtils.setDefaults(options, {
            terminal: false,
            mouse: false,
            keyboard: false,

            ffmpeg: {}
        });

        ObjectUtils.setDefaults(options.ffmpeg, {
            device: "/dev/video0"
        })

        this.keyboard = ElasticProxy.new({
            recursive: false,

            get: (path: string) => {
                return new OS_Key(this, path);
            }
        });
    }
    
    async init () {
        await this.buddy.storage.mkdir("temp");
        await this.buddy.storage.mkdir("temp/audio");
    }

    private  _validateMouse () {
        if (!this.options.mouse) throw new Error("The mouse feature is disabled in buddy os options.");
    }

    get mouse () {
        this._validateMouse();

        const pos = Robot.getMousePos();
        this.buddy.log("OS-DEBUG", cold("get"), "mouse", "=>", warning(pos.x.toString()), ":", warning(pos.y.toString()));

        return new Vector2(pos.x, pos.y, (prev: Vector2, next: Vector2) => {
            this.mouse = next;
        });
    }

    set mouse (vec: Vector2) {
        this._validateMouse();
        this.buddy.log("OS-DEBUG", cold("set"), "mouse", "=>", warning(vec.x.toString()), ":", warning(vec.y.toString()));
        
        Robot.moveMouse(vec.x, vec.y);
    }

    async moveMouse (val: Vector2, steps: number = 5) {
        this._validateMouse();
        this.buddy.log("OS-DEBUG", cold("move"), "mouse", "=>", warning(val.x.toString()), ":", warning(val.y.toString()));

        const currentPos = this.mouse;
        const diff = currentPos.minus(val);

        for (let i=1;i<=steps;i++) {
            Robot.moveMouse(currentPos.x - (i * (diff.x/steps)), currentPos.y - (i * (diff.y/steps)));
        }
    }

    screenSize () {
        const { width, height } = Robot.getScreenSize();

        return new Vector2(width, height);
    }

    screenshot (position?: Vector2, size?: Vector2) {
        if (position && size) {
            return Robot.screen.capture(position.x, position.y, size.x, size.y);
        }

        return Robot.screen.capture();
    }

    async playAudio (audio: Buffer, format?: string) {
        const path = this.buddy.path("temp/audio/" + Date.now() + "-" + Math.random().toString().substring(2) + "." + format);
        
        await this.buddy.log("OS-DEBUG", "Playing", highlight(path))
        await FileSystem.write(path, audio);
        try {
            const audio = new Audic(path);
            await audio.play();
        } catch (exc) {
            await this.buddy.log("OS-DEBUG", "Could not play", highlight(path) +":", danger(exc.message));
        }

        while (true) {
            await new Promise(d => setTimeout(d, 50));
            try {
                await FileSystem.remove(path);
                break;
            } catch (exc) {
                if (exc.code === "EBUSY") continue;

                throw exc;
            }
        }
    }

    onScreenFrame(evt: (frame: any) => any) {
    }

}