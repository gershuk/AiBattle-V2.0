import { Ace, createEditSession, UndoManager } from 'ace-builds'
import {
	attach,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector'

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
	const $sessionsValue = createStore<{ [name: string]: string }>({})

	const addSession = createEvent<SessionItem | SessionItem[]>()
	const removeSession = createEvent<string | string[]>()
	const resetUndoManager = createEvent<string | string[]>()
	const resetSession = createEvent<{
		name: string
		content?: string
	}>()

	const setSessionValue = createEvent<SessionItem | SessionItem[]>()

	const addSessionFx = createEffect(
		(newSession: SessionItem | SessionItem[]) => {
			const array = Array.isArray(newSession) ? newSession : [newSession]
			const newSessions = array.reduce((acc, { name, value }) => {
				//@ts-expect-error
				const session = createEditSession(value || '', mode)
				session.getUndoManager().reset()
				setSessionValue({ name, value })
				session.on('change', () => {
					setSessionValue({ name, value: session.doc.getValue() })
				})
				return {
					...acc,
					[name]: session,
				}
			}, {} as { [name: string]: Ace.EditSession })
			return newSessions
		}
	)

	const resetUndoManagerFx = attach({
		source: $sessions,
		effect: (sessions, nameSession: string | string[]) => {
			const array = Array.isArray(nameSession) ? nameSession : [nameSession]
			array.forEach(nameSession => {
				sessions[nameSession].getUndoManager().reset()
			})
		},
	})

	const resetSessionFx = attach({
		source: $sessions,
		effect: (
			sessions,
			{ name, content }: { name: string; content?: string }
		) => {
			sessions[name].setValue(content ?? '')
		},
	})

	$sessions.on(addSessionFx.doneData, (sessions, newSessions) => ({
		...sessions,
		...newSessions,
	}))

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

	$sessionsValue.on(removeSession, (value, removeSession) => {
		const array = Array.isArray(removeSession) ? removeSession : [removeSession]
		const newValue = { ...value }
		array.forEach(undoName => {
			if (undoName in newValue) {
				delete newValue[undoName]
			}
		})
		return newValue
	})

	$sessionsValue.on(setSessionValue, (values, newSessionValues) => {
		const newValues = (
			Array.isArray(newSessionValues) ? newSessionValues : [newSessionValues]
		).reduce((acc, { name, value = '' }) => ({ ...acc, [name]: value }), {})
		return {
			...values,
			...newValues,
		}
	})

	sample({ clock: resetUndoManager, target: resetUndoManagerFx })

	sample({ clock: resetSession, target: resetSessionFx })

	sample({ clock: addSession, target: addSessionFx })

	return {
		$sessions,
		$sessionsValue,
		addSession,
		removeSession,
		resetUndoManager,
		resetSession,
	}
}
