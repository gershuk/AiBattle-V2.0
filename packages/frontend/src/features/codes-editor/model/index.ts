import { attach, combine, createEvent, createStore, sample } from 'effector'
import {
	addCode,
	$codes,
	removeCode,
	$codesData,
	readCodesFromLocalStorageFx,
} from 'model'
import { openFileExplorer, readFile } from 'api'
import { createSessionsManager } from 'libs/ace-editor'

const { $sessions, addSession, removeSession } = createSessionsManager({
	mode: 'ace/mode/javascript',
})

const $editorTexts = createStore<{ [fileName: string]: string }>({})

//TODO: ПЛОХА бижим по всем файлам
const $codesWithCache = combine(
	$codesData,
	$editorTexts,
	(codes, editorTexts) => {
		return Object.values(codes).map(code => ({
			...code,
			modified:
				code.name in editorTexts && editorTexts[code.name] !== code.content,
		}))
	}
)

const uploadedFileCode = createEvent()
const createdFileCode = createEvent<string>()
const removedFileCode = createEvent<string>()
const changedCode = createEvent<{ name: string; content: string }>()

const loadScriptFx = attach({
	source: $codes,
	effect: async codes => {
		const file = await openFileExplorer({ accept: '.js' })
		const content = await readFile(file)
		if (typeof content === 'string') {
			const fileIsExits = !!codes.find(code => code.name === file.name)
			//TODO: убрать запрещение загружать файл с таким файлом
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

$editorTexts.on(changedCode, (cache, { name, content }) => ({
	...cache,
	[name]: content,
}))

sample({
	clock: uploadedFileCode,
	target: loadScriptFx,
})

sample({
	clock: loadScriptFx.doneData,
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

sample({
	clock: [addCode.map(code => [code]), readCodesFromLocalStorageFx.doneData],
	fn: codes => codes.map(({ content, name }) => ({ name, value: content })),
	target: addSession,
})

sample({
	clock: removeCode,
	fn: code => code,
	target: removeSession,
})

//TODO: сделать нормальные коды ошибок и их обработки
loadScriptFx.failData.watch(e => {
	if (e?.message !== 'cancel-user') alert(e)
})

export {
	$sessions,
	$codesWithCache,
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
	changedCode,
}
