interface RecursiveProxyOptions {
    recursive: true;
    path?: string[];
    apply?: (path: string[], args: any[]) => any;
    new?: (path: string[], args: any[]) => any;
}
interface ElasticProxyOptions {
    recursive?: false;
    set?: (path: string, prop: any) => void;
    get?: (path: string) => any;
    apply?: (args: any[]) => any;
    new?: (args: any[]) => any;
}
export declare class ElasticProxy {
    static new<T>(options: ElasticProxyOptions | RecursiveProxyOptions): any;
    static newRecursive(options: RecursiveProxyOptions): any;
}
export {};
