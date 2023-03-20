import { useEffect, useMemo } from 'preact/hooks'
import { clsx } from 'libs/clsx'
import { MapData } from 'model'
import { Store } from 'effector'
import { useUnit } from 'effector-react'
import { memo } from 'preact/compat'
import { useDrag } from 'libs'

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
		const { refDrag: refContainer, dragEnabled } = useDrag<HTMLDivElement>()

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

		return (
			<div
				onWheel={e => {
					if (!e.ctrlKey) return
					e.preventDefault()
					const newSize = e.deltaY > 0 ? tileSize - 1 : tileSize + 1
					onChangeTileSize(newSize)
				}}
				style={{
					overflow: 'auto',
					width: '100%',
					height: '100%',
					cursor: dragEnabled ? 'grabbing' : 'pointer',
				}}
				ref={refContainer}
				className={clsx('container-viewport-game', className)}
			></div>
		)
	})

	return { canvas, CanvasComponent }
}
