export class ObjectUtils {

    static setDefault<T> (object: any, property: string, defaultValue: T) {
        if(object[property] === undefined) object[property] = defaultValue;
    }

    static setDefaults (object: any, properties: any) {
        for (const key in properties)
            ObjectUtils.setDefault(object, key, properties[key]);
    }
}