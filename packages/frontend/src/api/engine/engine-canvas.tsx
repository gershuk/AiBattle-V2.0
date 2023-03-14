import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { clsx } from 'libs/clsx'
import { MapData } from 'model'
import { Store } from 'effector'
import { useUnit } from 'effector-react'
import { memo } from 'preact/compat'
import { useCallback } from 'react'
import { debounce } from 'libs'

export const createEngineCanvas = ({
	$map,
	$tileSize,
	onChangeTileSize,
}: {
	$map: Store<MapData['map']>
	$tileSize: Store<number | null>
	onChangeTileSize: (size: number) => void
}) => {
	const canvas = document.createElement('canvas')

	const CanvasComponent = memo(({ className }: { className?: string }) => {
		const refContainer = useRef<HTMLDivElement | null>(null)
		const [drag, setDrag] = useState<{
			enable: boolean
			scrollLeft: number
			scrollTop: number
			clientX: number
			clientY: number
		}>({ enable: false, scrollLeft: 0, scrollTop: 0, clientX: 0, clientY: 0 })

		const { map, tileSize: _tileSize } = useUnit({
			map: $map,
			tileSize: $tileSize,
		})

		const tileSize = _tileSize || 0

		const { width, height } = useMemo(() => {
			const maxRowLength = map.reduce(
				(acc, row) => (acc < row.length ? row.length : acc),
				-Infinity
			)
			return {
				height: map.length * tileSize,
				width: maxRowLength * tileSize,
			}
		}, [map, tileSize])

		useEffect(() => {
			canvas.width = width
			canvas.height = height
			canvas.style.width = `${width}px`
			canvas.style.height = `${height}px`
		}, [width, height])

		useEffect(() => {
			if (refContainer.current) {
				refContainer.current.appendChild(canvas)
			}
		}, [])

		const mouseDragHandler = useCallback(
			debounce((e: MouseEvent) => {
				const { clientX, scrollLeft, scrollTop, clientY } = drag
				refContainer.current!.scrollLeft = scrollLeft - (e.clientX - clientX)
				refContainer.current!.scrollTop = scrollTop - (e.clientY - clientY)
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

		return (
			<div
				onWheel={e => {
					if (!e.ctrlKey) return
					e.preventDefault()
					const newSize = e.deltaY > 0 ? tileSize - 1 : tileSize + 1
					onChangeTileSize(newSize)
				}}
				onMouseDown={e =>
					setDrag({
						enable: true,
						scrollLeft: e.currentTarget.scrollLeft,
						scrollTop: e.currentTarget.scrollTop,
						clientX: e.screenX,
						clientY: e.clientY,
					})
				}
				style={{
					overflow: 'auto',
					width: '100%',
					height: '100%',
					cursor: drag.enable ? 'grabbing' : 'pointer',
				}}
				ref={refContainer}
				className={clsx('container-viewport-game', className)}
			></div>
		)
	})

	return { canvas, CanvasComponent }
}
