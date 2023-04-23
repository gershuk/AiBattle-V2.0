import { GenerateUUID } from 'Utilities'

export class Object {
	protected _label: string
	protected _uuid: string = GenerateUUID()

	public get label(): string {
		return this._label
	}

	public set label(label: string) {
		this._label = label
	}

	public get uuid(): string {
		return this._uuid
	}
}
