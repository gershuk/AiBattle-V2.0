import { Ace, createEditSession } from 'ace-builds'
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
	const renameSession = createEvent<{
		oldName: string
		newName: string
	}>()

	const setSessionValue = createEvent<SessionItem | SessionItem[]>()

	const addListenersFx = attach({
		source: $sessions,
		effect: (sessions, name: string | string[]) => {
			const names = Array.isArray(name) ? name : [name]
			names.forEach(name => {
				const session = sessions[name]
				session.removeAllListeners()
				session.addEventListener('change', () => {
					setSessionValue({ name, value: session.doc.getValue() })
				})
			})
		},
	})

	const addSessionFx = createEffect(
		(newSession: SessionItem | SessionItem[]) => {
			const array = Array.isArray(newSession) ? newSession : [newSession]
			const newSessions = array.reduce((acc, { name, value }) => {
				//@ts-expect-error
				const session = createEditSession(value || '', mode)
				session.getUndoManager().reset()
				setSessionValue({ name, value })

				return {
					...acc,
					[name]: session,
				}
			}, {} as { [name: string]: Ace.EditSession })
			return newSessions
		}
	)

	const removeSessionFx = attach({
		source: $sessions,
		effect: (sessions, nameSession: string | string[]) => {
			const names = Array.isArray(nameSession) ? nameSession : [nameSession]
			const newSessions = { ...sessions }
			names.forEach(nameSession => {
				if (nameSession in newSessions) {
					const targetSession = newSessions[nameSession]
					delete newSessions[nameSession]
					targetSession.destroy()
				}
			})
			return newSessions
		},
	})

	const resetUndoManagerFx = attach({
		source: $sessions,
		effect: (sessions, nameSession: string | string[]) => {
			const names = Array.isArray(nameSession) ? nameSession : [nameSession]
			names.forEach(nameSession => {
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

	$sessions.on(removeSessionFx.doneData, (_, newSessions) => newSessions)

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

	$sessions.on(renameSession, (sessions, { oldName, newName }) => {
		const temp = sessions[oldName]
		const newSessions = { ...sessions }
		delete newSessions[oldName]
		return {
			...newSessions,
			[newName]: temp,
		}
	})

	$sessionsValue.on(renameSession, (sessionsValue, { oldName, newName }) => {
		const temp = sessionsValue[oldName]
		const newSessionsValue = { ...sessionsValue }
		delete newSessionsValue[oldName]
		return {
			...newSessionsValue,
			[newName]: temp,
		}
	})

	sample({ clock: resetUndoManager, target: resetUndoManagerFx })

	sample({ clock: resetSession, target: resetSessionFx })

	sample({ clock: addSession, target: addSessionFx })

	sample({ clock: removeSession, target: removeSessionFx })

	sample({
		clock: addSessionFx.done,
		fn: ({ params }) =>
			(Array.isArray(params) ? params : [params]).map(({ name }) => name),
		target: addListenersFx,
	})

	sample({
		clock: renameSession,
		fn: ({ newName }) => newName,
		target: addListenersFx,
	})

	return {
		$sessions,
		$sessionsValue,
		addSession,
		removeSession,
		resetUndoManager,
		resetSession,
		renameSession,
	}
}
