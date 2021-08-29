export class ObjectUtils {

    static setDefault<T> (object: any, property: string, defaultValue: T) {
        if(object[property] === undefined) object[property] = defaultValue;
    }

    static setDefaults (object: any, properties: any) {
        for (const key in properties)
            ObjectUtils.setDefault(object, key, properties[key]);
    }

    static fromArray<T> (array: T[], filter: (e: T, i: number) => string) {
        const resultObject: { [key: string]: T[] } = {};
        let i=0;
        for (const item of array) {
            const name = filter(item, i++);
            resultObject[name] = resultObject[name] || [];
            resultObject[name].push(item);
        }

        return resultObject;
    }

    static map<T, U> (obj: { [key: string]: T }, map: (key: string, value: T) => U) {
        const resultObject: { [key: string]: U } = {};

        for (const key in obj) {
            resultObject[key] = map(key, obj[key]);
        }

        return resultObject;
    }

    static toArray<T> (obj: { [key: string]: T }) {
        const arr: { key: string, value: T }[] = [];
        for (const i in obj) arr.push({
            key: i,
            value: obj[i]
        });

        return arr;
    }
}