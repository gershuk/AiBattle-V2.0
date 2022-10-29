export function Lerp(from: number, to: number, by: number): number {
  return from * (1 - by) + to * by;
}

export class Vector2 {
  private _x: number;
  private _y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  private SetXY(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  public set x(x: number) {
    this._x = x;
  }

  public get x(): number {
    return this._x;
  }

  public set y(y: number) {
    this._y = y;
  }

  public get y(): number {
    return this._y;
  }

  public Add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public Sub(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public Div(other: Vector2): Vector2 {
    return new Vector2(this.x / other.x, this.y / other.y);
  }

  public Mul(other: Vector2): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  public Copy(other: Vector2) {
    this.SetXY(other.x, other.y);
  }

  public DivScalar(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, (this.y /= scalar));
  }

  public MulScalar(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, (this.y *= scalar));
  }

  public Magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  public Normalize(): Vector2 {
    return this.DivScalar(this.Magnitude());
  }

  public Distance(other: Vector2): number {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
    );
  }

  public static CenterOf(...vecs: Vector2[]): Vector2 {
    const v = new Vector2(0, 0);
    for (let other of vecs) {
      v.Add(other);
    }
    v.DivScalar(vecs.length);
    return v;
  }

  public static Lerp(from:Vector2, to: Vector2, by:number): Vector2{
    return from.MulScalar(1 - by).Add(to.MulScalar(by));
  }
}
