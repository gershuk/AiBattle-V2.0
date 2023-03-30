import { GenerateUUID } from 'Utilities'
import {
	AbstractControllerCommand,
	AbstractControllerData,
} from './AbstractController'
import { IAsyncControllerBridge } from './AsyncControllerBridge'
import { workerMessageTypes, workerInitFunction } from './WorkerSupportTypes'

//When adding constants update the function
function GetConstants(): string {
	let res = Object.entries(workerMessageTypes)
		.reduce((acc, [key, value]) => {
			return [...acc, `const ${key} = "${value}";`]
		}, [])
		.join('\n')
	return res
}

export class InitRequest {
	type: string
	initInfo: any

	constructor(initInfo: any) {
		this.initInfo = initInfo
		this.type = workerMessageTypes.InitRequestType
	}
}

export class InitAnswer {
	type: string
	initError: Error

	constructor(initError: Error) {
		this.initError = initError
		this.type = workerMessageTypes.InitAnswerType
	}
}

export class TurnRequest {
	type: string
	turnInfo: any
	turnNumber: number

	constructor(turnInfo: any, turnNumber: number) {
		;(this.turnInfo = turnInfo), (this.turnNumber = turnNumber)
		this.type = workerMessageTypes.TurnRequestType
	}
}

export class TurnAnswer {
	type: string
	turnAnswer: any
	turnNumber: number

	constructor(turnAnswer: any, turnNumber: number) {
		this.turnAnswer = turnAnswer
		this.turnNumber = turnNumber
		this.type = workerMessageTypes.TurnAnswerType
	}
}

export class WorkerBridge<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand
> implements IAsyncControllerBridge<TInitData, TTurnData, TCommand>
{
	private _controllerText: string
	private _worker: Worker
	private _uuid: string
	public get controllerText(): string {
		return this._controllerText
	}
	protected set controllerText(v: string) {
		this._controllerText = v
	}

	public get worker(): Worker {
		return this._worker
	}
	protected set worker(v: Worker) {
		this._worker = v
	}

	public get UUID(): string {
		return this._uuid
	}

	protected set UUID(v: string) {
		this._uuid = v
	}

	constructor(controllerText: string, uuid?: string) {
		this.controllerText = controllerText
		this.UUID = uuid ?? GenerateUUID()
	}

	Init(info: TInitData, timeout: number): Promise<unknown> {
		window.URL = window.URL || window.webkitURL
		const workerCode =
			this.controllerText +
			'\n' +
			GetConstants() +
			workerInitFunction.toString() +
			'\n' +
			'workerInitFunction();'
		const blob = new Blob([workerCode], {
			type: 'application/javascript',
		})

		this.worker = new Worker(URL.createObjectURL(blob))
		this.worker.onmessageerror = e => console.warn(e.data)

		this.worker.postMessage(new InitRequest(info))

		return new Promise((res, rej) => {
			this.worker.onmessage = mes => {
				if (mes.data.type === workerMessageTypes.InitAnswerType)
					res(mes.data.initError)
			}
			if (timeout > -1) setTimeout(() => rej(new Error('Time out.')), timeout)
		})
	}

	GetCommand(
		info: TTurnData,
		turnNumber: number,
		timeout: number
	): Promise<TCommand> {
		return new Promise((res, rej) => {
			this.worker.postMessage(new TurnRequest(info, turnNumber))
			this.worker.onmessage = mes => {
				if (
					mes.data.type === workerMessageTypes.TurnAnswerType &&
					mes.data.turnNumber === turnNumber
				)
					res(mes.data.turnAnswer)
			}
			if (timeout > -1) setTimeout(() => rej(new Error('Time out.')), timeout)
		})
	}
}
