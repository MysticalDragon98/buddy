import { WebClient } from "@slack/web-api";
import { danger } from "termx";

export interface WebhookEvent {
    type: "message";
    text: string;
    user: string;
    channel: string;
    channel_type: "im";
    
    bot_id?: string;
}

export interface SlackBotOptions {
    token: string;
    events?: {
        onDMReceived: (buddy: Buddy, event: WebhookEvent) => any;
    }
}

export class SlackBot {

    bot: WebClient;
    public nameCache: any;

    constructor (private buddy: Buddy, public options: SlackBotOptions) {
        this.bot = new WebClient(options.token);
    
        buddy.log("SLACK", "Bot initialized.")
    }

    async chat (userId: string, text: string, templateData?: any) {
        return await this.bot.chat.postMessage({
            channel: userId,
            text: templateData?
                    StringUtils.template(text, templateData) :
                    text
        });
    }

    async conversations () {
        return await this.bot.conversations.list();
    }

    async users () {
        return (await this.bot.users.list()).members;
    }

    async userId (name: string) {
        const users = await this.users();
        const user = users.find(u => u.name == name);

        return user? user.id : null;
    }

    async handleWebhook (eventId: string, event: WebhookEvent) {
        if (event.bot_id) return;
        if (await this.buddy.storage.json.webhookEvents[eventId]()) return;

        if (event.type == "message") {
            if (event.channel_type == "im") {
                this.options.events?.onDMReceived(this.buddy, event);
            } else {
                this.buddy.log("SLACK", "[Webhook Event] Can't find handler for channel_type:", danger(event.channel_type))
            }
        } else {
            this.buddy.log("SLACK", "[Webhook Event] Can't find handler for eventType:", danger(event.type))
        }
    }
}

import { Buddy } from "../..";
import { StringUtils } from "../utils/string";
