export class ImageLoader {
	private _loadedPngs: Map<string, HTMLImageElement>
	public get loadedPngs(): Map<string, HTMLImageElement> {
		return this._loadedPngs
	}
	public set loadedPngs(v: Map<string, HTMLImageElement>) {
		this._loadedPngs = v
	}

	constructor(loadedPngs?: Map<string, HTMLImageElement>) {
		this.loadedPngs = loadedPngs
	}

	LoadPng(path: string) {
		if (!this.loadedPngs.has(path)) {
			const image = new Image()
			image.src = path
			this.loadedPngs.set(path, image)
		}
		return this.loadedPngs.get(path)
	}
}
