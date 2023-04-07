import {
	attach,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector'
import { arrayObjectToHasMap } from 'libs'

export interface UploadedCode {
	name: string
	content: string
}

const $codes = createStore<UploadedCode[]>([])

const $codesData = $codes.map(codes => arrayObjectToHasMap(codes, 'name'))

const addCode = createEvent<UploadedCode>()
const changeCode = createEvent<UploadedCode>()
const removeCode = createEvent<string>()
const renameCode = createEvent<{ oldName: string; newName: string }>()

const addCodesToLocalStorageFx = attach({
	source: $codes,
	effect: codes => {
		localStorage.setItem('codes', JSON.stringify(codes))
	},
})

const readCodesFromLocalStorageFx = createEffect({
	handler: (): UploadedCode[] => {
		return JSON.parse(localStorage.getItem('codes') || '') || []
	},
})

$codes.on(addCode, (codes, newCode) => [...codes, newCode])
$codes.on(removeCode, (codes, nameRemove) =>
	codes.filter(({ name }) => name !== nameRemove)
)
$codes.on(changeCode, (codes, newCode) =>
	codes.map(code => (code.name === newCode.name ? newCode : code))
)
$codes.on(readCodesFromLocalStorageFx.doneData, (_, codes) => codes)

$codes.on(renameCode, (codes, { oldName, newName }) => {
	return codes.map(code => {
		if (code.name === oldName)
			return {
				...code,
				name: newName,
			}
		return code
	})
})

sample({
	clock: $codes,
	target: addCodesToLocalStorageFx,
})

export {
	$codes,
	$codesData,
	addCode,
	removeCode,
	changeCode,
	readCodesFromLocalStorageFx,
	renameCode,
}
