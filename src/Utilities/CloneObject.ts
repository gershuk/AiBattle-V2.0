export function DeepClone(): any {
  let cloneObj = new (this.constructor() as any)();
  for (let attribute in this) {
    if (typeof this[attribute] === "object") {
      cloneObj[attribute] = this[attribute].clone();
    } else {
      cloneObj[attribute] = this[attribute];
    }
  }
  return cloneObj;
}
