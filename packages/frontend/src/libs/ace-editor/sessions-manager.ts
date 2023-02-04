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

	$sessions.on(addSession, (sessions, nweSession) => {
		const array = Array.isArray(nweSession) ? nweSession : [nweSession]
		const newSessions = array.reduce((acc, { name, value }) => {
			//@ts-expect-error
			const session = createEditSession(value || '', mode)
			session.getUndoManager().reset()
			return {
				...acc,
				[name]: session,
			}
		}, {} as { [name: string]: Ace.EditSession })

		return { ...sessions, ...newSessions }
	})

	$sessions.on(removeSession, (sessions, removeSession) => {
		const array = Array.isArray(removeSession) ? removeSession : [removeSession]
		const newSessions = { ...sessions }
		array.forEach(undoName => {
			if (undoName in newSessions) {
				delete newSessions[undoName]
			}
		})
		return newSessions
	})

	return {
		$sessions,
		addSession,
		removeSession,
	}
}
