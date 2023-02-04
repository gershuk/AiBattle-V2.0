import { clsx, debounce, deepCopyJson } from 'libs'
import { MapData } from 'model'
import { useCallback } from 'preact/hooks'
import { useState } from 'react'
import { Checkbox, RangeInput } from 'ui'

interface TileEditorProps {
	mapData: MapData
	onChange: (value: string) => void
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

export const TileEditor = ({ mapData, onChange }: TileEditorProps) => {
	const [cellSize, setCellSize] = useState(50)
	const [visibleCode, setVisibleCode] = useState(false)
	const [selectedCode, selectCode] = useState<null | number>(null)
	const [visibleGrid, setVisibleGrid] = useState(false)

	const [mouseDown, setMouseDown] = useState(false)

	const changeMap = useCallback(
		debounce(({ i, j, code }: { i: number; j: number; code: number }) => {
			const cloneMapData = deepCopyJson(mapData)
			cloneMapData.map[i][j] = code
			onChange(JSON.stringify(cloneMapData, null, 4))
		}, 10),
		[onChange, mapData]
	)

	const onMouseDownHandler = (params: { i: number; j: number }) => {
		if (selectedCode !== null) {
			setMouseDown(true)
			changeMap({ ...params, code: selectedCode })
		}
	}

	const onMouseEnterHandler = (params: { i: number; j: number }) => {
		if (selectedCode !== null && mouseDown) {
			setMouseDown(true)
			changeMap({ ...params, code: selectedCode })
		}
	}

	const onMouseUpHandler = () => {
		console.log('onMouseUpHandler')
		setMouseDown(false)
	}

	return (
		<div className={'tile-editor-wrapper'}>
			<div className={'tile-editor-toolbar'}>
				<div>
					<RangeInput
						min={1}
						max={100}
						initialValue={50}
						step={1}
						className={'tile-scale'}
						onChange={setCellSize}
					/>
				</div>
				<div>
					<Checkbox
						label="Показать коды ячеек"
						initialChecked={false}
						onChange={setVisibleCode}
					/>
				</div>
				<div>
					<Checkbox
						label="Включить сетку"
						initialChecked={false}
						onChange={setVisibleGrid}
					/>
				</div>
				<div className={'type-cell-wrapper'}>
					{typeCells.map(({ code, uriImg }) => (
						<div
							className={clsx({
								'type-cell': true,
								active: code === selectedCode,
							})}
							onClick={() => selectCode(code === selectedCode ? null : code)}
						>
							<img src={uriImg} className={'type-cell-img'} />
							{visibleCode ? (
								<div className={'type-cell-code'}>{code}</div>
							) : null}
						</div>
					))}
				</div>
			</div>
			<div
				className={clsx({ 'tile-editor': true, 'visible-grid': visibleGrid })}
			>
				<table>
					{mapData.map.map((row, i) => (
						<tr>
							{row.map((code, j) => (
								<td
									className={'tile-editor-cell'}
									style={{
										width: cellSize,
										height: cellSize,
										minWidth: cellSize,
									}}
									onMouseDown={() => onMouseDownHandler({ i, j })}
									onMouseUp={onMouseUpHandler}
									onMouseEnter={() => onMouseEnterHandler({ i, j })}
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
									</span>
								</td>
							))}
						</tr>
					))}
				</table>
			</div>
		</div>
	)
}
