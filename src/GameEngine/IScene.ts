import {
  AbstractObjectComponent,
  ComponentParameters,
} from "./AbstractObjectComponent";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export interface IScene {
  get gameObjects(): GameObject[];

  set turnIndex(turnIndex: number);

  get turnIndex(): number;

  set maxTurnIndex(maxTurnIndex: number);

  get maxTurnIndex(): number;

  set animTicksCount(animTicksCount: number);

  get animTicksCount(): number;

  set animTicksTime(animTicksTime: number);

  get animTicksTime(): number;

  set autoTurnTime(autoTurnTime: number);

  get autoTurnTime(): number;

  set autoTurnTimerId(autoTurnTimerId: number | undefined);

  get autoTurnTimerId(): number | undefined;

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
