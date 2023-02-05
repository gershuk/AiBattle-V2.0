import { createSessionsManager } from 'libs/ace-editor'

const { $sessions, addSession, removeSession } = createSessionsManager({
	mode: 'ace/mode/json',
})

export { $sessions, addSession, removeSession }
