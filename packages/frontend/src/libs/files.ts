export class ReadFileError extends Error {
	constructor(message: string) {
		super(message)

		Object.setPrototypeOf(this, ReadFileError.prototype)
	}
}
export class OpenFileExplorerError extends Error {
	constructor(message: string) {
		super(message)

		Object.setPrototypeOf(this, OpenFileExplorerError.prototype)
	}
}

export const readFile = (file: File) => {
	return new Promise<string | ArrayBuffer>((resolve, reject) => {
		var reader = new FileReader()
		try {
			reader.onload = readerEvent => {
				const content = readerEvent?.target?.result || ''
				resolve(content)
			}
			reader.onerror = () => {
				reject(new ReadFileError('read-error'))
			}
			reader.readAsText(file, 'UTF-8')
		} catch (error) {
			reject(new ReadFileError('read-error'))
		}
	})
}

export const openFileExplorer = <T extends boolean = false>({
	multiple,
	accept,
}: {
	multiple?: T
	accept?: string
}) => {
	let lock = false
	type PromiseType = T extends true ? File[] : File
	return new Promise<PromiseType>((resolve, reject) => {
		const input = document.createElement('input')
		input.type = 'file'
		input.multiple = !!multiple
		if (accept) input.accept = accept
		input.onchange = () => {
			lock = true
			const files = Array.from(input.files as FileList)
			if (!files.length) reject(new OpenFileExplorerError('cancel-user'))
			const file = files[0]
			resolve((multiple ? files : file) as PromiseType)
		}
		window.addEventListener(
			'focus',
			() => {
				setTimeout(() => {
					if (!lock) {
						reject(new OpenFileExplorerError('cancel-user'))
					}
				}, 300)
			},
			{ once: true }
		)
		input.click()
	})
}

export const createAndDownloadFile = (
	data: any,
	filename: string,
	type: string
) => {
	var file = new Blob([data], { type: type })
	//@ts-ignore
	if (window.navigator.msSaveOrOpenBlob)
		// IE10+
		//@ts-ignore
		window.navigator.msSaveOrOpenBlob(file, filename)
	else {
		// Others
		var a = document.createElement('a'),
			url = URL.createObjectURL(file)
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		setTimeout(function () {
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
		}, 0)
	}
}
