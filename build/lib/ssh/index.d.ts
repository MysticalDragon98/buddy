import { Buddy } from "../..";
import { NodeSSH } from "node-ssh";
export declare class SSHOptions {
    remote?: {
        [name: string]: string;
    };
    sshKeys?: {
        public: string;
        private: string;
    };
    username: string;
}
export declare class SSH {
    buddy: Buddy;
    options: SSHOptions;
    bash: any;
    sudo: any;
    constructor(buddy: Buddy, options: SSHOptions);
    init(): Promise<void>;
    connect(name: string): Promise<SSHConnection>;
}
export declare class SSHConnection {
    private ssh;
    private host;
    nodessh: NodeSSH;
    constructor(ssh: SSH, host: string);
    init(): Promise<void>;
    exec(command: string, args: string[]): Promise<string>;
    close(): Promise<void>;
}
