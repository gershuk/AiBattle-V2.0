import { openFileExplorer, readFile } from 'api'
import { attach, createEvent, sample } from 'effector'
import { $replays, addReplay, removeReplay } from 'model/replays/model'

const uploadedReplay = createEvent()
const removedReplay = createEvent<string>()

const loadReplayFx = attach({
	source: $replays,
	effect: async replays => {
		const file = await openFileExplorer({ accept: '*' })
		const content = await readFile(file)
		if (typeof content === 'string') {
			// try {
			// 	JSON.parse(content)
			// } catch (e) {
			// 	return Promise.reject(new Error('invalid json'))
			// }
			const fileIsExits = !!replays.find(replay => replay.name === file.name)
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

sample({
	clock: uploadedReplay,
	target: loadReplayFx,
})

sample({
	clock: loadReplayFx.doneData,
	target: addReplay,
})

sample({
	clock: removedReplay,
	target: removeReplay,
})

export { uploadedReplay, removedReplay }
