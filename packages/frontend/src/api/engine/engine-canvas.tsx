import { useEffect, useMemo, useRef } from 'preact/hooks'
import { clsx } from 'libs/clsx'
import { MapData } from 'model'
import { Store } from 'effector'
import { useUnit } from 'effector-react'
import { memo } from 'preact/compat'

export const createEngineCanvas = ({
	$map,
	$tileSize,
}: {
	$map: Store<MapData['map']>
	$tileSize: Store<number>
}) => {
	const canvas = document.createElement('canvas')

	const CanvasComponent = memo(({ className }: { className?: string }) => {
		const refContainer = useRef<HTMLDivElement | null>(null)
		const { map, tileSize } = useUnit({
			map: $map,
			tileSize: $tileSize,
		})

		const { width, height } = useMemo(() => {
			const maxRowLength = map.reduce(
				(acc, row) => (acc < row.length ? row.length : acc),
				-Infinity
			)
			return {
				height: map.length * tileSize || 0,
				width: maxRowLength * tileSize || 0,
			}
		}, [map, tileSize])

		useEffect(() => {
			canvas.width = width
			canvas.height = height
		}, [width, height])

		useEffect(() => {
			if (refContainer.current) {
				refContainer.current.appendChild(canvas)
			}
		}, [])

		return (
			<div
				style={{ width: width, height: height }}
				ref={refContainer}
				className={clsx(className)}
			></div>
		)
	})

	return { canvas, CanvasComponent }
}
