import { WebClient } from "@slack/web-api";
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
    };
}
export declare class SlackBot {
    private buddy;
    options: SlackBotOptions;
    bot: WebClient;
    nameCache: any;
    constructor(buddy: Buddy, options: SlackBotOptions);
    chat(userId: string, text: string, templateData?: any): Promise<import("@slack/web-api").ChatPostMessageResponse>;
    conversations(): Promise<import("@slack/web-api").ConversationsListResponse>;
    users(): Promise<import("@slack/web-api/dist/response/UsersListResponse").Member[] | undefined>;
    userId(name: string): Promise<string | null | undefined>;
    handleWebhook(eventId: string, event: WebhookEvent): Promise<void>;
}
import { Buddy } from "../..";
