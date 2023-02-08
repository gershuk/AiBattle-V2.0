import { Ace, createEditSession, UndoManager } from 'ace-builds'
import { attach, createEvent, createStore, sample } from 'effector'

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
	const resetUndoManager = createEvent<string | string[]>()
	const setSessionInitialValue = createEvent<{ name: string; content: string }>()

	const resetUndoManagerFx = attach({
		source: $sessions,
		effect: (sessions, nameSession: string | string[]) => {
			const array = Array.isArray(nameSession) ? nameSession : [nameSession]
			array.forEach(nameSession => {
				sessions[nameSession].getUndoManager().reset()
			})
		},
	})

	const setValueInitialFx = attach({
		source: $sessions,
		effect: (sessions, { name, content }: { name: string; content: string }) => {
			sessions[name].setValue(content)
		},
	})

	$sessions.on(addSession, (sessions, newSession) => {
		const array = Array.isArray(newSession) ? newSession : [newSession]
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

	sample({ clock: resetUndoManager, target: resetUndoManagerFx })

	sample({ clock: setSessionInitialValue, target: setValueInitialFx })

	return {
		$sessions,
		addSession,
		removeSession,
		resetUndoManager,
		setSessionInitialValue,
	}
}
