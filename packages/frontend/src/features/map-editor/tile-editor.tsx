import { debounce, deepCopyJson } from 'libs'
import { MapData } from 'model'
import { useCallback } from 'preact/hooks'
import { useState } from 'react'
import { Checkbox, RangeInput } from 'ui'

interface TileEditorProps {
	mapData: MapData
	onChange: (value: string) => void
}

const typeCells = [{ code: 0 }, { code: 1 }, { code: 2 }]

export const TileEditor = ({ mapData, onChange }: TileEditorProps) => {
	const [cellSize, setCellSize] = useState(50)
	const [visibleCode, setVisibleCode] = useState(false)
	const [selectedCode, selectCode] = useState<null | number>(null)

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
				<RangeInput
					min={1}
					max={100}
					initialValue={50}
					step={1}
					className={'tile-scale'}
					onChange={setCellSize}
				/>
				<Checkbox
					label="Показать коды ячеек"
					initialChecked={false}
					onChange={setVisibleCode}
				/>
				<div className={'select-cell-wrapper'}>
					{typeCells.map(({ code }) => (
						<div
							className={'select-cell'}
							onClick={() => selectCode(code === selectedCode ? null : code)}
						>
							<div className={'select-cell-code'}>{code}</div>
							{code === selectedCode ? (
								<svg viewBox="0 0 50 50">
									<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
								</svg>
							) : null}
						</div>
					))}
				</div>
			</div>
			<div className={'tile-editor'}>
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
								>
									<span
										className={'tile-editor-cell-content'}
										style={{ fontSize: cellSize }}
										title={`i: ${i}; j: ${j}; code: ${code}`}
									>
										{visibleCode ? code : ''}
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
