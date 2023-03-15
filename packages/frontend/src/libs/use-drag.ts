import { useCallback, useEffect, useState } from 'preact/hooks'
import { useMemo, useRef } from 'react'
import { debounce } from './debounce'

export const useDrag = <T extends HTMLElement = HTMLElement>() => {
	const [drag, setDrag] = useState<{
		enable: boolean
		scrollLeft: number
		scrollTop: number
		clientX: number
		clientY: number
	}>({ enable: false, scrollLeft: 0, scrollTop: 0, clientX: 0, clientY: 0 })

	const dragEnabled = useMemo(() => drag.enable, [drag])

	const refDrag = useRef<T>(null)

	const mouseDragHandler = useCallback(
		debounce((e: MouseEvent) => {
			const { clientX, scrollLeft, scrollTop, clientY } = drag
			refDrag.current!.scrollLeft = scrollLeft - (e.clientX - clientX)
			refDrag.current!.scrollTop = scrollTop - (e.clientY - clientY)
		}, 5),
		[drag]
	)

	const mouseUpHandler = useCallback(() => {
		setDrag({
			enable: false,
			scrollLeft: 0,
			scrollTop: 0,
			clientX: 0,
			clientY: 0,
		})
	}, [])

	useEffect(() => {
		if (drag.enable) {
			window.document.addEventListener('mousemove', mouseDragHandler)
			window.document.addEventListener('mouseup', mouseUpHandler)
		} else {
			window.document.removeEventListener('mouseup', mouseUpHandler)
		}
		return () => {
			window.document.removeEventListener('mousemove', mouseDragHandler)
			window.document.removeEventListener('mouseup', mouseUpHandler)
		}
	}, [drag])

	useEffect(() => {
		const mouseDownHandler = (e: MouseEvent) => {
			setDrag({
				enable: true,
				scrollLeft: refDrag.current!.scrollLeft,
				scrollTop: refDrag.current!.scrollTop,
				clientX: e.screenX,
				clientY: e.clientY,
			})
		}

		if (refDrag.current) {
			refDrag.current.addEventListener('mousedown', mouseDownHandler)
		}
		return () => {
			refDrag.current?.removeEventListener('mousedown', mouseDownHandler)
		}
	}, [])

	return { dragEnabled, refDrag }
}
