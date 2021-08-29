import { Buddy } from "../..";
export interface Web3BuddyOptions {
    network?: string;
    provider?: string;
    chainId?: number;
    gasPrice?: string;
    account?: {
        address: string;
        privateKey: string;
    };
    src?: string[];
    abi?: string[];
    bin?: string[];
    contracts?: {
        [key: string]: string;
    };
}
export declare class Web3Buddy {
    buddy: Buddy;
    private options;
    web3: any;
    contracts: any;
    private _contracts;
    constructor(buddy: Buddy, options?: Web3BuddyOptions);
    init(): Promise<void>;
    getContract(name: string): Promise<{
        abi: any;
        contract: any;
    }>;
    deploy(name: string, ...args: any[]): Promise<void>;
}
