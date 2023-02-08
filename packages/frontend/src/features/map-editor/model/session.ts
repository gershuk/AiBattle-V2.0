import { createSessionsManager } from 'libs/ace-editor'

const {
	$sessions,
	addSession,
	removeSession,
	resetUndoManager,
	resetSession,
	$sessionsValue,
} = createSessionsManager({
	mode: 'ace/mode/json',
})

export {
	$sessions,
	$sessionsValue,
	addSession,
	removeSession,
	resetUndoManager,
	resetSession,
}
