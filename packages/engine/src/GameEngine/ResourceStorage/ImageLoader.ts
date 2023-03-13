export class ImageLoader {
	private _loadedPngs: Map<string, HTMLImageElement>
	public get loadedPngs(): Map<string, HTMLImageElement> {
		return this._loadedPngs
	}
	public set loadedPngs(v: Map<string, HTMLImageElement>) {
		this._loadedPngs = v
	}

	constructor(loadedPngs?: Map<string, HTMLImageElement>) {
		this.loadedPngs = loadedPngs ?? new Map<string, HTMLImageElement>()
	}

	LoadPng(path: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			if (!this.loadedPngs.has(path)) {
				const img = new Image()
				img.addEventListener('load', () => {
					this.loadedPngs.set(path, img)
					resolve(img)
				})
				img.addEventListener('error', err => reject(err))
				img.src = path
			} else {
				resolve(this.GetPng(path))
			}
		})
	}

	async LoadPngs(paths: string[]): Promise<HTMLImageElement[]> {
		const promises: Promise<HTMLImageElement>[] = []

		for (let path of paths) promises.push(this.LoadPng(path))

		const images: HTMLImageElement[] = []
		for (let promise of promises) images.push(await promise)

		return images
	}

	GetPng(path: string): HTMLImageElement {
		return this.loadedPngs.get(path)
	}
}
