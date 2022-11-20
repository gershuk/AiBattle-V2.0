import { createEvent, createStore } from 'effector'
import { Replay } from './type'

const $replays = createStore<Replay[]>([])

const addReplay = createEvent<Replay>()
const changeReplay = createEvent<Replay>()
const removeReplay = createEvent<string>()

$replays.on(addReplay, (replays, newReplay) => [...replays, newReplay])
$replays.on(removeReplay, (replays, nameRemove) =>
	replays.filter(({ name }) => name !== nameRemove)
)
$replays.on(changeReplay, (replays, newReplay) =>
	replays.map(code => (code.name === newReplay.name ? newReplay : code))
)

export { $replays, addReplay, changeReplay, removeReplay }
