/// <reference types="node" />
import { Buddy } from "../..";
export interface GCloudOptions {
    credentials: any;
    tts?: {
        lang?: "en-US" | "es-ES" | "zh-CN";
        gender?: "NEUTRAL" | "MALE" | "FEMALE";
        encoding?: "MP3";
    };
}
export declare class GCloud {
    private buddy;
    options: GCloudOptions;
    private ttsClient;
    constructor(buddy: Buddy, options: GCloudOptions);
    tts(text: string): Promise<Buffer>;
    speak(text: string | string[]): Promise<void>;
}
