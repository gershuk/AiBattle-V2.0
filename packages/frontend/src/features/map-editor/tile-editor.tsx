import { useUnit } from 'effector-react'
import { clsx, debounce, deepCopyJson, useKeyboard } from 'libs'
import { MapData } from 'model'
import { useCallback, useState } from 'preact/hooks'
import { Button, Checkbox, RangeInput } from 'ui'
import {
	$activeCode,
	$cellSize,
	$visibleCode,
	$visibleGrid,
	changedCellSize,
	selectedActiveCode,
	toggleVisibleCode,
	toggleVisibleGrid,
} from './model/tile-editor'

interface TileEditorProps {
	mapData: MapData
	onChange: (value: string) => void
	onUndo: () => void
	onSave: (value: string) => void
	modify: boolean
	canUndo: boolean
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

const mapDataToString = (mapData: MapData) => JSON.stringify(mapData, null, 4)

export const TileEditor = ({
	mapData,
	onChange,
	onUndo,
	onSave,
	modify,
	canUndo,
}: TileEditorProps) => {
	const { activeCode, visibleCode, visibleGrid, cellSize } = useUnit({
		activeCode: $activeCode,
		visibleCode: $visibleCode,
		visibleGrid: $visibleGrid,
		cellSize: $cellSize,
	})
	const [htmlRef, setHtmlRef] = useState<HTMLDivElement | null>(null)
	const [mouseDown, setMouseDown] = useState(false)

	useKeyboard({
		guard: ({ key, ctrlKey }) => ctrlKey && key.toLowerCase() === 'z',
		fn: onUndo,
		targetElement: htmlRef,
		dependencies: [onUndo],
	})

	useKeyboard({
		guard: ({ key, ctrlKey }) => ctrlKey && key.toLowerCase() === 's',
		fn: () => onSave(mapDataToString(mapData)),
		targetElement: htmlRef,
		dependencies: [onSave],
	})

	const changeMap = useCallback(
		debounce(({ i, j, code }: { i: number; j: number; code: number }) => {
			const cloneMapData = deepCopyJson(mapData)
			cloneMapData.map[i][j] = code
			onChange(mapDataToString(cloneMapData))
		}, 10),
		[onChange, mapData]
	)

	const onMouseDownHandler = (params: { i: number; j: number }) => {
		if (activeCode !== null) {
			setMouseDown(true)
			changeMap({ ...params, code: activeCode })
		}
	}

	const onMouseEnterHandler = (params: { i: number; j: number }) => {
		if (activeCode !== null && mouseDown) {
			setMouseDown(true)
			changeMap({ ...params, code: activeCode })
		}
	}

	const onMouseUpHandler = () => {
		setMouseDown(false)
	}

	return (
		<div
			className={'tile-editor-wrapper'}
			tabIndex={0}
			ref={ref => setHtmlRef(ref)}
		>
			<div className={'tile-editor-toolbar'}>
				<div className={'tile-editor-toolbar-row tile-editor-toolbar-actions'}>
					<Button color="warning" onClick={() => onUndo()} disabled={!canUndo}>
						<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
						</svg>
					</Button>
					<Button
						color="warning"
						onClick={() => onSave(mapDataToString(mapData))}
						disabled={!modify}
					>
						<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
						</svg>
					</Button>
				</div>
				<div className={'tile-editor-toolbar-row tile-scale-wrapper'}>
					<span className={'tile-scale-title'}>Размер тайла</span>
					<RangeInput
						min={1}
						max={100}
						initialValue={cellSize}
						step={1}
						className={'tile-scale'}
						onChange={changedCellSize}
					/>
				</div>
				<div className={'tile-editor-toolbar-row'}>
					<Checkbox
						label="Показать коды ячеек"
						initialChecked={visibleCode}
						onChange={toggleVisibleCode}
					/>
				</div>
				<div className={'tile-editor-toolbar-row'}>
					<Checkbox
						label="Включить сетку"
						initialChecked={visibleGrid}
						onChange={toggleVisibleGrid}
					/>
				</div>
				<div className={'tile-editor-toolbar-row'}>
					<span className={'type-cell-title'}>
						Выберите активный тайл для рисования:
					</span>
					<div className={'type-cell-wrapper'}>
						{typeCells.map(({ code, uriImg }) => (
							<div
								className={clsx({
									'type-cell': true,
									active: code === activeCode,
								})}
								onClick={() =>
									selectedActiveCode(code === activeCode ? null : code)
								}
							>
								<img src={uriImg} className={'type-cell-img'} />
								{visibleCode ? (
									<div className={'type-cell-code'}>{code}</div>
								) : null}
							</div>
						))}
					</div>
				</div>
			</div>
			<div className={clsx({ 'tile-map': true, 'visible-grid': visibleGrid })}>
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
