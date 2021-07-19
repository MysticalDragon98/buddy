import { join } from "path";
import { cold, highlight, warning } from "termx";
import { Buddy } from "../..";
import { ETHEREUM_NETWORKS } from "../../enums";
import * as SolC from "solc";
import { ObjectUtils } from "../utils/object";
import { ElasticProxy } from "../proxy";
import { JSONStorage } from "../storage/json-storage";
import { FileSystem } from "../utils/FileSystem";

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

export interface Web3BuddyOptions {
    network?: string;
    provider?: string;
    chainId?: number;
    gasPrice?: string;
    
    account?: {
        address: string;
        privateKey: string;
    }

    src?: string[];
    abi?: string[];
    bin?: string[];
    contracts?: { [key: string]: string };
}

export class Web3Buddy {

    web3: any;
    contracts: any = {};
    private _contracts: any = {};
    
    constructor (public buddy: Buddy, private options: Web3BuddyOptions = {}) {
        ObjectUtils.setDefaults(this.options, {
            contracts: {},
            abi: [],
            src: [],
            bin: []
        });

        this.options.abi.push(this.buddy.path('web3/abi'));
        this.options.src.push(this.buddy.path('web3/contracts'));
        this.options.bin.push(this.buddy.path('web3/binaries'));

        for (const contractName in this.options.contracts) {
            this.contracts[contractName] = ElasticProxy.new({
                recursive: true,

                apply: async (path: string[], args: any[]) => {
                    const methodName = path.join('.');
                    
                    const { abi, contract } = await this.getContract(contractName);
                    const abiMethod = abi.find(({ name }) => name === methodName);

                    if (!abiMethod)
                        throw new Error(`Method ${highlight(methodName)} not found in contract: ${highlight(methodName)}`);

                    const execution = await contract.methods[methodName](...args);

                    if (abiMethod.stateMutability === "view" || abiMethod.stateMutability === "pure") {
                        this.buddy.log(Web3Buddy, `${cold("[CALL]")} ${contractName}.${methodName}(${args.map(x => typeof(x)).join(', ')})`);

                        return await execution.call({
                            from: this.options.account.address,
                            chainId: this.options.chainId,
                            gasPrice: this.options.gasPrice
                        });
                    } else {
                        this.buddy.log(Web3Buddy, `${highlight("[SEND]")} ${contractName}.${methodName}(${args.map(x => typeof(x)).join(', ')})`);

                        return await execution.send({
                            from: this.options.account.address,
                            chainId: this.options.chainId,
                            gasPrice: this.options.gasPrice
                        });
                    }
                }

            })
        }

        // console.log(this.contracts, this.options)
    }

    async init () {
        await this.buddy.storage.mkdir("web3");
        await this.buddy.storage.mkdir("web3/abi");
        await this.buddy.storage.mkdir("web3/contracts");
        await this.buddy.storage.mkdir("web3/binaries");

        const web3 = new Web3();
        const defaultAccount = web3.eth.accounts.create();
        const account = this.options.account  ?? await this.buddy.storage.read("web3-account.json", defaultAccount);
        let network   = this.options.network  ?? await this.buddy.storage.env.web3_network();
        let provider  = this.options.provider ?? await this.buddy.storage.env.web3_provider();

        if (!network) {
            network = await this.buddy.prompt.choice("Which network do you want to use?", ETHEREUM_NETWORKS);
            await this.buddy.storage.env.web3_network(network);
        }

        if (!provider) {
            provider = await this.buddy.prompt.text("Enter your Web3 provider:");
            await this.buddy.storage.env.web3_provider(provider);
        }

        this.buddy.log(Web3Buddy, highlight(`Network:`), network);
        this.buddy.log(Web3Buddy, highlight(`Provider:`), provider);

        this.options.network = network;
        this.options.provider = provider;
        this.options.account = account;

        this.web3 = new Web3(new HDWalletProvider(this.options.account.privateKey, this.options.provider));
    }

    async getContract (name: string): Promise<{ abi: any, contract: any }> {
        if (this._contracts[name]) return this._contracts[name];

        this.buddy.log(Web3Buddy, `Loading contract: ${highlight(name)}`);
        const ABI = await FileSystem.lookup(this.options.abi, name + ".json");

        if (!ABI) throw new Error(`Could not find contract: ${name}`);
        const abi = JSON.parse(ABI);
        
        return this._contracts[name] = {
            abi,
            contract: new this.web3.eth.Contract(abi, this.options.contracts[name])
        };
    }

    async deploy (name: string, ...args: any[]) {
        this.buddy.log(Web3Buddy, `Deploying contract ${highlight(name)}...`);

        const src = await FileSystem.lookup(this.options.src, name + ".sol");

        if (!src) throw new Error('Could not find contract ' + highlight(name));

        const output = JSON.parse(SolC.compile(JSON.stringify({
            language: 'Solidity',

            sources: {
                [`${name}.sol`]: {
                    content: src
                }
            },

            settings: {
                outputSelection: {
                    "*": {
                        "*": ["*"]
                    }
                }
            }

        }), {
            import: function (path) {
                const importPath = require.resolve(path);
                

                return {
                    contents: FileSystem.readSync(importPath)
                }
            }
        }))


        this.buddy.log(Web3Buddy, output);
    }

}