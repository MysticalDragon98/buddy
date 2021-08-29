import { Buddy } from "../..";
import TextToSpeech from "@google-cloud/text-to-speech";
import { ObjectUtils } from "../utils/object";
import { TextToSpeechClient } from "@google-cloud/text-to-speech/build/src/v1";

export interface GCloudOptions {
    credentials: any;

    tts?: {
        lang?: "en-US" | "es-ES" | "zh-CN";
        gender?: "NEUTRAL" | "MALE" | "FEMALE";
        encoding?: "MP3";
    }
}

export class GCloud {
    
    private ttsClient: TextToSpeechClient;

    constructor (private buddy: Buddy, public options: GCloudOptions) {
        ObjectUtils.setDefaults(options, {
            tts: {}
        });

        ObjectUtils.setDefaults(options.tts, {
            lang: "en-US",
            gender: "NEUTRAL",
            encoding: "MP3"
        });

        this.ttsClient = new TextToSpeech.TextToSpeechClient({
            credentials: this.options.credentials
        });
    }

    async tts (text: string): Promise<Buffer> {
        const [ response ] = await this.ttsClient.synthesizeSpeech({
            input: { text },
            voice: {
                languageCode: this.options.tts.lang,
                ssmlGender: this.options.tts.gender
            },
            audioConfig: { audioEncoding: this.options.tts.encoding }
        });

        return response.audioContent as any as Buffer;
    }

    async speak (text: string | string[]) {
        if (!Array.isArray(text)) text = [text];
        const audios = await Promise.all(text.map((t) => this.tts(t)));

        for (const audio of audios)
            await this.buddy.os.playAudio(audio, this.options.tts.encoding);
    }

}