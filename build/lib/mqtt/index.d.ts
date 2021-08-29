import { Buddy } from '../..';
export interface MQTTbrokerOptions {
    protocol?: 'tcp' | 'ssl' | 'ws' | 'wss' | 'mqtt';
    host?: string;
    port?: number;
    ssl?: {
        key: string;
        cert: string;
    };
    endpoints?: any;
}
export interface MQTTOptions {
    brokers?: MQTTbrokerOptions[];
}
export declare class MQTT {
    private buddy;
    private options;
    private _lastPort;
    constructor(buddy: Buddy, options: MQTTOptions);
    init(): void;
    setupBroker(brokerOptions: MQTTbrokerOptions): void;
}
