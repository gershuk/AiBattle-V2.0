import { AbstractObjectComponent, ComponentParameters } from "./AbstractObjectComponent";
import { IScene } from "./IScene";

export interface IGameObject {
  get owner(): IScene;

  get id(): string;

  Init(
    owner?: IScene,
    ...newComponents: [AbstractObjectComponent, ComponentParameters?][]
  ): void;

  AddComponents(
    ...newComponents: [AbstractObjectComponent, ComponentParameters?][]
  ): void;

  RemoveComponents<T extends typeof AbstractObjectComponent>(type: T): void;

  GetComponents<T extends typeof AbstractObjectComponent>(type: T): T[];

  OnSceneStart(): void;

  OnBeforeFrameRender(currentFrame: number, frameCount: number): void;
  
  OnAfterFrameRender(currentFrame: number, frameCount: number): void;

  OnFixedUpdate(index: number): void;
}