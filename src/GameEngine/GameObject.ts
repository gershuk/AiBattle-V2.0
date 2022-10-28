import * as Utilities from "../Utilities/IndexUtilities";

export class GameObject {
  private _id: string;
  private _components: ObjectComponent[];

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  constructor() {
    this.id = Utilities.GenerateUUID();
  }

  public AddComponent<T extends ObjectComponent>(
    type: new () => T,
    parameters?: ComponentParameters
  ): any {
    const component: T = new type();
    component.Init(this, parameters);
    this._components.push(component);
    return component;
  }

  public RemoveComponents<T extends ObjectComponent>(type: new () => T) {
    const obj = new type();
    this._components = this._components.filter(
      (component) =>
        component.constructor.toString() != obj.constructor.toString()
    );
  }

  public GetComponents<T extends ObjectComponent>(type: new () => T): any {
    const obj = new type();
    return this._components.filter(
      (component) =>
        component.constructor.toString() == obj.constructor.toString()
    );
  }

  public OnDestroy(): void {
    for (let component of this._components) component.OnDestroy();
  }

  public OnSceneStart(): void {
    for (let component of this._components) component.OnSceneStart();
  }

  public OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
    for (let component of this._components)
      component.OnBeforeFrameRender(currentFrame, frameCount);
  }

  public OnAfterFrameRender(currentFrame: number, frameCount: number): void {
    for (let component of this._components)
      component.OnAfterFrameRender(currentFrame, frameCount);
  }

  public OnFixedUpdate(index: number): void {
    for (let component of this._components) component.OnFixedUpdate(index);
  }
}

export abstract class ObjectComponent {
  protected _owner: GameObject;

  constructor(owner: GameObject, parameters?: ComponentParameters) {
    this._owner = owner;
  }

  Init(owner: GameObject, parameters?: ComponentParameters) {
    this._owner = owner;
  }

  abstract OnDestroy(): void;
  abstract OnSceneStart(): void;
  abstract OnBeforeFrameRender(currentFrame: number, frameCount: number): void;
  abstract OnAfterFrameRender(currentFrame: number, frameCount: number): void;
  abstract OnFixedUpdate(index: number): void;
}

export abstract class ComponentParameters {}
