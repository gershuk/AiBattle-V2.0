import { createSessionsManager } from 'libs/ace-editor'

const { $sessions, addSession, removeSession, resetUndoManager, setSessionInitialValue } =
	createSessionsManager({
		mode: 'ace/mode/json',
	})

export { $sessions, addSession, removeSession, resetUndoManager, setSessionInitialValue }
