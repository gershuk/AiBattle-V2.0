import { createEvent, createStore, sample } from 'effector'
import { UploadedCode, changeCode } from '../../model'

const $selectCode = createStore<UploadedCode | null>(null)
const selectedCode = createEvent<UploadedCode | null>()
const changedCode = createEvent<UploadedCode>()

$selectCode.on(selectedCode, (_, code) => code)

sample({
	clock: changedCode,
	target: [changeCode, selectedCode],
})

export { $selectCode, selectedCode, changedCode }
