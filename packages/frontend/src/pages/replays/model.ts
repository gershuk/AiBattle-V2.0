import { createEvent, createStore } from 'effector'
import { Replay } from 'model'

const $startGame = createStore(false)
const $selectReplay = createStore<Replay | null>(null)

const setStartReplay = createEvent<boolean>()
const selectedReplay = createEvent<Replay | null>()

$startGame.on(setStartReplay, (_, status) => status)
$selectReplay.on(selectedReplay, (_, replay) => replay)

export { $selectReplay, selectedReplay, $startGame, setStartReplay }
