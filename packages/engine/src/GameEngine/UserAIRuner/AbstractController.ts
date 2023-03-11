import {
	GameObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/GameObjectComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { PromiseWithTimeout } from 'Utilities'

export abstract class AbstractControllerData {}

export abstract class AbstractControllerCommand {
	static GetIdleCommand(): AbstractControllerCommand {
		throw Error('Method not implemented.')
	}
}

export abstract class AbstractController<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand
> {
	abstract Init(info: TInitData): void
	abstract GetCommand(info: TTurnData): TCommand
}

export class RemoteController<
	TInitData extends AbstractControllerData,
	TData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand
> extends AbstractController<TInitData, TData, TCommand> {
	Init(info: TInitData): void {
		throw new Error('Method not implemented.')
	}
	GetCommand(info: TData): TCommand {
		throw new Error('Method not implemented.')
	}
}

export class ControllerBody<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand,
	TController extends AbstractController<TInitData, TTurnData, TCommand>
> extends GameObjectComponent {
	private _initTimeout: number
	public get initTimeout(): number {
		return this._initTimeout
	}
	public set initTimeout(v: number) {
		this._initTimeout = v
	}

	private _turnCalcTimeout: number
	public get commandCalcTimeout(): number {
		return this._turnCalcTimeout
	}
	public set commandCalcTimeout(v: number) {
		this._turnCalcTimeout = v
	}

	private _abstractController: TController
	public get abstractController(): TController {
		return this._abstractController
	}

	protected set abstractController(v: TController) {
		this._abstractController = v
	}

	public Init(
		gameObject: IGameObject,
		parameters?: ControllerBodyParameters<
			TInitData,
			TTurnData,
			TCommand,
			TController
		>
	): void {
		super.Init(gameObject, parameters)

		if (parameters) {
			this.abstractController = parameters.controller
			this.initTimeout = parameters.initTimeout
			this.commandCalcTimeout = parameters.commandCalcTimeout
		}
	}

	protected InitStartDataWithTimeout(data: TInitData): Promise<unknown> {
		let promise = new Promise((resolve, reject) => {
			try {
				resolve(this.abstractController.Init(data))
			} catch (e) {
				reject(e)
			}
		})
		return this.initTimeout > 0
			? PromiseWithTimeout(promise, this.commandCalcTimeout)
			: promise
	}

	protected GetCommandWithTimeout(data: TTurnData): Promise<TCommand> {
		let promise = new Promise<TCommand>((resolve, reject) => {
			try {
				resolve(this.abstractController.GetCommand(data))
			} catch (e) {
				reject(e)
			}
		})
		return this.commandCalcTimeout > 0
			? PromiseWithTimeout(promise, this.commandCalcTimeout)
			: promise
	}

	public async InitStartData(): Promise<unknown> {
		return Promise.resolve()
	}

	public async CalcAndExecuteCommand(turnIndex: number): Promise<unknown> {
		return Promise.resolve()
	}
}

// ToDo: add time out parameters to scene or to body controller body
export class ControllerBodyParameters<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand,
	T extends AbstractController<TInitData, TTurnData, TCommand>
> extends ComponentParameters {
	controller: T
	initTimeout: number
	commandCalcTimeout: number
	constructor(
		controller: T,
		initTimeout: number = -1,
		commandCalcTimeout: number = -1,
		executionPriority: number = 0,
		uuid?: string
	) {
		super(executionPriority, uuid)
		this.initTimeout = initTimeout
		this.commandCalcTimeout = commandCalcTimeout
		this.controller = controller
	}
}
