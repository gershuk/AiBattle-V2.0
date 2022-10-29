import {
  AbstractObjectComponent,
  ComponentParameters,
} from "./AbstractObjectComponent";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export interface IScene {
  AddGameObject<T extends GameObject>(
    position: Vector2,
    gameObjectInits: T,
    ...newComponents: [AbstractObjectComponent, ComponentParameters?][]
  ): void;

  AddGameObjects<T extends GameObject>(
    gameObjectInits: [
      Vector2,
      T,
      [AbstractObjectComponent, ComponentParameters?][]
    ][]
  ): void;

  GetGameObjectsByFilter(filter: (g: GameObject) => boolean): GameObject[];

  RemoveGameObjectsByFilter(filter: (g: GameObject) => boolean): void;

  Start(): void;

  RenderFrame(): void;

  DoNextTurn(): void;

  StopAutoTurn(): void;

  StartAutoTurn(): void;
}
