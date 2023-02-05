import { useCallback, useEffect } from 'preact/hooks'

interface UseKeyboardParams {
	guard: (p: {
		key: KeyboardEvent['key']
		ctrlKey: KeyboardEvent['ctrlKey']
		event: KeyboardEvent
	}) => boolean
	fn: () => void
	targetElement?: HTMLElement | Document | null
	dependencies?: any[]
}

export const useKeyboard = ({
	guard,
	fn,
	targetElement = document,
	dependencies,
}: UseKeyboardParams) => {
	const handlerKeyboard = useCallback((e: KeyboardEvent) => {
		e.preventDefault()
		if (guard({ key: e.key, ctrlKey: e.ctrlKey, event: e })) {
			fn()
		}
	}, dependencies ?? [guard, fn])

	useEffect(() => {
		if (targetElement) {
			targetElement.removeEventListener('keydown', handlerKeyboard)
			targetElement.addEventListener('keydown', handlerKeyboard)
			return () => {
				targetElement.removeEventListener('keydown', handlerKeyboard)
			}
		}
	}, [handlerKeyboard, targetElement])
}
