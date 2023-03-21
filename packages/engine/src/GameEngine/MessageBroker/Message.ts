import { GenerateUUID } from 'Utilities'

export class Message {
	private _creationTime: number
	private _messageUuid: string
	private _senderUuid: string
	private _receiverUuid: string
	private _data: any
	public get creationTime(): number {
		return this._creationTime
	}
	private set creationTime(v: number) {
		this._creationTime = v
	}

	public get messageUuid(): string {
		return this._messageUuid
	}
	private set messageUuid(v: string) {
		this._messageUuid = v
	}

	public get senderUuid(): string {
		return this._senderUuid
	}
	private set senderUuid(v: string) {
		this._senderUuid = v
	}

	public get receiverUuid(): string {
		return this._receiverUuid
	}
	private set receiverUuid(v: string) {
		this._receiverUuid = v
	}

	public get data(): string {
		return this._data
	}
	private set data(v: string) {
		this._data = v
	}

	constructor(
		data: any,
		receiverUuid: string,
		senderUuid?: string,
		messageUuid?: string
	) {
		this.creationTime = Date.now()
		this.senderUuid = senderUuid
		this.receiverUuid = receiverUuid
		this.data = data
		this.messageUuid = messageUuid ?? GenerateUUID()
	}
}
