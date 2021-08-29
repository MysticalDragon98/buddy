const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|');

const ansiRegex = new RegExp(pattern, 'g');

export class StringUtils {
    
    static escapeANSI (text: string) {
        return text.replace(ansiRegex, "")
    }
    
    static template (input: string, data: any) {
        return input.replace(/\{\{\s*(.+?)\s*\}\}/g, ($0, $1) => data[$1.trim()]);
    }

}