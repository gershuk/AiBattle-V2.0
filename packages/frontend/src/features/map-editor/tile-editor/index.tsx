import { useUnit } from 'effector-react'
import {
	jsonToBeautifulString,
	clsx,
	debounce,
	deepCopyJson,
	useKeyboard,
} from 'libs'
import { MapData } from 'model'
import { useCallback, useState, useEffect } from 'preact/hooks'
import { Button, Checkbox, RangeInput, showMessage } from 'ui'
import {
	$activeCode,
	$cellSize,
	$mode,
	$visibleCode,
	$visibleGrid,
	changedCellSize,
	selectedActiveCode,
	setMode,
	toggleVisibleCode,
	toggleVisibleGrid,
} from '../model'
import { ListSpawns } from './list-spawns'
import './styles.scss'
import { TileTable } from './tile-table'

interface TileEditorProps {
	mapData: MapData
	onChange: (value: string) => void
	onUndo: () => void
	onSave: (value: string) => void
	onRedo: () => void
	modify: boolean
	canUndo: boolean
	canRedo: boolean
}

const typeCells = [
	{ code: 0, uriImg: './Resources/Grass.png' },
	{ code: 1, uriImg: './Resources/Wall.png' },
	{ code: 2, uriImg: './Resources/Metal.png' },
]

export const TileEditor = ({
	mapData,
	onChange,
	onUndo,
	onRedo,
	onSave,
	modify,
	canUndo,
	canRedo,
}: TileEditorProps) => {
	const { activeCode, visibleCode, visibleGrid, cellSize, mode } = useUnit({
		activeCode: $activeCode,
		visibleCode: $visibleCode,
		visibleGrid: $visibleGrid,
		cellSize: $cellSize,
		mode: $mode,
	})
	const [htmlRef, setHtmlRef] = useState<HTMLDivElement | null>(null)
	const [mouseDown, setMouseDown] = useState(false)

	useKeyboard({
		guard: ({ key, ctrlKey }) => ctrlKey && key.toLowerCase() === 'z',
		fn: onUndo,
		targetElement: htmlRef,
		dependencies: [onUndo, htmlRef],
	})

	useKeyboard({
		guard: ({ key, ctrlKey }) => ctrlKey && key.toLowerCase() === 's',
		fn: () => onSave(jsonToBeautifulString(mapData)),
		targetElement: htmlRef,
		dependencies: [onSave, htmlRef],
	})

	useEffect(() => {
		return () => {
			setMode('none')
			selectedActiveCode(null)
		}
	}, [])

	const changeCellMap = useCallback(
		debounce(({ i, j, code }: { i: number; j: number; code: number }) => {
			const cloneMapData = deepCopyJson(mapData)
			cloneMapData.map[i][j] = code
			onChange(jsonToBeautifulString(cloneMapData))
		}, 10),
		[onChange, mapData]
	)

	const changeSpawn = (spawns: MapData['spawns']) => {
		const cloneMapData = deepCopyJson(mapData)
		cloneMapData.spawns = spawns
		onChange(jsonToBeautifulString(cloneMapData))
	}

	const onStartDraw = ({ i, j }: { i: number; j: number }) => {
		setMouseDown(true)
		if (mode === 'draw-tile' && activeCode !== null) {
			changeCellMap({ i, j, code: activeCode })
		} else if (mode === 'add-spawn') {
			const spawnExists = mapData.spawns.find(({ x, y }) => x === j && y === i)
			if (spawnExists) {
				showMessage({
					content: 'Невозможно поставить 2 одинаковые точки спавна.',
				})
				return
			}
			const newSpawns = [...mapData.spawns, { x: j, y: i }]
			changeSpawn(newSpawns)
			setMode('none')
		}
	}

	const onDraw = (params: { i: number; j: number }) => {
		if (mode === 'draw-tile' && activeCode !== null && mouseDown) {
			setMouseDown(true)
			changeCellMap({ ...params, code: activeCode })
		}
	}

	const onStopDraw = () => {
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
					<Button color="warning" onClick={() => onRedo()} disabled={!canRedo}>
						<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16a8.002 8.002 0 0 1 7.6-5.5c1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
						</svg>
					</Button>
					<Button
						color="warning"
						onClick={() => onSave(jsonToBeautifulString(mapData))}
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
						initValue={cellSize}
						step={1}
						className={'tile-scale'}
						onChange={changedCellSize}
					/>
				</div>
				<div className={'tile-editor-toolbar-row'}>
					<Checkbox
						label="Показать коды ячеек"
						initValue={visibleCode}
						onChange={toggleVisibleCode}
					/>
				</div>
				<div className={'tile-editor-toolbar-row'}>
					<Checkbox
						label="Включить сетку"
						initValue={visibleGrid}
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
					<ListSpawns
						spawns={mapData.spawns}
						classNameWrapper={'tile-editor-toolbar-row'}
						onChangeSpawn={changeSpawn}
					/>
				</div>
			</div>
			<div className={clsx('tile-map-wrapper')} onMouseLeave={onStopDraw}>
				<TileTable
					mapData={mapData}
					cellSize={cellSize}
					visibleCode={visibleCode}
					visibleGrid={visibleGrid}
					onDraw={onDraw}
					onStartDraw={onStartDraw}
					onStopDraw={onStopDraw}
				/>
			</div>
		</div>
	)
}
