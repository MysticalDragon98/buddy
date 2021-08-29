import { danger, highlight } from "termx";
import { Buddy } from "../..";
import { ObjectUtils } from "../utils/object";
import { NodeSSH } from "node-ssh";
import { ElasticProxy } from "../proxy";

const generateKeypair = require("keypair");
const nodeForge = require("node-forge");

export class SSHOptions {

    remote?: { [name: string]: string; }

    sshKeys?: {
        public: string;
        private: string;
    };

    username: string;
}

export class SSH {

    bash: any = {};
    sudo: any = {};

    constructor (public buddy: Buddy, public options: SSHOptions) {
        ObjectUtils.setDefaults(options, {
            remote: {}
        });

        for (const host in options.remote) {
            this.bash[host] = ElasticProxy.new({
                recursive: false,

                get: (path: string) => {
                    return async (...args) => {
                        const conn = await this.connect(host);
                        const result = await conn.exec(path, args);
                        
                        await conn.close();
                        return result;
                    }
                }
            });

            this.sudo[host] = ElasticProxy.new({
                recursive: false,

                get: (path: string) => {
                    return async (...args) => {
                        const conn = await this.connect(host);
                        try {
                            var result = await conn.exec("sudo", [path, ...args]);
                        } catch (exc) {
                            if (!exc.message.includes("sudo: unable to resolve host")) throw exc;
                            result = "ok";
                        }
                        
                        await conn.close();
                        return result;
                    }
                }
            });
        }
    }

    async init () {
        let rsa;

        await this.buddy.storage.mkdir("ssh");

        if (!this.options.sshKeys) {
            try {
                rsa = {
                    private: await this.buddy.storage.read("ssh/private.key"),
                    public: await this.buddy.storage.read("ssh/public.key")
                }
            } catch (exc) {
                this.buddy.log(SSH, danger("Could not load RSA keys from workdir:"), exc.code);

                if (exc.code === "ENOENT") {
                    this.buddy.log(SSH, "Generating ssh keys.");

                    const pair = generateKeypair();
                    const publicKey = nodeForge.pki.publicKeyFromPem(pair.public);
                    const ssh = nodeForge.ssh.publicKeyToOpenSSH(publicKey) + (this.options.username || "");
                    
                    rsa = {
                        private: pair.private,
                        public: ssh.trim()
                    }

                    await this.buddy.storage.write("ssh/public.key", rsa.public);
                    await this.buddy.storage.write("ssh/private.key", rsa.private);
                }
            }
        }
        
        
        this.buddy.log(SSH, "Public Key:\n" + highlight(rsa.public));
        this.options.sshKeys = rsa;
    }

    async connect (name: string) {
        if(!this.options.remote[name]) throw new Error(`Host ${name} doesn't exists in the ssh.remote options`);
        const host = this.options.remote[name];
        const conn = new SSHConnection(this, host);

        await conn.init();

        return conn;
    }

}

export class SSHConnection {

    nodessh: NodeSSH;

    constructor (private ssh: SSH, private host: string) {
        this.nodessh = new NodeSSH();
    }

    async init () {
        await this.nodessh.connect({
            host: this.host,
            username: this.ssh.options.username,
            privateKey: this.ssh.options.sshKeys.private!
        });
    }

    async exec (command: string, args: string[]) {
        const result = this.nodessh.exec(command, args, {
            stream: "stdout"
        });

        return result;
    }

    async close () {
        await this.nodessh.dispose();
    }

}