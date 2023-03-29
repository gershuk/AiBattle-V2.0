import { arrayObjectToHasMap, clsx, useDrag } from 'libs'
import { memo } from 'preact/compat'
import { useEffect, useMemo } from 'preact/hooks'
import './styles.scss'

interface ViewportGameProps {
	className?: string
	canvas: HTMLCanvasElement
	tileSize: number
	map: number[][]
	onChangeTileSize: (newSize: number) => void
	showPlayer?: boolean
	bots?: { position: { x: number; y: number }; botName: string }[]
}

export const ViewportGame = memo(
	({
		className,
		canvas,
		tileSize,
		map,
		onChangeTileSize,
		showPlayer,
		bots,
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

		const botsHashMap = useMemo(() => {
			const _bots = (bots || []).map(({ position, ...rest }) => ({
				...rest,
				position: `${position.x}-${position.y}`,
			}))
			return arrayObjectToHasMap(_bots, 'position')
		}, [bots])

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
			>
				{bots ? (
					<table
						className={clsx(
							'viewport-game-table',
							showPlayer ? 'show-player' : null
						)}
					>
						{map.map((row, i) => (
							<tr>
								{row.map((_, j) => (
									<td
										style={{
											width: tileSize,
											height: tileSize,
											minWidth: tileSize,
											minHeight: tileSize,
										}}
									>
										<span className={'cell-content'}>
											{botsHashMap[`${j}-${i}`] ? (
												<span
													className={'bot-name'}
													style={{ fontSize: tileSize * 0.4 }}
												>
													{botsHashMap[`${j}-${i}`].botName}
												</span>
											) : null}
										</span>
									</td>
								))}
							</tr>
						))}
					</table>
				) : null}
			</div>
		)
	}
)
