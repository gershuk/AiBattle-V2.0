import { attach, createEvent, sample } from 'effector'
import { $codes, addMap, removeMap, $maps } from 'model'
import { openFileExplorer, readFile } from 'api'
import { MapData } from 'model/uploaded-maps/type'

const uploadedFile = createEvent()
const createdFile = createEvent<string>()
const removedFile = createEvent<string>()

const loadedMapFx = attach({
	source: $codes,
	effect: async codes => {
		const file = await openFileExplorer({ accept: '.js' })
		const content = await readFile(file)
		if (typeof content === 'string') {
			let data: MapData
			try {
				data = JSON.parse(content)
			} catch (e) {
				return Promise.reject(new Error('invalid json'))
			}
			const fileIsExits = !!codes.find(code => code.name === file.name)
			if (fileIsExits)
				return Promise.reject(new Error('Файл с таким именем уже загружен'))
			return {
				data,
				name: file.name,
			}
		}
		return Promise.reject(new Error('не возможно преобразовать файл в строку'))
	},
})

sample({
	clock: uploadedFile,
	target: loadedMapFx,
})

sample({
	clock: loadedMapFx.doneData,
	target: addMap,
})

sample({
	clock: removedFile,
	target: removeMap,
})

sample({
	source: $maps,
	clock: createdFile,
	filter: (maps, name) => !!name && !maps.find(code => code.name === name),
	fn: (_, name) => ({ name, data: {} as MapData }),
	target: addMap,
})

//TODO: сделать нормальные коды ошибок и их обработки
loadedMapFx.failData.watch(e => {
	if (e?.message !== 'cancel-user') alert(e)
})

export { uploadedFile, removedFile, createdFile }
