import * as Utilities from "../Utilities/IndexUtilities";
import {
  AbstractObjectComponent,
  ComponentParameters,
} from "./AbstractObjectComponent";
import { IGameObject } from "./IGameObject";
import { IScene } from "./IScene";
import { Vector2 } from "./Vector2";

export class GameObject implements IGameObject {
  private _id: string;
  private _components: AbstractObjectComponent[];
  private _owner: IScene | undefined;
  private _position: Vector2;

  public get position(): Vector2 {
    return this._position;
  }

  public get owner(): IScene {
    return this._owner;
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  constructor(
    position: Vector2,
    owner?: IScene,
    ...newComponents: [AbstractObjectComponent, ComponentParameters?][]
  ) {
    this.Init(position, owner, ...newComponents);
  }

  Init(
    position: Vector2,
    owner?: IScene,
    ...newComponents: [AbstractObjectComponent, ComponentParameters?][]
  ) {
    this._position = position;
    this._components = new Array<AbstractObjectComponent>();
    this.id = Utilities.GenerateUUID();
    this._owner = owner;
    this.AddComponents(...newComponents);
    this.OnInit();
  }

  public AddComponents(
    ...newComponents: [AbstractObjectComponent, ComponentParameters?][]
  ): void {
    for (let component of newComponents) {
      component[0].Init(this, component[1]);
      this._components.push(component[0]);
    }
  }

  public RemoveComponents<T extends typeof AbstractObjectComponent>(
    type: T
  ): void {
    this._components = this._components.filter((c) => !(c instanceof type));
  }

  public GetComponents<T extends typeof AbstractObjectComponent>(type: T): any {
    return this._components.filter((c) => c instanceof type);
  }

  public OnInit(): void {
    for (let component of this._components) component.OnOwnerInit();
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
