import { GenerateUUID } from 'Utilities'
import {
	AbstractControllerCommand,
	AbstractControllerData,
} from './AbstractController'
import { IAsyncControllerBridge } from './AsyncControllerBridge'
import { getWorkerInitFunction } from './WorkerInitFunction'
import {
	InitRequestType,
	InitAnswerType,
	TurnRequestType,
	TurnAnswerType,
} from './WorkerSupportTypes'

//When adding constants update the function
function GetConstants(): string {
	let res = ''
	res += `const ${
		Object.keys({ InitRequestType })[0]
	} = "${InitRequestType}";\n`
	res += `const ${Object.keys({ InitAnswerType })[0]} = "${InitAnswerType}";\n`
	res += `const ${
		Object.keys({ TurnRequestType })[0]
	} = "${TurnRequestType}";\n`
	res += `const ${Object.keys({ TurnAnswerType })[0]} = "${TurnAnswerType}";\n`
	return res
}

export class InitRequest {
	type: string
	initInfo: any

	constructor(initInfo: any) {
		this.initInfo = initInfo
		this.type = InitRequestType
	}
}

export class InitAnswer {
	type: string
	initError: Error

	constructor(initError: Error) {
		this.initError = initError
		this.type = InitAnswerType
	}
}

export class TurnRequest {
	type: string
	turnInfo: any
	turnNumber: number

	constructor(turnInfo: any, turnNumber: number) {
		;(this.turnInfo = turnInfo), (this.turnNumber = turnNumber)
		this.type = TurnRequestType
	}
}

export class TurnAnswer {
	type: string
	turnAnswer: any
	turnNumber: number

	constructor(turnAnswer: any, turnNumber: number) {
		this.turnAnswer = turnAnswer
		this.turnNumber = turnNumber
		this.type = TurnAnswerType
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
		this.UUID == uuid ?? GenerateUUID()
	}

	Init(info: TInitData, timeout: number): Promise<unknown> {
		window.URL = window.URL || window.webkitURL
		const workerCode =
			this.controllerText +
			'\n' +
			GetConstants() +
			getWorkerInitFunction({
				InitAnswerType,
				TurnAnswerType,
				InitRequestType,
				TurnRequestType,
			}) +
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
				if (mes.data.type === InitAnswerType) res(mes.data.initError)
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
					mes.data.type === TurnAnswerType &&
					mes.data.turnNumber === turnNumber
				)
					res(mes.data.turnAnswer)
			}
			if (timeout > -1) setTimeout(() => rej(new Error('Time out.')), timeout)
		})
	}
}
