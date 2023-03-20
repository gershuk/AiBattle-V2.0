import { createSessionsManager } from 'libs/ace-editor'
import 'ace-builds/src-noconflict/mode-json'
import { config } from 'ace-builds'

config.setModuleUrl(
	'ace/mode/json_worker',
	'./ace-editor-resources/worker-json.min.js'
)

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
