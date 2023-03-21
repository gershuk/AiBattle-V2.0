import {
	AbstractController,
	AbstractControllerCommand,
	AbstractControllerData,
} from 'GameEngine/UserAIRuner/AbstractController'
import { MapData } from './MapData'

export enum BombermanActions {
	idle = 0,
	up = 1,
	right = 2,
	down = 3,
	left = 4,
	bomb = 5,
}

export class BombermanControllerData extends AbstractControllerData {
	mapData: MapData
	constructor(mapData: MapData) {
		super()
		this.mapData = mapData
	}
}

export class BombermanControllerCommand extends AbstractControllerCommand {
	static GetIdleCommand(): BombermanControllerCommand {
		return new BombermanControllerCommand(BombermanActions.idle)
	}
	bombermanAction: BombermanActions
	constructor(bombermanCommands: BombermanActions) {
		super()
		this.bombermanAction = bombermanCommands
	}
}

export class BombermanController extends AbstractController<
	BombermanControllerData,
	BombermanControllerData,
	BombermanControllerCommand
> {
	Init(info: BombermanControllerData): void {
		throw new Error('Method not implemented.')
	}
	GetCommand(info: BombermanControllerData): BombermanControllerCommand {
		throw new Error('Method not implemented.')
	}
}
