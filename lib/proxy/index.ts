import { ObjectUtils } from "../utils/object";

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

export class ElasticProxy {

    static new<T> (options: ElasticProxyOptions | RecursiveProxyOptions) {
        if (options.recursive) return ElasticProxy.newRecursive(options);
        const opts: ElasticProxyOptions = options as ElasticProxyOptions;

        return new Proxy(function(){}, {
            
            get (target, prop: string, receiver) {
                return opts.get && opts.get(prop);
            },

            set (target, prop: string, value, receiver) {
                opts.set && opts.set(prop, value)
                
                return true;
            },

            apply (target, thisArg, args) {
                return opts.apply && opts.apply(args);
            },

            construct (target, args) {
                return opts.new && opts.new(args);
            }

        });
    }

    static newRecursive (options: RecursiveProxyOptions) {
        ObjectUtils.setDefaults(options, { path: [] });

        return ElasticProxy.new({
            recursive: false,

            get (prop: string) {
                return ElasticProxy.new({
                    recursive: true,
                    path: [...options.path, prop],
                    apply: options.apply,
                    new: options.new
                })
            },

            apply (args: any[]) {
                return options.apply && options.apply(options.path, args);
            },

            new (args: any[]) {
                return options.new && options.new(options.path, args);
            }
        })
    }

}