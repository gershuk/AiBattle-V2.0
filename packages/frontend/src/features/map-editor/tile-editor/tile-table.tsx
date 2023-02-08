import { clsx } from 'libs'
import { MapData } from 'model'
import { useMemo } from 'preact/hooks'

export interface TileTableProps {
	mapData: MapData
	cellSize: number
	visibleCode?: boolean
	visibleGrid?: boolean
	onStartDraw?: (obj: { i: number; j: number }) => void
	onStopDraw?: () => void
	onDraw?: (obj: { i: number; j: number }) => void
}

const typeCells = [
	{ code: 0, uriImg: './Resources/Grass.png' },
	{ code: 1, uriImg: './Resources/Wall.png' },
	{ code: 2, uriImg: './Resources/Metal.png' },
]

const codesImgMap = typeCells.reduce(
	(acc, { code, uriImg }) => ({ ...acc, [code]: uriImg }),
	{} as { [k: number]: string }
)

export const TileTable = ({
	mapData,
	cellSize,
	visibleCode,
	visibleGrid,
	onStartDraw,
	onStopDraw,
	onDraw,
}: TileTableProps) => {
	const spawns = useMemo(
		() => mapData.spawns.map(({ x, y }) => `${y}-${x}`),
		[mapData]
	)

	return (
		<table className={clsx({ 'visible-grid': !!visibleGrid, 'tile-map': true })}>
			{mapData.map.map((row, i) => (
				<tr>
					{row.map((code, j) => (
						<td
							className={'tile-editor-cell'}
							style={{
								width: cellSize,
								height: cellSize,
								minWidth: cellSize,
								minHeight: cellSize,
							}}
							onMouseDown={() => onStartDraw?.({ i, j })}
							onMouseUp={onStopDraw}
							onMouseEnter={() => onDraw?.({ i, j })}
							title={`i: ${i}; j: ${j}; code: ${code}`}
						>
							<span
								className={'tile-editor-cell-content'}
								style={{ fontSize: cellSize }}
							>
								{visibleCode ? (
									<span className={'tile-editor-cell-content-code'}>
										{code}
									</span>
								) : null}
								<img
									src={codesImgMap[code]}
									className={'tile-editor-cell-content-img'}
								/>
								{spawns.includes(`${i}-${j}`) ? (
									<img
										src={'./Resources/Man.png'}
										className={'tile-editor-cell-content-man'}
									/>
								) : null}
							</span>
						</td>
					))}
				</tr>
			))}
		</table>
	)
}
