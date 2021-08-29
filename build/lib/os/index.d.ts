/// <reference types="node" />
import { Buddy } from "../..";
import { Vector2 } from "../utils/Math";
export declare class OSOptions {
    terminal?: boolean;
    mouse?: boolean;
    keyboard?: boolean;
    ffmpeg?: {
        device: string;
    };
}
export declare class OS {
    buddy: Buddy;
    private options;
    keyboard: any;
    constructor(buddy: Buddy, options: OSOptions);
    init(): Promise<void>;
    private _validateMouse;
    get mouse(): Vector2;
    set mouse(vec: Vector2);
    moveMouse(val: Vector2, steps?: number): Promise<void>;
    screenSize(): Vector2;
    screenshot(position?: Vector2, size?: Vector2): any;
    playAudio(audio: Buffer, format?: string): Promise<void>;
    onScreenFrame(evt: (frame: any) => any): void;
}
