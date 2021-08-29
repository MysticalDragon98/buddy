
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export class FunctionUtils {

    static getParamNames(func: Function): Array<string> {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if(result === null)
           result = [];
        return result;
    }
    
    static getObjectPropertyIgnoreCase (obj: any, prop: string) {
        prop = prop.toLowerCase();
    
        for(let i in obj) if (i.toLowerCase() === prop) return obj[i];
    }
}