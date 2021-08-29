export declare class Vector2 {
    private listener?;
    constructor(x: number, y: number, listener?: ((prev: Vector2, next: Vector2) => any) | undefined);
    get x(): number;
    get y(): number;
    set x(val: number);
    set y(val: number);
    update(x: number, y: number): void;
    minus(vec: Vector2): Vector2;
    plus(vec: Vector2): Vector2;
}
export declare class Vector3 {
    private listener?;
    constructor(x: any, y: any, z: any, listener?: ((prev: Vector3, next: Vector3) => any) | undefined);
    get x(): number;
    get y(): number;
    get z(): number;
    abs(): number;
    set x(val: number);
    set y(val: number);
    set z(val: number);
    update(x: number, y: number, z: number): void;
    minus(vec: Vector3): Vector3;
    plus(vec: Vector3): Vector3;
    toString(): string;
}
export declare class Maths {
    static max(a: number, b: number): number;
}
