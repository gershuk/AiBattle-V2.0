import { clsx, useDrag } from 'libs'
import { memo } from 'preact/compat'
import { useEffect, useMemo } from 'preact/hooks'

interface ViewportGameProps {
	className?: string
	canvas: HTMLCanvasElement
	tileSize: number
	map: number[][]
	onChangeTileSize: (newSize: number) => void
}

export const ViewportGame = memo(
	({
		className,
		canvas,
		tileSize,
		map,
		onChangeTileSize,
	}: ViewportGameProps) => {
		const { refDrag: refContainer, dragEnabled } = useDrag<HTMLDivElement>()

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
	}
)
