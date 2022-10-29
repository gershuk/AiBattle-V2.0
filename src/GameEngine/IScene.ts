import { AbstractObjectComponent, ComponentParameters } from "./AbstractObjectComponent";
import { GameObject } from "./GameObject";

export interface IScene {
  AddGameObject<T extends GameObject>(
    gameObjectInits: T,
    ...newComponents: [AbstractObjectComponent, ComponentParameters?][]
  ): void;

  AddGameObjects<T extends GameObject>(
    gameObjectInits: [T, [AbstractObjectComponent, ComponentParameters?][]][]
  ): void;

  GetGameObjectsByFilter(filter : (g:GameObject)=>boolean) : GameObject[];

  RemoveGameObjectsByFilter(filter : (g:GameObject)=>boolean) : void;

  Start(): void;

  RenderFrame(): void;

  DoNextTurn(): void;

  StopAutoTurn(): void;

  StartAutoTurn(): void;
}
