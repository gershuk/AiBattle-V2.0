import { Ace, createEditSession, UndoManager } from 'ace-builds'
import { createEvent, createStore } from 'effector'

interface SessionItem {
	name: string
	value?: string
}

export const createSessionsManager = ({
	mode,
}: {
	mode: 'ace/mode/javascript' | 'ace/mode/json'
}) => {
	const $sessions = createStore<{ [name: string]: Ace.EditSession }>({})

	const addSession = createEvent<SessionItem | SessionItem[]>()
	const removeSession = createEvent<string | string[]>()

	$sessions.on(addSession, (undoManagers, undoName) => {
		const array = Array.isArray(undoName) ? undoName : [undoName]
		const newSessions = array.reduce((acc, { name, value }) => {
			//@ts-expect-error
			const session = createEditSession(value || '', mode)
			session.getUndoManager().reset()
			return {
				...acc,
				[name]: session,
			}
		}, {} as { [name: string]: Ace.EditSession })

		return { ...undoManagers, ...newSessions }
	})

	$sessions.on(removeSession, (undoManagers, undoName) => {
		const array = Array.isArray(undoName) ? undoName : [undoName]
		const newSessions = { ...undoManagers }
		array.forEach(undoName => {
			if (undoName in newSessions) {
				delete newSessions[undoName]
			}
		})
		return newSessions
	})

	return {
		$sessions,
		addUndoManager: addSession,
		removeUndoManager: removeSession,
	}
}
