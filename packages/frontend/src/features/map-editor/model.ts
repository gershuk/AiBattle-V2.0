import { attach, combine, createEvent, createStore, sample } from 'effector'
import { addMap, removeMap, $maps, $dataMaps } from 'model'
import { openFileExplorer, readFile } from 'api'

const $cacheSave = createStore<{ [k: string]: string }>({})
const $mapsWithCache = combine($dataMaps, $cacheSave, (maps, cashed) => {
	return Object.values(maps).map(code => ({
		...code,
		cache: code.name in cashed ? cashed[code.name] : null,
		modify: code.name in cashed && cashed[code.name] !== code.content,
	}))
})

const uploadedFile = createEvent()
const createdFile = createEvent<string>()
const changedMap = createEvent<{ name: string; content: string }>()
const removedFileMap = createEvent<string>()

const loadedMapFx = attach({
	source: $dataMaps,
	effect: async maps => {
		const file = await openFileExplorer({ accept: '.js' })
		const content = await readFile(file)
		if (typeof content === 'string') {
			try {
				JSON.parse(content)
			} catch (e) {
				return Promise.reject(new Error('invalid json'))
			}
			const fileIsExits = !!maps[file.name]
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

$cacheSave.on(changedMap, (cache, { name, content }) => ({
	...cache,
	[name]: content,
}))

sample({
	clock: uploadedFile,
	target: loadedMapFx,
})

sample({
	clock: loadedMapFx.doneData,
	target: addMap,
})

sample({
	clock: removedFileMap,
	target: removeMap,
})

sample({
	source: $maps,
	clock: createdFile,
	filter: (maps, name) => !!name && !maps.find(code => code.name === name),
	fn: (_, name) => ({ name, content: '{}' }),
	target: addMap,
})

//TODO: сделать нормальные коды ошибок и их обработки
loadedMapFx.failData.watch(e => {
	if (e?.message !== 'cancel-user') alert(e)
})

export { uploadedFile, removedFileMap, createdFile, changedMap, $mapsWithCache }
