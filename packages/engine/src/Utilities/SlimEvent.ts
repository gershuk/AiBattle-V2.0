export class SlimEvent<T> {
	private _listeners: ((data: T) => void)[]

	public Subscribe(listener: (data: T) => void): void {
		this._listeners.push(listener)
	}

	public Unsubscribe(listener: (data: T) => void): void {
		const listenersIndex = this._listeners.indexOf(listener)
		if (listenersIndex !== -1) {
			this._listeners.splice(listenersIndex, 1)
		}
	}

	public Notify(data: T): void {
		this._listeners.forEach(listener => listener(data))
	}
}
