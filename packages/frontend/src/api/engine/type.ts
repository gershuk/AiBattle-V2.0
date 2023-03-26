import { ControllerCreationData } from '@ai-battle/engine'
import { PlayModeParameters } from '@ai-battle/engine/build/GameEngine/Scene/IScene'

export interface SceneParams {
	maxTurnIndex: number
	animTicksCount: number
	animTicksTime: number
	autoTurnTime: number
	canvas: HTMLCanvasElement
	tileSizeScale?: number
	initTimeout?: number
	commandCalcTimeout?: number
	playModeParameters?: PlayModeParameters
}

export interface BotCodes {
	codeName: string
	botName?: string
	code: string
}

export interface ControllerStorage {
	guid: string
	controller: ControllerCreationData
	codeName: string
	botName?: string
}
