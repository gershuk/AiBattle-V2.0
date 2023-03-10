import { useCallback, useEffect, useRef } from 'preact/hooks'

interface UseKeyboardParams {
	filter: (p: {
		key: KeyboardEvent['key']
		ctrlKey: KeyboardEvent['ctrlKey']
		event: KeyboardEvent
	}) => boolean
	fn: () => void
	targetElement?: HTMLElement | Document | null
	dependencies?: any[]
}

export const useKeyboard = ({
	filter,
	fn,
	targetElement = document,
	dependencies,
}: UseKeyboardParams) => {
	const handlerKeyboard = useCallback((e: KeyboardEvent) => {
		if (filter({ key: e.key, ctrlKey: e.ctrlKey, event: e })) {
			e.preventDefault()
			fn()
		}
	}, dependencies ?? [filter, fn])
	const oldHandler = useRef(handlerKeyboard)
	const oldTargetElement = useRef(targetElement)

	useEffect(() => {
		if (oldTargetElement.current) {
			oldTargetElement.current.removeEventListener(
				'keydown',
				oldHandler.current
			)
		}
		if (targetElement) {
			targetElement.addEventListener('keydown', handlerKeyboard)
			return () => {
				targetElement.removeEventListener('keydown', handlerKeyboard)
			}
		}
		oldTargetElement.current = targetElement
		oldHandler.current = handlerKeyboard
	}, [handlerKeyboard, targetElement])
}
