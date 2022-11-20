import { createEvent, createStore } from 'effector'
import { Replay } from 'model'

const $selectReplay = createStore<Replay | null>(null)
const selectedReplay = createEvent<Replay | null>()

$selectReplay.on(selectedReplay, (_, replay) => replay)

export { $selectReplay, selectedReplay }
