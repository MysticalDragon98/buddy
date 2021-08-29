export class Vector2 {

    constructor (x: number, y: number, private listener?: (prev: Vector2, next: Vector2) => any) {
        this[0] = x;
        this[1] = y;
    }

    get x () {
        return this[0];
    }

    get y () {
        return this[1];
    }

    set x (val: number) {
        this.update(val, this.y);
    }

    set y (val: number) {
        this.update(this.x, val);
    }

    update (x: number, y: number) {
        this.listener && this.listener(this, new Vector2(x, y));

        this[0] = x;
        this[1] = y;
    }

    minus (vec: Vector2) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

    plus (vec: Vector2) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

}

export class Vector3 {
    constructor (x, y, z, private listener?: (prev: Vector3, next: Vector3) => any) {
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    get x () {
        return this[0];
    }

    get y () {
        return this[1];
    }

    get z () {
        return this[2];
    }

    abs () {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    set x (val: number) {
        this.update(val, this.y, this.z);
    }

    set y (val: number) {
        this.update(this.x, val, this.z);
    }

    set z (val: number) {
        this.update(this.x, this.y, val);
    }

    update (x: number, y: number, z: number) {
        this.listener && this.listener(this, new Vector3(x, y, z));

        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    minus (vec: Vector3) {
        return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    plus (vec: Vector3) {
        return new Vector3(this.x - vec.x, this.y - vec.y, this.z + vec.z);
    }

    toString () {
        return `Vector3<${this.x}, ${this.y}, ${this.z}>`
    }
    
}

export class Maths {
    
    static max (a: number, b: number) {
        return a > b? a : b;
    }

}