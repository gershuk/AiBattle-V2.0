import { attach, combine, createEvent, createStore, sample } from 'effector'
import { addCode, $codes, removeCode, $codesData } from 'model'
import { openFileExplorer, readFile } from 'api'

const $cacheSave = createStore<{ [k: string]: string }>({})

const $codesWithCache = combine($codesData, $cacheSave, (codes, cashed) => {
	return Object.values(codes).map(code => ({
		...code,
		cache: code.name in cashed ? cashed[code.name] : null,
		modify: code.name in cashed && cashed[code.name] !== code.content,
	}))
})

const uploadedFileCode = createEvent()
const createdFileCode = createEvent<string>()
const removedFileCode = createEvent<string>()
const changedCode = createEvent<{ name: string; content: string }>()

const loadedScriptFx = attach({
	source: $codes,
	effect: async codes => {
		const file = await openFileExplorer({ accept: '.js' })
		const content = await readFile(file)
		if (typeof content === 'string') {
			try {
				eval('function f () {' + content + '}')
			} catch (e) {
				return Promise.reject(new Error('invalid js'))
			}
			const fileIsExits = !!codes.find(code => code.name === file.name)
			if (fileIsExits)
				return Promise.reject(new Error('Файл с таким именем уже загружен'))
			return {
				content,
				name: file.name,
			}
		}
		return Promise.reject(new Error('не возможно преобразовать файл в строку'))
	},
})

$cacheSave.on(changedCode, (cache, { name, content }) => ({
	...cache,
	[name]: content,
}))

sample({
	clock: uploadedFileCode,
	target: loadedScriptFx,
})

sample({
	clock: loadedScriptFx.doneData,
	target: addCode,
})

sample({
	clock: removedFileCode,
	target: removeCode,
})

sample({
	source: $codes,
	clock: createdFileCode,
	filter: (codes, name) =>
		Boolean(name) && !codes.find(code => code.name === name),
	fn: (_, name) => ({ name, content: '' }),
	target: addCode,
})

//TODO: сделать нормальные коды ошибок и их обработки
loadedScriptFx.failData.watch(e => {
	if (e?.message !== 'cancel-user') alert(e)
})

export {
	$codesWithCache,
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
	changedCode,
}
