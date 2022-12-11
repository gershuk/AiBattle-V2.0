import { GenerateUUID } from 'Utilities'

export class Message {
	private _creationTime: number
	public get creationTime(): number {
		return this._creationTime
	}
	private set creationTime(v: number) {
		this._creationTime = v
	}

	private _messageUuid: string
	public get messageUuid(): string {
		return this._messageUuid
	}
	private set messageUuid(v: string) {
		this._messageUuid = v
	}

	private _senderUuid: string
	public get senderUuid(): string {
		return this._senderUuid
	}
	private set senderUuid(v: string) {
		this._senderUuid = v
	}

	private _receiverUuid: string
	public get receiverUuid(): string {
		return this._receiverUuid
	}
	private set receiverUuid(v: string) {
		this._receiverUuid = v
	}

	private _data: any
	public get data(): string {
		return this._data
	}
	private set data(v: string) {
		this._data = v
	}

	constructor(
		senderUuid: string,
		data: any,
		receiverUuid: string,
		messageUuid?: string
	) {
		this.creationTime = Date.now()
		this.senderUuid = senderUuid
		this.receiverUuid = receiverUuid
		this.data = data
		this.messageUuid = messageUuid ?? GenerateUUID()
	}
}
