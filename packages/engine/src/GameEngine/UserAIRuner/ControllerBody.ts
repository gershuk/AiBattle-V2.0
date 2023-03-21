import {
	ComponentParameters,
	GameObjectComponent,
} from 'GameEngine/BaseComponents/GameObjectComponent'
import {
	AbstractControllerCommand,
	AbstractControllerData,
} from './AbstractController'
import { IAsyncControllerBridge } from './AsyncControllerBridge'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

export class ControllerBody<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand
> extends GameObjectComponent {
	private _initTimeout: number
	private _turnCalcTimeout: number
	private _controllerBridge: IAsyncControllerBridge<
		TInitData,
		TTurnData,
		TCommand
	>
	public get initTimeout(): number {
		return this._initTimeout
	}
	public set initTimeout(v: number) {
		this._initTimeout = v
	}

	public get commandCalcTimeout(): number {
		return this._turnCalcTimeout
	}
	public set commandCalcTimeout(v: number) {
		this._turnCalcTimeout = v
	}

	public get controllerBridge(): IAsyncControllerBridge<
		TInitData,
		TTurnData,
		TCommand
	> {
		return this._controllerBridge
	}

	protected set controllerBridge(
		v: IAsyncControllerBridge<TInitData, TTurnData, TCommand>
	) {
		this._controllerBridge = v
	}

	public Init(
		gameObject: IGameObject,
		parameters?: ControllerBodyParameters<TInitData, TTurnData, TCommand>
	): void {
		super.Init(gameObject, parameters)

		if (parameters) {
			this.controllerBridge = parameters.controllerBridge
			this.initTimeout = parameters.initTimeout
			this.commandCalcTimeout = parameters.commandCalcTimeout
		}
	}

	protected InitStartDataWithTimeout(data: TInitData): Promise<unknown> {
		return this._controllerBridge.Init(data, this.initTimeout)
	}

	protected GetCommandWithTimeout(
		data: TTurnData,
		turnNumber: number
	): Promise<TCommand> {
		return this._controllerBridge.GetCommand(
			data,
			turnNumber,
			this.commandCalcTimeout
		)
	}

	public async InitStartData(): Promise<unknown> {
		return Promise.resolve()
	}

	public async CalcAndExecuteCommand(turnIndex: number): Promise<unknown> {
		return Promise.resolve()
	}
}

export class ControllerBodyParameters<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand
> extends ComponentParameters {
	controllerBridge: IAsyncControllerBridge<TInitData, TTurnData, TCommand>
	initTimeout: number
	commandCalcTimeout: number
	constructor(
		controllerBridge: IAsyncControllerBridge<TInitData, TTurnData, TCommand>,
		initTimeout: number = -1,
		commandCalcTimeout: number = -1,
		executionPriority: number = 0,
		uuid?: string
	) {
		super(executionPriority, uuid)
		this.initTimeout = initTimeout
		this.commandCalcTimeout = commandCalcTimeout
		this.controllerBridge = controllerBridge
	}
}
