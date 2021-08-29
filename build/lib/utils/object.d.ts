export declare class ObjectUtils {
    static setDefault<T>(object: any, property: string, defaultValue: T): void;
    static setDefaults(object: any, properties: any): void;
    static fromArray<T>(array: T[], filter: (e: T, i: number) => string): {
        [key: string]: T[];
    };
    static map<T, U>(obj: {
        [key: string]: T;
    }, map: (key: string, value: T) => U): {
        [key: string]: U;
    };
    static toArray<T>(obj: {
        [key: string]: T;
    }): {
        key: string;
        value: T;
    }[];
}
