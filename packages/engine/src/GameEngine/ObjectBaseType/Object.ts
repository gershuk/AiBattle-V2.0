export class Object {
	protected _uuid: string

	public get uuid(): string {
		return this._uuid
	}

	public set uuid(uuid: string) {
		this._uuid = uuid
	}
}
