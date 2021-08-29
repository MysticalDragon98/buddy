export class NumberUtils {
    
    static randInt (from: number, to: number) {
        return Math.floor(Math.random() * (to - from) + from);
    }

}